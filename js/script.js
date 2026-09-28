(function () {
  "use strict";

  var toggle = document.getElementById("navToggle");
  var mobileNav = document.getElementById("mobileNav");
  if (!toggle || !mobileNav) return;

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
})();
