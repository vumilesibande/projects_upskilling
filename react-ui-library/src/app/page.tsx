"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useState } from "react";


import type { FormField, GalleryItem } from "@/components";
import {
  Accordion,
  Button,
  Carousel,
  CountdownTimer,
  Drawer,
  Form,
  Gallery,
  Modal,
  ScrollAnimation,
  Video,
} from "@/components";

function createPlaceholderImage(label: string, fromColor: string, toColor: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${fromColor}" />
          <stop offset="100%" stop-color="${toColor}" />
        </linearGradient>
      </defs>
      <rect width="1200" height="675" fill="url(#bg)" rx="28" />
      <circle cx="220" cy="160" r="90" fill="rgba(255,255,255,0.18)" />
      <circle cx="980" cy="520" r="120" fill="rgba(255,255,255,0.12)" />
      <text x="80" y="560" fill="white" font-size="74" font-family="Arial, sans-serif" font-weight="700">${label}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function createSolidTextBanner(label: string, backgroundColor: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
      <rect width="1200" height="675" fill="${backgroundColor}" />
      <text x="60" y="360" fill="white" font-size="74" font-family="Arial, sans-serif" font-weight="700">${label}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const showcaseImages = [
  {
    src: "/profile/easter-image.png",
    alt: "easter image",
    headline: "Easter Image",
    subtext: "Background image banner with text overlay.",
  },
  //This banner only has text with background colour
  {
    src: createSolidTextBanner("Product Story", "#4f46e5"),
    alt: "Gradient product story banner",
  },
  {
    src: "/profile/seasonal-launch.png",
    alt: "seasonal launch banner",
  },
  {
    mediaType: "youtube" as const,
    src: "https://www.youtube.com/embed/AOCpy6EeE4c",
    alt: "Campaign teaser video",
    title: "Campaign teaser video",
  },
];

const accordionItems = [
  {
    title: "What is in the library?",
    content:
      "The library also serves as a demo of components built with React, TypeScript, and Tailwind CSS.",
  },
  {
    title: "Are the examples interactive",
    content:
      "The examples are interactive and can be used to see how to use the components.",
  },
  {
    title: "Can I customize the styling?",
    content:
      "Yes. Each component accepts a className prop so you can extend the base Tailwind styles without changing the internal logic.",
  },
];

const formFields: FormField[] = [
  {
    name: "fullName",
    label: "Full name",
    placeholder: "Jane Doe",
    required: true,
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "jane.doe@example.com",
    required: true,
  },
  {
    name: "topic",
    label: "Topic",
    type: "select",
    required: true,
    options: [
      { label: "Design system", value: "design-system" },
      { label: "Accessibility", value: "accessibility" },
      { label: "Media components", value: "media-components" },
    ],
  },
  {
    name: "message",
    label: "Message",
    type: "textarea",
    placeholder: "This is a placeholder for the message field.",
    required: true,
  },
  {
    name: "consent",
    label: "Consent",
    type: "checkbox",
    placeholder: "I agree to be contacted.",
    required: true,
  },
];

const galleryItems: GalleryItem[] = [
  {
    id: "gallery-image-1",
    type: "image",
    src: "/profile/banner-five.jpg",
    alt: "banner five",
    width: 1200,
    height: 675,
  },
  {
    id: "gallery-image-2",
    type: "image",
    src: "/profile/banner-four.jpg",
    alt: "banner four",
    width: 1200,
    height: 675,
  },
  {
    id: "gallery-video-1",
    type: "video",
    videoType: "youtube",
    src: "https://www.youtube.com/watch?v=AOCpy6EeE4c",
    title: "This is a YouTube video",
    thumbnailSrc: "https://img.youtube.com/vi/AOCpy6EeE4c/hqdefault.jpg",
  },
  {
    id: "gallery-video-2",
    type: "video",
    videoType: "mp4",
    src: "/profile/videoplayback.mp4",
    title: "MP4 product video",
    poster: "/profile/banner-one.jpg",
    thumbnailSrc: "/profile/banner-one.jpg",
  },
];

const launchCountdownTarget = "2026-12-31T23:59:59";

function ShowcaseSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 space-y-1">
        <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
      {children}
    </section>
  );
}

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">
            React UI library
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Interactive component showcase
          </h1>
          <p className="max-w-3xl text-base text-slate-600">
            A lightweight set of reusable React UI components built with
            Next.js, TypeScript, and Tailwind CSS.
          </p>
        </div>

        <ShowcaseSection
          title="Carousel"
          description="A simple slide carousel with arrows, dots, and responsive media support."
        >
          <Carousel autoplayInterval={4000} showArrows showDots className="aspect-video">
            {showcaseImages.map((image, index) => (
              <div key={image.alt} className="relative h-full w-full">
                {"mediaType" in image && image.mediaType === "youtube" ? (
                  <iframe
                    src={image.src}
                    title={image.title}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <>
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 1024px"
                      priority={index === 0}
                    />
                    {"headline" in image ? (
                      <div className="absolute inset-0 flex items-end bg-black/30 p-6">
                        <div className="text-white">
                          <h3 className="text-2xl font-bold">{image.headline}</h3>
                          {"subtext" in image && image.subtext ? (
                            <p className="mt-1 text-sm text-slate-100">{image.subtext}</p>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            ))}
          </Carousel>
        </ShowcaseSection>

        <ShowcaseSection
          title="Buttons"
          description="Primary, secondary, outline, and ghost variants with loading and sizing states."
        >
          <div className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button size="sm">Small</Button>
            <Button size="lg" loading>
              Saving
            </Button>
          </div>
        </ShowcaseSection>

        <ShowcaseSection
          title="Countdown timer"
          description="A live event timer with day, hour, minute, and second."
        >
          <CountdownTimer
            targetDate={launchCountdownTarget}
            title="Campaign launch"
            description="Use this component for product launches."
          />
        </ShowcaseSection>

        <ShowcaseSection
          title="Accordion"
          description="Expandable content panels with support for multiple open sections."
        >
          <Accordion items={accordionItems} defaultOpenIndex={0} allowMultiple />
        </ShowcaseSection>

        <div className="grid gap-8 lg:grid-cols-2">
          <ShowcaseSection
            title="Modal"
            description="This is a modal."
          >
            <div className="space-y-4">
              <Button onClick={() => setIsModalOpen(true)}>Open modal</Button>
              <Modal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Launch checklist"
                description="Modal heading."
              >
                <div className="space-y-4 text-sm text-slate-600">
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean id ipsum eu lacus venenatis bibendum quis non dolor. Nunc placerat, magna dapibus dignissim efficitur, est augue iaculis orci, eget ultrices mauris elit ac mi. Maecenas et nibh vel enim ornare lacinia ut in dolor. Fusce vel efficitur est. Praesent feugiat hendrerit nisi, a sagittis turpis mattis eget. In suscipit gravida velit sit amet scelerisque. Vestibulum venenatis porttitor tortor, id imperdiet elit vulputate a. Nunc fringilla tincidunt orci nec auctor. Nam bibendum a mi ut rhoncus. Cras non dignissim nisi. In eu bibendum sem, at tempus sem. Cras in tristique ipsum.</p>
                  <div className="flex gap-3">
                    <Button onClick={() => setIsModalOpen(false)}>Continue</Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </Modal>
            </div>
          </ShowcaseSection>

          <ShowcaseSection
            title="Drawer"
            description="A slide-in side panel for filters, navigation, or compact supporting flows."
          >
            <div className="space-y-4">
              <Button variant="secondary" onClick={() => setIsDrawerOpen(true)}>
                Open drawer
              </Button>
              <Drawer
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                title="Campaign filters"
                description="This drawer can hold controls, summaries, or quick actions."
              >
                <div className="space-y-4 text-sm text-slate-600">
                  <div className="rounded-xl bg-slate-100 p-4">
                    <p className="font-medium text-slate-800">Vestibulum consectetur sagittis vestibulum</p>
                    <p className="mt-1">Nulla tincidunt id quam eleifend sagittis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed arcu urna, elementum ac orci laoreet, congue sagittis felis. Mauris risus ipsum, pretium nec urna eu, imperdiet egestas lorem. Cras bibendum consequat velit non imperdiet.</p>
                  </div>
                  <div className="rounded-xl bg-slate-100 p-4">
                    <p className="font-medium text-slate-800">Nam ornare sem nisi, sed condimentum augue cursus a.</p>
                    <p className="mt-1">Mauris placerat mattis libero sit amet euismod. Sed rhoncus purus porta tempus finibus. Vestibulum sollicitudin feugiat mi nec ornare. Vivamus lobortis condimentum aliquam. </p>
                  </div>
                  <Button fullWidth onClick={() => setIsDrawerOpen(false)}>
                    Apply filters
                  </Button>
                </div>
              </Drawer>
            </div>
          </ShowcaseSection>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <ShowcaseSection
            title="Form"
            description="This is a contact us form with text, select, textarea, and checkbox field support."
          >
            <Form
              title="Contact Us"
              description="This example shows text, select, textarea, and checkbox field support."
              fields={formFields}
              submitLabel="Send request"
            />
          </ShowcaseSection>
        </div>

        <ShowcaseSection
          title="Video"
          description="This components is for both YouTube and MP4 videos."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-800">YouTube embed</p>
              <Video
                type="youtube"
                src="https://www.youtube.com/watch?v=AOCpy6EeE4c"
                title="YouTube video"
              />
            </div>
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-800">MP4 playback</p>
              <Video
                type="mp4"
                src="/videoplayback.mp4"
                title="MP4  video"
              />
            </div>
          </div>
        </ShowcaseSection>

        <ShowcaseSection
          title="Gallery"
          description="This is a mixed media gallery for both images and videos with thumbnail navigation."
        >
          <Gallery items={galleryItems} />
        </ShowcaseSection>

        <ShowcaseSection
          title="Scroll animation"
          description="Animations when scrolling the page."
        >
          <div className="space-y-3">
            <ScrollAnimation variant="slideUp">
              <div className="rounded-xl bg-sky-600 p-6 text-white">
                <p className="font-medium">Slide up</p>
                <p className="mt-2 text-sm text-sky-100">
                  This block animates as it enters the viewport.
                </p>
              </div>
            </ScrollAnimation>
            <ScrollAnimation variant="fadeIn" duration={800}>
              <div className="rounded-xl bg-slate-200 p-6 text-slate-800">
                <p className="font-medium">Fade in</p>
                <p className="mt-2 text-sm text-slate-600">
                  A simple opacity transition for quieter content reveals.
                </p>
              </div>
            </ScrollAnimation>
            <ScrollAnimation variant="slideLeft">
              <div className="rounded-xl bg-slate-800 p-6 text-white">
                <p className="font-medium">Slide from right</p>
                <p className="mt-2 text-sm text-slate-300">
                  Useful for cards, supporting content, or staggered layouts.
                </p>
              </div>
            </ScrollAnimation>
          </div>
        </ShowcaseSection>
      </div>
    </main>
  );
}
