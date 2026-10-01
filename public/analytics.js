// Invisible, cookieless analytics. No UI, consent grant, or visitor identity.
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
    !/^[a-z0-9]+$/i.test(config.cookielessClarityProjectId || "") ||
    navigator.globalPrivacyControl === true ||
    navigator.doNotTrack === "1"
  )
    return;

  // Preserve any decline recorded by the earlier opt-in version.
  try {
    if (localStorage.getItem("portfolio-analytics-consent-v1") === "declined")
      return;
  } catch {
    /* Storage is optional; no identifiers are stored here. */
  }

  window.clarity =
    window.clarity ||
    function (...args) {
      (window.clarity.q = window.clarity.q || []).push(args);
    };
  // Deny both storage types. Never assume consent on a visitor's behalf.
  window.clarity("consentv2", {
    analytics_Storage: "denied",
    ad_Storage: "denied",
  });
  window.clarity("set", "portfolio_analytics_mode", "cookieless");
  const script = document.createElement("script");
  script.async = true;
  script.src =
    "https://www.clarity.ms/tag/" + config.cookielessClarityProjectId;
  document.head.append(script);

  function track(name) {
    if (/^[a-z][a-z0-9_]{0,79}$/.test(name)) window.clarity("event", name);
  }

  document.addEventListener("click", (event) => {
    const element = event.target instanceof Element ? event.target : null;
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
})();
