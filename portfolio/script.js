(function () {
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  function closeNav() {
    if (!nav || !toggle) return;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  function scrollToTop() {
    var prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
    if (window.history.replaceState) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    var topEl = document.getElementById("top");
    if (topEl) {
      topEl.focus({ preventScroll: true });
    }
  }

  document.querySelectorAll('a[href="#top"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      scrollToTop();
      closeNav();
    });
  });

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.querySelectorAll('a:not([href="#top"])').forEach(function (link) {
      link.addEventListener("click", function () {
        closeNav();
      });
    });
  }
})();
