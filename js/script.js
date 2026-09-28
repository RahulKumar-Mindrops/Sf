(function () {
  "use strict";

  /* ---------- Mobile nav ---------- */
  var toggle = document.getElementById("navToggle");
  var mobileNav = document.getElementById("mobileNav");

  if (toggle && mobileNav) {
    function setOpen(open) {
      toggle.classList.toggle("is-open", open);
      mobileNav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      if (open) {
        mobileNav.removeAttribute("hidden");
      } else {
        mobileNav.setAttribute("hidden", "");
      }
      document.body.classList.toggle("nav-open", open);
    }

    toggle.addEventListener("click", function () {
      setOpen(!toggle.classList.contains("is-open"));
    });

    mobileNav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") setOpen(false);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 768 && toggle.classList.contains("is-open")) {
        setOpen(false);
      }
    });
  }

  /* ---------- Scroll & page-load animations ---------- */
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  document.documentElement.classList.add("js-anim");

  var LOAD_SELECTORS = [
    ".hero-media",
    ".products-hero-media",
    ".expertise-hero-media",
    ".artem-hero-media",
    ".reach-hero-media",
    ".hero-title",
    ".hero-kicker",
    ".hero-content",
    ".about-title h1",
    ".products-hero-title",
    ".expertise-hero-title",
    ".artem-hero-content",
    ".reach-hero-title",
    "main > section:first-child h1",
  ];

  var SCROLL_SELECTORS = [
    ".legacy-col",
    ".logos-row img",
    ".symphony-heading",
    ".symphony-sub",
    ".symphony-item",
    ".symphony-explore",
    ".retail-copy",
    ".retail-photo",
    ".artem-photo",
    ".artem-copy",
    ".about-intro-col",
    ".about-location-copy",
    ".about-facade",
    ".about-statement-quote",
    ".about-partners-inner > *",
    ".product-block",
    ".expertise-pillar",
    ".expertise-gallery figure",
    ".expertise-statement-quote",
    ".artem-intro-inner > *",
    ".artem-statement-quote",
    ".reach-section-title",
    ".reach-form",
    ".reach-card",
    ".intro-text",
    ".intro-img",
    ".green-feature-text",
    ".exp-tile",
    ".footer-col",
  ];

  function isDecorative(el) {
    if (!el || el.nodeType !== 1) return true;
    if (el.getAttribute("aria-hidden") === "true") return true;
    if (el.closest("[aria-hidden='true']")) return true;
    return false;
  }

  function mark(el, className, delayIndex) {
    if (!el || isDecorative(el)) return;
    if (el.classList.contains("reveal") || el.classList.contains("reveal-load")) return;
    el.classList.add(className);
    if (typeof delayIndex === "number" && delayIndex > 0) {
      el.style.transitionDelay = Math.min(delayIndex * 90, 450) + "ms";
    }
  }

  var loadMarked = [];
  LOAD_SELECTORS.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el) {
      if (loadMarked.indexOf(el) !== -1) return;
      // Prefer animating the content wrapper over nested title alone
      if (el.closest(".hero-content") && !el.classList.contains("hero-content")) return;
      if (el.closest(".artem-hero-content") && !el.classList.contains("artem-hero-content")) return;
      loadMarked.push(el);
    });
  });

  loadMarked.forEach(function (el, i) {
    mark(el, "reveal-load", el.classList.contains("hero-media") || el.className.indexOf("hero-media") !== -1 ? 0 : Math.min(i, 2));
  });

  requestAnimationFrame(function () {
    document.querySelectorAll(".reveal-load").forEach(function (el) {
      el.classList.add("is-visible");
    });
  });

  var candidates = [];
  SCROLL_SELECTORS.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el) {
      if (isDecorative(el)) return;
      if (el.classList.contains("reveal-load") || el.closest(".reveal-load")) return;
      if (el.closest(".hero, [class*='-hero']")) return;
      if (candidates.indexOf(el) === -1) candidates.push(el);
    });
  });

  // Drop nested candidates so only outermost blocks animate
  var toObserve = candidates.filter(function (el) {
    return !candidates.some(function (other) {
      return other !== el && other.contains(el);
    });
  });

  toObserve.forEach(function (el) {
    var delay = 0;
    if (el.parentElement) {
      var siblingTargets = Array.prototype.filter.call(el.parentElement.children, function (child) {
        return toObserve.indexOf(child) !== -1;
      });
      delay = Math.max(0, siblingTargets.indexOf(el));
    }
    mark(el, "reveal", delay);
  });

  var targets = document.querySelectorAll(".reveal");
  if (!targets.length || !("IntersectionObserver" in window)) {
    targets.forEach(function (el) {
      el.classList.add("is-visible");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      root: null,
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.15,
    }
  );

  targets.forEach(function (el) {
    observer.observe(el);
  });
})();
