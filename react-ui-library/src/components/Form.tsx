"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";

import { Button } from "./Button";

export type FormFieldType =
  | "text"
  | "email"
  | "tel"
  | "password"
  | "textarea"
  | "select"
  | "checkbox";

export interface FormFieldOption {
  label: string;
  value: string;
}

export interface FormField {
  name: string;
  label: string;
  type?: FormFieldType;
  placeholder?: string;
  required?: boolean;
  helperText?: string;
  options?: FormFieldOption[];
}

export interface FormValues {
  [key: string]: string | boolean;
}

export interface FormProps {
  title?: string;
  description?: string;
  fields: FormField[];
  submitLabel?: string;
  className?: string;
  initialValues?: FormValues;
  onSubmit?: (values: FormValues) => void | Promise<void>;
}

function getInitialValues(fields: FormField[], initialValues?: FormValues) {
  return fields.reduce<FormValues>((accumulator, field) => {
    if (initialValues && field.name in initialValues) {
      accumulator[field.name] = initialValues[field.name];
      return accumulator;
    }

    accumulator[field.name] = field.type === "checkbox" ? false : "";
    return accumulator;
  }, {});
}

export function Form({
  title,
  description,
  fields,
  submitLabel = "Submit",
  className = "",
  initialValues,
  onSubmit,
}: FormProps) {
  const baseValues = useMemo(
    () => getInitialValues(fields, initialValues),
    [fields, initialValues],
  );
  const [values, setValues] = useState<FormValues>(baseValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedValues, setSubmittedValues] = useState<FormValues | null>(null);

  const handleChange = (field: FormField, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const nextValue =
      field.type === "checkbox"
        ? (event.target as HTMLInputElement).checked
        : event.target.value;

    setValues((previous) => ({ ...previous, [field.name]: nextValue }));
    setErrors((previous) => ({ ...previous, [field.name]: "" }));
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    fields.forEach((field) => {
      const value = values[field.name];
      const isEmpty =
        field.type === "checkbox" ? value !== true : String(value ?? "").trim() === "";

      if (field.required && isEmpty) {
        nextErrors[field.name] =
          field.type === "checkbox"
            ? `${field.label} must be accepted.`
            : `${field.label} is required.`;
      }

      if (
        field.type === "email" &&
        String(value ?? "").trim() !== "" &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))
      ) {
        nextErrors[field.name] = "Enter a valid email address.";
      }
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit?.(values);
      setSubmittedValues(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
      {(title || description) && (
        <div className="mb-6 space-y-2">
          {title ? <h3 className="text-xl font-semibold text-slate-900">{title}</h3> : null}
          {description ? <p className="text-sm text-slate-600">{description}</p> : null}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        {fields.map((field) => {
          const fieldType = field.type ?? "text";
          const error = errors[field.name];
          const fieldId = `field-${field.name}`;
          const sharedClassName =
            "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-200";

          return (
            <div key={field.name} className="space-y-2">
              <label
                htmlFor={fieldId}
                className="block text-sm font-medium text-slate-800"
              >
                {field.label}
              </label>

              {fieldType === "textarea" ? (
                <textarea
                  id={fieldId}
                  name={field.name}
                  value={String(values[field.name] ?? "")}
                  placeholder={field.placeholder}
                  onChange={(event) => handleChange(field, event)}
                  rows={4}
                  className={sharedClassName}
                />
              ) : null}

              {fieldType === "select" ? (
                <select
                  id={fieldId}
                  name={field.name}
                  value={String(values[field.name] ?? "")}
                  onChange={(event) => handleChange(field, event)}
                  className={sharedClassName}
                >
                  <option value="">Select an option</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : null}

              {fieldType === "checkbox" ? (
                <label className="flex items-start gap-3 rounded-lg border border-slate-200 px-3 py-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    id={fieldId}
                    name={field.name}
                    checked={Boolean(values[field.name])}
                    onChange={(event) => handleChange(field, event)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span>{field.placeholder ?? field.helperText ?? field.label}</span>
                </label>
              ) : null}

              {!["textarea", "select", "checkbox"].includes(fieldType) ? (
                <input
                  type={fieldType}
                  id={fieldId}
                  name={field.name}
                  value={String(values[field.name] ?? "")}
                  placeholder={field.placeholder}
                  onChange={(event) => handleChange(field, event)}
                  className={sharedClassName}
                />
              ) : null}

              {error ? <p className="text-sm text-rose-600">{error}</p> : null}
              {!error && field.helperText && fieldType !== "checkbox" ? (
                <p className="text-sm text-slate-500">{field.helperText}</p>
              ) : null}
            </div>
          );
        })}

        <Button type="submit" loading={isSubmitting}>
          {submitLabel}
        </Button>
      </form>

      {submittedValues ? (
        <div className="mt-6 rounded-xl bg-slate-50 p-4">
          <p className="mb-2 text-sm font-medium text-slate-800">Submitted values</p>
          <pre className="overflow-x-auto text-xs text-slate-600">
            {JSON.stringify(submittedValues, null, 2)}
          </pre>
        </div>
      ) : null}
    </div>
  );
}
