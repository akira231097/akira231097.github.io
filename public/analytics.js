// Invisible, cookieless analytics. No UI, consent grant, or visitor identity.
(async function () {
  const parameters = new URLSearchParams(location.search);
  // Owner/testing links never create analytics traffic or stored preferences.
  if (parameters.get("portfolio_test") === "1") return;
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
  const attribution = new URLSearchParams();
  for (const key of [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
  ]) {
    const value = parameters.get(key);
    if (value && /^[a-z0-9_-]{1,64}$/i.test(value)) {
      attribution.set(key, value);
      window.clarity("set", "portfolio_" + key, value);
    }
  }
  const message = parameters.get("ref");
  if (/^m_[a-f0-9]{16}$/.test(message || "")) {
    attribution.set("ref", message);
    // This identifies a sent link, never the person who opened it.
    window.clarity("set", "outreach_message", message);
  }
  const script = document.createElement("script");
  script.async = true;
  script.src =
    "https://www.clarity.ms/tag/" + config.cookielessClarityProjectId;
  document.head.append(script);

  function track(name) {
    if (/^[a-z][a-z0-9_]{0,79}$/.test(name)) window.clarity("event", name);
  }

  const observed = new Set();
  function once(name) {
    if (observed.has(name)) return;
    observed.add(name);
    track(name);
  }

  // Visibility plus interaction is a useful signal, not proof of a human.
  let visibleMs = 0;
  let lastTick = performance.now();
  let interacted = false;
  function engagement() {
    if (interacted && visibleMs >= 30000 && !observed.has("engaged_30s")) {
      once("engaged_30s");
      window.clarity(
        "set",
        "portfolio_engagement",
        "visible_30s_and_interacted",
      );
    }
  }
  function interaction(event) {
    if (!event.isTrusted) return;
    interacted = true;
    once("page_interacted");
    engagement();
  }
  document.addEventListener("pointerdown", interaction, { passive: true });
  document.addEventListener("keydown", interaction, { passive: true });
  document.addEventListener("touchstart", interaction, { passive: true });
  const timer = setInterval(() => {
    const now = performance.now();
    if (!document.hidden) visibleMs += Math.min(now - lastTick, 1500);
    lastTick = now;
    for (const seconds of [10, 30, 60]) {
      if (visibleMs >= seconds * 1000) once("page_visible_" + seconds + "s");
    }
    engagement();
    if (visibleMs >= 60000) clearInterval(timer);
  }, 1000);
  document.addEventListener("visibilitychange", () => {
    lastTick = performance.now();
  });

  // Observe section headings, so a tall section doesn't need to fit on screen.
  if (typeof IntersectionObserver !== "undefined") {
    const pending = new Map();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          clearTimeout(pending.get(entry.target));
          pending.delete(entry.target);
          if (!entry.isIntersecting || document.hidden) continue;
          pending.set(
            entry.target,
            setTimeout(() => {
              pending.delete(entry.target);
              if (document.hidden) return;
              once("section_view_" + entry.target.dataset.analyticsSection);
              observer.unobserve(entry.target);
            }, 1000),
          );
        }
      },
      { threshold: 0.5 },
    );
    const attached = new WeakSet();
    function observeSections() {
      for (const section of document.querySelectorAll(
        "main > section[id], main > section article[id]",
      )) {
        if (!/^[a-z][a-z0-9_-]{0,40}$/.test(section.id)) continue;
        const heading = section.querySelector("h1, h2, h3");
        if (!heading || attached.has(heading)) continue;
        attached.add(heading);
        heading.dataset.analyticsSection = section.id.replace(/-/g, "_");
        observer.observe(heading);
      }
    }
    observeSections();
    const root = document.getElementById("root");
    if (root && typeof MutationObserver !== "undefined") {
      new MutationObserver(observeSections).observe(root, {
        childList: true,
        subtree: true,
      });
    }
  }

  document.addEventListener(
    "click",
    (event) => {
      if (!event.isTrusted) return;
      const element = event.target instanceof Element ? event.target : null;
      const link = element?.closest("a[href]");
      if (link && attribution.size) {
        const target = new URL(link.href);
        if (
          target.origin === location.origin &&
          ["/", "/index.html", "/evidence.html"].includes(target.pathname)
        ) {
          for (const [key, value] of attribution)
            target.searchParams.set(key, value);
          link.href = target.href;
        }
      }
      const annotated = element?.closest("[data-analytics-event]");
      if (annotated) return track(annotated.dataset.analyticsEvent || "");
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
      else if (url.hostname === "github.com") {
        const projects = {
          FinishOS: "finishos",
          echofind: "echofind",
          "artha-council": "artha",
          clipopedia: "clipopedia",
          "commitment-decay-engine": "commitment",
          reelforge: "reelforge",
        };
        const project =
          url.pathname.split("/")[1] === "akira231097"
            ? projects[url.pathname.split("/")[2]]
            : null;
        track(project ? "project_source_" + project : "github_click");
      } else if (url.hostname === "www.linkedin.com") track("linkedin_click");
      else if (url.origin === location.origin && /^#[a-z_]+$/.test(url.hash))
        track("navigation_" + url.hash.slice(1));
    },
    true,
  );
})();
