import {
  filterEventsByCategory,
  getCategoryOptions,
  getCurrentEventId,
  normalizeTimelineEvents,
  paginateEvents,
} from "./timeline-core.mjs";

const timelineEvents = [
  {
    id: "kickoff",
    date: "Jan 2025",
    title: "Project Kickoff",
    category: "Planning",
    summary: "The team aligned on scope, milestones, and delivery plan.",
    details:
      "Stakeholders approved goals, architecture direction, and sprint cadence for the first release.",
    image: "https://picsum.photos/seed/kickoff/900/480",
    imageAlt: "Team in a project kickoff meeting",
  },
  {
    id: "design-system",
    date: "Mar 2025",
    title: "Design System Baseline",
    category: "Design",
    summary: "Core components and typography tokens were finalized.",
    details:
      "Reusable UI primitives reduced implementation time and improved consistency across pages.",
    image: "https://picsum.photos/seed/design-system/900/480",
    imageAlt: "Design system boards and UI sketches",
  },
  {
    id: "beta-launch",
    date: "Jun 2025",
    title: "Beta Launch",
    category: "Release",
    summary: "A beta version was released to a closed user group.",
    details:
      "Feedback informed onboarding improvements, content hierarchy updates, and performance optimizations.",
    image: "https://picsum.photos/seed/beta-launch/900/480",
    imageAlt: "Product dashboard shown during beta launch",
  },
  {
    id: "public-release",
    date: "Sep 2025",
    title: "Public Release",
    category: "Release",
    isCurrent: true,
    summary: "The product launched to all users with analytics monitoring.",
    details:
      "Tracking dashboards were activated to monitor acquisition, engagement, and retention metrics.",
    image: "https://picsum.photos/seed/public-release/900/480",
    imageAlt: "Public release announcement visual",
  },
  {
    id: "iteration-cycle",
    date: "Dec 2025",
    title: "Iteration Cycle",
    category: "Iteration",
    summary: "Feature enhancements shipped based on usage patterns.",
    details:
      "Improvements focused on accessibility, translation quality, and cross-device UX.",
    image: "https://picsum.photos/seed/iteration-cycle/900/480",
    imageAlt: "Team reviewing product iteration metrics",
  },
];

const BATCH_SIZE = 3;

function createTimelineItem(eventData, template, state, handlers) {
  const fragment = template.content.cloneNode(true);
  const item = fragment.querySelector(".timeline__item");
  const point = fragment.querySelector(".timeline__point");
  const card = fragment.querySelector(".timeline__card");
  const date = fragment.querySelector(".timeline__date");
  const badge = fragment.querySelector(".timeline__badge");
  const title = fragment.querySelector(".timeline__title");
  const summary = fragment.querySelector(".timeline__summary");
  const category = fragment.querySelector(".timeline__category");
  const media = fragment.querySelector(".timeline__media");
  const image = fragment.querySelector(".timeline__image");
  const details = fragment.querySelector(".timeline__details");

  const detailsId = `timeline-details-${eventData.id}`;

  date.textContent = eventData.displayDate;
  title.textContent = eventData.title;
  summary.textContent = eventData.summary;
  details.textContent = eventData.details;
  details.id = detailsId;
  category.textContent = eventData.category;
  point.setAttribute("aria-controls", detailsId);
  point.setAttribute("aria-label", `Toggle details for ${eventData.title}`);

  if (eventData.id === state.currentEventId) {
    item.classList.add("is-current");
    badge.hidden = false;
    badge.textContent = "Current";
  }

  if (media && image && eventData.image) {
    image.src = eventData.image;
    image.alt = eventData.imageAlt ?? eventData.title;
    media.hidden = false;
  }

  const syncOpenState = () => {
    const isOpen = state.activeEventId === eventData.id;
    item.classList.toggle("is-open", isOpen);
    point.setAttribute("aria-expanded", String(isOpen));
    details.hidden = !isOpen;
    item.classList.toggle("is-active", isOpen);
  };

  const toggle = () => {
    state.activeEventId =
      state.activeEventId === eventData.id ? null : eventData.id;
    handlers.reRender();
  };

  point.addEventListener("click", toggle);
  card.addEventListener("click", toggle);
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggle();
    }
  });

  syncOpenState();

  return fragment;
}

