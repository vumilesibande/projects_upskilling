const timelineEvents = [
  {
    date: "Jan 2025",
    title: "Project Kickoff",
    summary: "The team aligned on scope, milestones, and delivery plan.",
    details:
      "Stakeholders approved goals, architecture direction, and sprint cadence for the first release.",
    image: "https://picsum.photos/seed/kickoff/900/480",
    imageAlt: "Team in a project kickoff meeting",
  },
  {
    date: "Mar 2025",
    title: "Design System Baseline",
    summary: "Core components and typography tokens were finalized.",
    details:
      "Reusable UI primitives reduced implementation time and improved consistency across pages.",
    image: "https://picsum.photos/seed/design-system/900/480",
    imageAlt: "Design system boards and UI sketches",
  },
  {
    date: "Jun 2025",
    title: "Beta Launch",
    summary: "A beta version was released to a closed user group.",
    details:
      "Feedback informed onboarding improvements, content hierarchy updates, and performance optimizations.",
    image: "https://picsum.photos/seed/beta-launch/900/480",
    imageAlt: "Product dashboard shown during beta launch",
  },
  {
    date: "Sep 2025",
    title: "Public Release",
    summary: "The product launched to all users with analytics monitoring.",
    details:
      "Tracking dashboards were activated to monitor acquisition, engagement, and retention metrics.",
    image: "https://picsum.photos/seed/public-release/900/480",
    imageAlt: "Public release announcement visual",
  },
  {
    date: "Dec 2025",
    title: "Iteration Cycle",
    summary: "Feature enhancements shipped based on usage patterns.",
    details:
      "Improvements focused on accessibility, translation quality, and cross-device UX.",
    image: "https://picsum.photos/seed/iteration-cycle/900/480",
    imageAlt: "Team reviewing product iteration metrics",
  },
];

const BATCH_SIZE = 3;

function createTimelineItem(eventData, template) {
  const fragment = template.content.cloneNode(true);
  const item = fragment.querySelector(".timeline__item");
  const point = fragment.querySelector(".timeline__point");
  const card = fragment.querySelector(".timeline__card");
  const date = fragment.querySelector(".timeline__date");
  const title = fragment.querySelector(".timeline__title");
  const summary = fragment.querySelector(".timeline__summary");
  const media = fragment.querySelector(".timeline__media");
  const image = fragment.querySelector(".timeline__image");
  const details = fragment.querySelector(".timeline__details");

  date.textContent = eventData.date;
  title.textContent = eventData.title;
  summary.textContent = eventData.summary;
  details.textContent = eventData.details;

  if (media && image && eventData.image) {
    image.src = eventData.image;
    image.alt = eventData.imageAlt ?? eventData.title;
    media.hidden = false;
  }

  const toggle = () => {
    const isOpen = item.classList.toggle("is-open");
    point.setAttribute("aria-expanded", String(isOpen));
    details.hidden = !isOpen;
  };

  point.addEventListener("click", toggle);
  card.addEventListener("click", toggle);
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggle();
    }
  });

  return fragment;
}

function initTimeline() {
  const timeline = document.getElementById("timeline");
  const template = document.getElementById("timeline-item-template");

  if (!timeline || !(template instanceof HTMLTemplateElement)) {
    return;
  }

  let nextIndex = 0;
  const visibilityObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          visibilityObserver.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.18 },
  );

  function renderNextBatch() {
    const batch = timelineEvents.slice(nextIndex, nextIndex + BATCH_SIZE);
    if (!batch.length) {
      return false;
    }

    const renderedItems = batch.map((eventData) =>
      createTimelineItem(eventData, template),
    );
    timeline.append(...renderedItems);

    timeline
      .querySelectorAll(".timeline__item:not(.is-visible)")
      .forEach((item) => {
        visibilityObserver.observe(item);
      });

    nextIndex += batch.length;
    return nextIndex < timelineEvents.length;
  }

  const hasMoreAfterInitialBatch = renderNextBatch();

  if (!hasMoreAfterInitialBatch) {
    return;
  }

  const sentinel = document.createElement("div");
  sentinel.className = "timeline__sentinel";
  sentinel.setAttribute("aria-hidden", "true");
  timeline.append(sentinel);

  const loadMoreObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          continue;
        }

        if (window.scrollY <= 0) {
          continue;
        }

        const hasMore = renderNextBatch();
        timeline.append(sentinel);

        if (!hasMore) {
          loadMoreObserver.unobserve(sentinel);
          sentinel.remove();
        }
      }
    },
    {
      threshold: 0,
      rootMargin: "0px 0px 220px 0px",
    },
  );

  loadMoreObserver.observe(sentinel);
}

initTimeline();
