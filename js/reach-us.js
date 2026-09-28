(function () {
  "use strict";

  var form = document.getElementById("reachForm");
  if (!form) return;

  var statusEl = document.getElementById("formStatus");
  var fields = {
    firstName: document.getElementById("firstName"),
    lastName: document.getElementById("lastName"),
    email: document.getElementById("email"),
    phone: document.getElementById("phone"),
    subject: document.getElementById("subject"),
    message: document.getElementById("message"),
    privacy: document.getElementById("privacy"),
  };

  function setStatus(message, type) {
    if (!statusEl) return;
    if (!message) {
      statusEl.hidden = true;
      statusEl.textContent = "";
      statusEl.className = "reach-form-status";
      return;
    }
    statusEl.hidden = false;
    statusEl.textContent = message;
    statusEl.className = "reach-form-status reach-form-status--" + type;
  }

  function clearErrors() {
    Object.keys(fields).forEach(function (key) {
      var el = fields[key];
      if (!el) return;
      el.classList.remove("is-invalid");
      el.removeAttribute("aria-invalid");
      var wrap = el.closest(".reach-field") || el.closest(".reach-privacy");
      if (wrap) wrap.classList.remove("has-error");
    });
    var phoneWrap = form.querySelector(".reach-phone");
    if (phoneWrap) phoneWrap.classList.remove("is-invalid");
  }

  function markInvalid(el) {
    if (!el) return;
    el.classList.add("is-invalid");
    el.setAttribute("aria-invalid", "true");
    var wrap = el.closest(".reach-field") || el.closest(".reach-privacy");
    if (wrap) wrap.classList.add("has-error");
    if (el.id === "phone") {
      var phoneWrap = form.querySelector(".reach-phone");
      if (phoneWrap) phoneWrap.classList.add("is-invalid");
    }
  }

  function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearErrors();
    setStatus("", "");

    var missing = [];
    var firstInvalid = null;

    function requireText(el, label) {
      var value = (el.value || "").trim();
      if (!value) {
        missing.push(label);
        markInvalid(el);
        if (!firstInvalid) firstInvalid = el;
        return false;
      }
      return true;
    }

    requireText(fields.firstName, "First name");
    requireText(fields.lastName, "Last name");

    var emailVal = (fields.email.value || "").trim();
    if (!emailVal) {
      missing.push("Email");
      markInvalid(fields.email);
      if (!firstInvalid) firstInvalid = fields.email;
    } else if (!isEmail(emailVal)) {
      missing.push("a valid email");
      markInvalid(fields.email);
      if (!firstInvalid) firstInvalid = fields.email;
    }

    requireText(fields.phone, "Phone number");
    requireText(fields.subject, "Subject");
    requireText(fields.message, "Message");

    if (!fields.privacy.checked) {
      missing.push("privacy agreement");
      markInvalid(fields.privacy);
      if (!firstInvalid) firstInvalid = fields.privacy;
    }

    if (missing.length) {
      setStatus("Please complete all required fields: " + missing.join(", ") + ".", "error");
      if (firstInvalid && firstInvalid.focus) firstInvalid.focus();
      return;
    }

    setStatus("Thank you. Your message has been received.", "success");
    form.reset();
  });

  form.addEventListener("input", function (e) {
    var t = e.target;
    if (!t) return;
    t.classList.remove("is-invalid");
    t.removeAttribute("aria-invalid");
    var wrap = t.closest(".reach-field") || t.closest(".reach-privacy");
    if (wrap) wrap.classList.remove("has-error");
    if (t.id === "phone") {
      var phoneWrap = form.querySelector(".reach-phone");
      if (phoneWrap) phoneWrap.classList.remove("is-invalid");
    }
  });
})();