function initTimeline() {
  const timeline = document.getElementById("timeline");
  const template = document.getElementById("timeline-item-template");
  const categorySelect = document.getElementById("timeline-category");
  const status = document.getElementById("timeline-status");
  const emptyState = document.getElementById("timeline-empty");

  if (
    !timeline ||
    !(template instanceof HTMLTemplateElement) ||
    !(categorySelect instanceof HTMLSelectElement) ||
    !status ||
    !emptyState
  ) {
    return;
  }

  const normalizedEvents = normalizeTimelineEvents(timelineEvents);

  if (!normalizedEvents.length) {
    status.textContent = "No timeline events available.";
    emptyState.hidden = false;
    return;
  }

  const state = {
    selectedCategory: "all",
    filteredEvents: [...normalizedEvents],
    nextIndex: 0,
    activeEventId: null,
    currentEventId: getCurrentEventId(normalizedEvents),
    sentinel: null,
    loadMoreObserver: null,
    visibilityObserver: null,
  };

  const categories = getCategoryOptions(normalizedEvents);
  categorySelect.replaceChildren(
    ...categories.map((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category === "all" ? "All categories" : category;
      return option;
    }),
  );

  const updateStatus = () => {
    const total = state.filteredEvents.length;
    const loaded = timeline.querySelectorAll(".timeline__item").length;
    status.textContent = `${loaded} of ${total} events shown`;
  };

  const handlers = {
    reRender: () => {
      const previousCount = timeline.querySelectorAll(".timeline__item").length;
      const shouldPreserveCount = previousCount > BATCH_SIZE;
      renderTimeline({ preserveRenderedCount: shouldPreserveCount });
    },
  };

  const setupVisibilityObserver = () => {
    if (state.visibilityObserver) {
      state.visibilityObserver.disconnect();
    }

    state.visibilityObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            state.visibilityObserver.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.18 },
    );
  };

  const observeVisibleItems = () => {
    timeline
      .querySelectorAll(".timeline__item:not(.is-visible)")
      .forEach((item) => state.visibilityObserver.observe(item));
  };

  const renderNextBatch = (count = BATCH_SIZE) => {
    const batch = paginateEvents(state.filteredEvents, state.nextIndex, count);
    if (!batch.length) {
      return false;
    }

    const renderedItems = batch.map((eventData) =>
      createTimelineItem(eventData, template, state, handlers),
    );
    timeline.append(...renderedItems);
    state.nextIndex += batch.length;
    observeVisibleItems();
    updateStatus();
    return state.nextIndex < state.filteredEvents.length;
  };

  const teardownLoadMoreObserver = () => {
    if (state.loadMoreObserver && state.sentinel) {
      state.loadMoreObserver.unobserve(state.sentinel);
    }
    if (state.loadMoreObserver) {
      state.loadMoreObserver.disconnect();
      state.loadMoreObserver = null;
    }
    if (state.sentinel) {
      state.sentinel.remove();
      state.sentinel = null;
    }
  };

  const setupLoadMoreObserver = () => {
    teardownLoadMoreObserver();

    state.sentinel = document.createElement("div");
    state.sentinel.className = "timeline__sentinel";
    state.sentinel.setAttribute("aria-hidden", "true");
    timeline.append(state.sentinel);

    state.loadMoreObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue;
          }

          if (window.scrollY <= 0) {
            continue;
          }

          const hasMore = renderNextBatch();

          if (state.sentinel && state.sentinel.isConnected) {
            timeline.append(state.sentinel);
          }

          if (!hasMore) {
            teardownLoadMoreObserver();
          }
        }
      },
      {
        threshold: 0,
        rootMargin: "0px 0px 220px 0px",
      },
    );

    state.loadMoreObserver.observe(state.sentinel);
  };

  const renderTimeline = ({ preserveRenderedCount = false } = {}) => {
    const desiredCount = preserveRenderedCount
      ? timeline.querySelectorAll(".timeline__item").length || BATCH_SIZE
      : BATCH_SIZE;

    teardownLoadMoreObserver();
    timeline.replaceChildren();
    state.nextIndex = 0;
    emptyState.hidden = state.filteredEvents.length > 0;

    if (!state.filteredEvents.length) {
      updateStatus();
      return;
    }

    const hasMore = renderNextBatch(desiredCount);
    if (hasMore) {
      setupLoadMoreObserver();
    }
  };

  categorySelect.addEventListener("change", () => {
    state.selectedCategory = categorySelect.value;
    state.filteredEvents = filterEventsByCategory(
      normalizedEvents,
      state.selectedCategory,
    );

    if (
      state.activeEventId &&
      !state.filteredEvents.some((event) => event.id === state.activeEventId)
    ) {
      state.activeEventId = null;
    }

    renderTimeline({ preserveRenderedCount: false });
  });

  setupVisibilityObserver();
  renderTimeline({ preserveRenderedCount: false });
}

initTimeline();
