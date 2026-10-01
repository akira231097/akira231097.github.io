// No third-party code or telemetry is loaded before the visitor opts in.
(async function () {
  const assetBase = new URL(".", document.currentScript.src);
  let config;
  try {
    const response = await fetch(new URL("analytics-config.json", assetBase));
    if (!response.ok) return;
    config = await response.json();
  } catch {
    return; // Analytics must never prevent the portfolio from working.
  }
  if (
    location.hostname !== config.productionHostname ||
    !/^[a-z0-9]+$/i.test(config.clarityProjectId || "")
  )
    return;

  const preferenceKey = "portfolio-analytics-consent-v1";
  const privacySignal =
    navigator.globalPrivacyControl === true || navigator.doNotTrack === "1";
  let preference;
  try {
    preference = localStorage.getItem(preferenceKey);
  } catch {
    /* Browsers may disable storage. Keep the choice for this page. */
  }
  let started = false;
  let banner;

  const stylesheet = document.createElement("link");
  stylesheet.rel = "stylesheet";
  stylesheet.href = new URL("analytics.css", assetBase).href;
  document.head.append(stylesheet);

  function start() {
    if (started || preference !== "accepted" || privacySignal) return;
    started = true;
    window.clarity =
      window.clarity ||
      function (...args) {
        (window.clarity.q = window.clarity.q || []).push(args);
      };
    window.clarity("consentv2", {
      analytics_Storage: "granted",
      ad_Storage: "denied",
    });
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.clarity.ms/tag/" + config.clarityProjectId;
    document.head.append(script);
  }

  function choose(value) {
    preference = value;
    try {
      localStorage.setItem(preferenceKey, value);
    } catch {
      /* The page still works when persistence is unavailable. */
    }
    banner?.remove();
    banner = undefined;
    if (value === "accepted") start();
    else if (started) {
      window.clarity("consentv2", {
        analytics_Storage: "denied",
        ad_Storage: "denied",
      });
      window.clarity("consent", false);
      // Reload without Clarity so declining also stops cookieless recording.
      location.reload();
    }
  }

  function showPreferences() {
    if (banner) return;
    banner = document.createElement("aside");
    banner.className = "portfolio-analytics-consent";
    banner.setAttribute("aria-label", "Website analytics preferences");
    banner.innerHTML =
      "<strong>Optional website analytics</strong>" +
      "<p>If you allow it, Microsoft Clarity uses cookies and records page interactions to help me understand visits, clicks, and scrolling. It does not tell me your name or email. " +
      '<a href="https://www.microsoft.com/privacy/privacystatement" target="_blank" rel="noreferrer">Microsoft privacy details</a>.</p>' +
      '<div><button type="button" data-analytics-choice="accepted">Allow analytics</button>' +
      '<button type="button" data-analytics-choice="declined">No thanks</button></div>';
    if (privacySignal) {
      banner.querySelector("p").textContent =
        "Analytics is disabled because your browser sends a privacy signal. Your visits and interactions are not recorded by this site.";
      banner.querySelector('[data-analytics-choice="accepted"]').remove();
      banner.querySelector('[data-analytics-choice="declined"]').textContent =
        "Close";
    }
    document.body.append(banner);
  }

  function track(name) {
    if (
      started &&
      preference === "accepted" &&
      /^[a-z][a-z0-9_]{0,79}$/.test(name)
    ) {
      window.clarity("event", name);
    }
  }

  const settings = document.createElement("button");
  settings.type = "button";
  settings.className = "portfolio-analytics-settings";
  settings.textContent = "Privacy & analytics";
  settings.addEventListener("click", showPreferences);
  (document.querySelector("footer") || document.body).append(settings);

  document.addEventListener("click", (event) => {
    const element = event.target instanceof Element ? event.target : null;
    const choice = element?.closest("[data-analytics-choice]");
    if (choice) {
      choose(choice.dataset.analyticsChoice);
      settings.focus();
      return;
    }
    const annotated = element?.closest("[data-analytics-event]");
    if (annotated) return track(annotated.dataset.analyticsEvent || "");
    const link = element?.closest("a[href]");
    if (!link) return;
    const url = new URL(link.href);
    if (url.protocol === "mailto:") track("contact_email_click");
    else if (url.pathname.endsWith("/sarath-ai-ml-engineer-resume.pdf"))
      track("resume_open");
    else if (
      url.origin === location.origin &&
      url.pathname.endsWith("/evidence.html")
    )
      track("evidence_open");
    else if (url.hostname === "github.com") track("github_click");
    else if (url.hostname === "www.linkedin.com") track("linkedin_click");
  });

  // Respect preferences changed in another tab of the same portfolio.
  window.addEventListener("storage", (event) => {
    if (event.key === preferenceKey) {
      if (event.newValue === "accepted") {
        preference = "accepted";
        start();
      } else {
        preference = "declined";
        location.reload();
      }
    }
  });
  if (!privacySignal && preference === "accepted") start();
  else if (!privacySignal && preference !== "declined") showPreferences();
})();
