# React UI Library

Reusable React UI components built with Next.js 14, TypeScript, and Tailwind CSS.

## Setup

```bash
cd react-ui-library
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to explore the interactive component showcase in `src/app/page.tsx`.

## Components

Import everything from the barrel file:

```tsx
import {
  Accordion,
  Button,
  Carousel,
  Drawer,
  Form,
  Gallery,
  Modal,
  ScrollAnimation,
  Slider,
  Video,
} from "@/components";
```

### Available components

| Component | Purpose | Main props |
|------|------|------|
| `Button` | Reusable action button | `variant`, `size`, `loading`, `disabled`, `leftIcon`, `rightIcon` |
| `Modal` | Controlled dialog overlay | `open`, `onClose`, `title`, `description` |
| `Drawer` | Side panel overlay | `open`, `onClose`, `side`, `title`, `description` |
| `Slider` | Styled range input | `min`, `max`, `step`, `value`, `defaultValue`, `onChange`, `label` |
| `Video` | MP4 and YouTube player wrapper | `type`, `src`, `title`, `poster`, `controls` |
| `Gallery` | Mixed image and video gallery | `items`, `initialIndex`, `thumbnailClassName` |
| `Form` | Config-driven form renderer | `fields`, `title`, `description`, `submitLabel`, `initialValues` |
| `Carousel` | Slide-based media carousel | `children`, `autoplayInterval`, `showArrows`, `showDots` |
| `Accordion` | Expandable content sections | `items`, `allowMultiple`, `defaultOpenIndex` |
| `ScrollAnimation` | Viewport entry animation wrapper | `variant`, `delay`, `duration`, `once` |

## Usage examples

### Button

```tsx
<Button variant="outline" size="lg">
  Learn more
</Button>
```

### Modal

```tsx
const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open modal</Button>
<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Confirm action"
  description="Review the details before continuing."
>
  <p>Your modal content goes here.</p>
</Modal>
```

### Video

```tsx
<Video
  type="youtube"
  src="https://www.youtube.com/watch?v=ysz5S6PUM-U"
  title="YouTube example"
/>

<Video
  type="mp4"
  src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
  title="MP4 example"
/>
```

### Gallery

```tsx
const items = [
  {
    id: "image-1",
    type: "image",
    src: "/images/hero.jpg",
    alt: "Hero image",
    width: 1200,
    height: 675,
  },
  {
    id: "video-1",
    type: "video",
    videoType: "youtube",
    src: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
    title: "Product walkthrough",
  },
];

<Gallery items={items} />
```

### Form

```tsx
const fields = [
  { name: "name", label: "Name", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  {
    name: "message",
    label: "Message",
    type: "textarea",
    placeholder: "How can we help?",
  },
];

<Form fields={fields} submitLabel="Send" />
```

## Notes

- Styling is Tailwind-only, with `className` extension points on the reusable components.
- The home page includes interactive examples for all exported components.
- The `Video` and `Gallery` demos use external sample media URLs. Replace them with your own assets as needed.
