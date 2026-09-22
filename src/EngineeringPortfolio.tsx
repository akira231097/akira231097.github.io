import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import ArchitectureExplorer from "./components/ArchitectureExplorer";
import type {
  ArchitectureDiagram,
  ArchitectureNode,
} from "./components/ArchitectureExplorer";
import { architectureDiagrams } from "./architectureData";
import { engineeringCases, getEngineeringCase } from "./engineeringData";
import type { EngineeringCase } from "./engineeringData";
import { productionSystems } from "./productionData";

function Arrow({ external = false }: { external?: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={external ? "M6 18 18 6M6 6h12v12" : "M4 12h15m-6-6 6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function LinkOut({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={className}
      target={href.startsWith(".") ? undefined : "_blank"}
      rel={href.startsWith(".") ? undefined : "noreferrer"}
    >
      {children}
      <Arrow external />
    </a>
  );
}
const github = "https://github.com/akira231097/";
const repos: Record<string, string> = {
  finishos: "FinishOS",
  echofind: "echofind",
  artha: "artha-council",
  clipopedia: "clipopedia",
  commitment: "commitment-decay-engine",
  reelforge: "reelforge",
};
const domains: Record<string, string> = {
  finishos: "On-device agents",
  echofind: "Search & ranking",
  artha: "Agent systems",
  clipopedia: "Search & ranking",
  commitment: "State & evidence",
  reelforge: "AI media pipelines",
};
const navItems = [
  ["production", "Production"],
  ["architecture", "Architecture"],
  ["projects", "Projects"],
  ["experience", "Experience"],
] as const;
const publicNodeKinds: Record<
  string,
  Record<string, ArchitectureNode["kind"]>
> = {
  finishos: {
    capture: "interface",
    identify: "control",
    remember: "storage",
    pack: "runtime",
    infer: "runtime",
    review: "control",
    handoff: "interface",
  },
  echofind: {
    route: "runtime",
    analyze: "runtime",
    embed: "runtime",
    retrieve: "runtime",
    rank: "runtime",
    select: "runtime",
    deliver: "interface",
  },
  artha: {
    screen: "control",
    council: "runtime",
    proposal: "runtime",
    preview: "control",
    claim: "control",
    submit: "control",
    reconcile: "runtime",
  },
  clipopedia: {
    context: "interface",
    analyze: "runtime",
    search: "runtime",
    fuse: "control",
    rank: "runtime",
    select: "runtime",
    publish: "worker",
  },
  commitment: {
    ingest: "interface",
    extract: "runtime",
    ledger: "storage",
    reconcile: "control",
    nudge: "control",
    report: "interface",
  },
  reelforge: {
    ingest: "interface",
    plan: "runtime",
    route: "runtime",
    effects: "runtime",
    compose: "runtime",
    master: "runtime",
    review: "runtime",
  },
};

function ScopeMap() {
  return (
    <div
      className="e-scope-map"
      aria-label="Engineering focus: model reasoning, execution control, and durable infrastructure"
    >
      <div className="e-panel-top">
        <span className="e-mono">SYSTEMS ENGINEERING / FOCUS</span>
        <span className="e-live-dot" />
      </div>
      <div className="e-scope-flow">
        <div className="e-scope-input">
          <span className="e-mono">01 / REASONING</span>
          <strong>Context → model → tool intent</strong>
          <small>Retrieval · memory · structured outputs</small>
        </div>
        <div className="e-flow-link" aria-hidden="true">
          <span />↓<span />
        </div>
        <div className="e-control-node">
          <span className="e-mono">02 / EXECUTION CONTROL</span>
          <strong>Agent harness</strong>
          <p>
            Typed contracts <i /> Review & authorization <i /> Recorded outcomes
          </p>
          <div className="e-control-tags">
            <span>Python</span>
            <span>FastAPI</span>
            <span>Pydantic</span>
          </div>
        </div>
        <div className="e-scope-connectors" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="e-scope-bottom">
          <div>
            <span className="e-scope-symbol">▤</span>
            <strong>Durable state</strong>
            <small>PostgreSQL</small>
          </div>
          <div>
            <span className="e-scope-symbol">⇄</span>
            <strong>Async work</strong>
            <small>SQS · workers · S3</small>
          </div>
          <div>
            <span className="e-scope-symbol">⌁</span>
            <strong>Live interface</strong>
            <small>React · TypeScript · SSE</small>
          </div>
        </div>
      </div>
      <a className="e-scope-footer" href="#architecture">
        <span>Inspect the architecture and failure boundaries</span>
        <Arrow />
      </a>
    </div>
  );
}

function PublicCaseDiagram({ project }: { project: EngineeringCase }) {
  const slots = [
    [0, 0],
    [1, 0],
    [2, 0],
    [2, 1],
    [1, 1],
    [0, 1],
    [0, 2],
  ];
  const diagram: ArchitectureDiagram = {
    id: project.id + "-implementation",
    title: project.title + " architecture",
    subtitle: project.subtitle,
    scope:
      "Public implementation · source-linked stages. Select a component to inspect its responsibility and failure boundary.",
    nodes: project.flow.map((node, i) => ({
      id: node.id,
      title: node.title,
      technology: node.technology,
      detail: node.responsibility + " Failure boundary: " + node.failureMode,
      kind: publicNodeKinds[project.id]?.[node.id] ?? "runtime",
      column: slots[i % slots.length][0],
      row: slots[i % slots.length][1],
    })),
    edges: [
      ...project.flow
        .slice(1)
        .map((node, i) => ({ from: project.flow[i].id, to: node.id })),
      ...project.branches
        .filter(
          (b) =>
            project.flow.some((n) => n.id === b.from) &&
            project.flow.some((n) => n.id === b.to),
        )
        .map((b) => ({ from: b.from, to: b.to, label: b.label, dashed: true })),
    ],
    notes: project.branches.map((b) => b.behavior),
  };
  return <ArchitectureExplorer diagrams={[diagram]} />;
}

function CaseDialog({
  project,
  onClose,
}: {
  project: EngineeringCase | null;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (project) {
      dialogRef.current?.showModal();
      document.body.style.overflow = "hidden";
    } else {
      dialogRef.current?.close();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [project]);
  return (
    <dialog
      ref={dialogRef}
      className="e-case-dialog"
      aria-labelledby="engineering-case-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
    >
      {project && (
        <div className="e-case-content">
          <div className="e-case-bar">
            <span className="e-mono">
              ENGINEERING CASE / {domains[project.id].toUpperCase()}
            </span>
            <button
              autoFocus
              onClick={onClose}
              className="e-icon-button"
              aria-label="Close engineering case"
            >
              ×
            </button>
          </div>
          <p className="e-eyebrow">
            {project.id === "finishos"
              ? "ANDROID IMPLEMENTATION / EDGECHAT MIT FOUNDATION"
              : "INDEPENDENT BUILD / PUBLIC SOURCE"}
          </p>
          <h2 id="engineering-case-title">{project.title}</h2>
          <p className="e-case-subtitle">{project.subtitle}</p>
          <p className="e-case-role">{project.role}</p>
          <div className="e-case-results">
            {project.results.map((result) => (
              <div key={result.label}>
                <strong>{result.value}</strong>
                <span>{result.label}</span>
                <p>{result.scope}</p>
              </div>
            ))}
          </div>
          {project.id === "finishos" && (
            <div
              className="e-finishos-gallery"
              aria-label="FinishOS phone screenshots"
            >
              <figure>
                <img
                  src="./assets/finishos-reply-review.png"
                  alt="FinishOS Android reply screen showing fictional Sam, an editable suggested reply, and Copy reviewed reply"
                  loading="lazy"
                />
                <figcaption>
                  Reply review on Samsung S26 Ultra. Fictional conversation and
                  a deterministic test response; real-model tests are recorded
                  separately.
                </figcaption>
              </figure>
              <figure>
                <img
                  src="./assets/finishos-form-applied.png"
                  alt="FinishOS practice form with reviewed fictional answers applied while password and card fields stay blank"
                  loading="lazy"
                />
                <figcaption>
                  Reviewed values applied to a fictional Android form. Password
                  and payment fields remain empty; nothing was submitted.
                </figcaption>
              </figure>
            </div>
          )}
          <PublicCaseDiagram project={project} />
          <div className="e-case-section-title">
            <span className="e-mono">01 / IMPLEMENTATION STACK</span>
            <h3>Technology, tied to a responsibility.</h3>
          </div>
          <div className="e-stack-matrix">
            {project.stack.map((row) => (
              <div key={row.boundary}>
                <span>{row.boundary}</span>
                <p>{row.technologies.join(" · ")}</p>
              </div>
            ))}
          </div>
          <div className="e-case-section-title">
            <span className="e-mono">02 / ENGINEERING DECISIONS</span>
            <h3>The mechanism—and the tradeoff.</h3>
          </div>
          <div className="e-decision-list">
            {project.decisions.map((decision, i) => (
              <article key={decision.title}>
                <span className="e-decision-number">0{i + 1}</span>
                <div>
                  <h4>{decision.title}</h4>
                  <p>{decision.mechanism}</p>
                  <p className="e-tradeoff">
                    <strong>Tradeoff</strong>
                    {decision.tradeoff}
                  </p>
                  <div className="e-decision-sources">
                    {decision.evidence.map((source) => (
                      <LinkOut key={source.url} href={source.url}>
                        {source.label}
                      </LinkOut>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="e-case-section-title">
            <span className="e-mono">03 / SOURCE & VALIDATION</span>
            <h3>Inspect the code. Reproduce the checks.</h3>
          </div>
          <div className="e-source-grid">
            {project.sourceLinks.map((link) => (
              <LinkOut key={link.url} href={link.url}>
                {link.label}
              </LinkOut>
            ))}
            <a
              href={
                project.id === "finishos"
                  ? github +
                    "FinishOS/tree/3f76a57a80142910dcf7878aac03cba8c49ac701/docs/evidence"
                  : "./evidence.html#" + project.id
              }
            >
              Recorded outputs & test scope
              <Arrow external />
            </a>
          </div>
          <details className="e-scope-details">
            <summary>Implementation scope & current limits</summary>
            <ul>
              {project.limitations.map((limit) => (
                <li key={limit}>{limit}</li>
              ))}
            </ul>
          </details>
          <div className="e-case-bottom">
            <button className="e-text-button" onClick={onClose}>
              ← Return to projects
            </button>
            <LinkOut
              className="e-button e-button-primary"
              href={github + repos[project.id]}
            >
              View repository
            </LinkOut>
          </div>
        </div>
      )}
    </dialog>
  );
}

function ProjectCard({
  project,
  index,
  onOpen,
}: {
  project: EngineeringCase;
  index: number;
  onOpen: () => void;
}) {
  return (
    <article className={"e-project-card e-project-" + project.id}>
      <div className="e-project-top">
        <span className="e-mono">
          0{index + 1} / {domains[project.id].toUpperCase()}
        </span>
        <LinkOut href={github + repos[project.id]} className="e-code-link">
          Source
        </LinkOut>
      </div>
      <h3>{project.title}</h3>
      <p className="e-project-subtitle">{project.subtitle}</p>
      {project.id === "finishos" && (
        <div className="e-finishos-card-media">
          <img
            src="./assets/finishos-reply-review.png"
            alt="Real FinishOS Android reply review screen with a fictional conversation"
            loading="lazy"
          />
          <span>Recorded on Samsung S26 Ultra · fictional test data</span>
        </div>
      )}
      <div
        className="e-project-pipeline"
        aria-label={project.title + " implementation stages"}
      >
        {project.flow.slice(0, 5).map((node, i) => (
          <div key={node.id}>
            {i > 0 && (
              <span className="e-pipeline-arrow" aria-hidden="true">
                →
              </span>
            )}
            <span>{node.title}</span>
          </div>
        ))}
        {project.flow.length > 5 && (
          <span className="e-pipeline-more">
            +{project.flow.length - 5} stages
          </span>
        )}
      </div>
      <div className="e-project-stack">
        {project.stack.slice(0, 3).map((group) => (
          <div key={group.boundary}>
            <span>{group.boundary}</span>
            <p>{group.technologies.slice(0, 4).join(" · ")}</p>
          </div>
        ))}
      </div>
      <div className="e-project-decision">
        <span className="e-mono">KEY ENGINEERING DECISION</span>
        <h4>{project.decisions[0].title}</h4>
        <p>{project.decisions[0].mechanism}</p>
      </div>
      <div className="e-project-result">
        <span className="e-result-icon">✓</span>
        <div>
          <strong>
            {project.results[0].value} <span>{project.results[0].label}</span>
          </strong>
          <p>{project.results[0].scope}</p>
        </div>
      </div>
      <button
        className="e-project-open"
        onClick={onOpen}
        aria-label={"Read " + project.title + " engineering case"}
      >
        <span>Architecture, decisions & evidence</span>
        <Arrow />
      </button>
    </article>
  );
}

export default function EngineeringPortfolio() {
  const [selected, setSelected] = useState<EngineeringCase | null>(
    () =>
      getEngineeringCase(
        new URLSearchParams(location.search).get("project") ?? "",
      ) ?? null,
  );
  const [filter, setFilter] = useState("All projects");
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("production");
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLButtonElement>(null);
  const navigationRef = useRef<HTMLElement>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openCase = (project: EngineeringCase) => {
    setSelected(project);
    const url = new URL(location.href);
    url.searchParams.set("project", project.id);
    history.pushState({ portfolioCase: true }, "", url);
  };
  const closeCase = () => {
    setSelected(null);
    if (history.state?.portfolioCase) history.back();
    else {
      const url = new URL(location.href);
      url.searchParams.delete("project");
      history.replaceState({}, "", url);
    }
  };
  useEffect(() => {
    const changed = () =>
      setSelected(
        getEngineeringCase(
          new URLSearchParams(location.search).get("project") ?? "",
        ) ?? null,
      );
    window.addEventListener("popstate", changed);
    return () => window.removeEventListener("popstate", changed);
  }, []);
  useEffect(() => {
    if (menuOpen) navigationRef.current?.querySelector("a")?.focus();
  }, [menuOpen]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        }),
      { rootMargin: "-15% 0px -68% 0px" },
    );
    document
      .querySelectorAll("main>section[id]")
      .forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const id = new URLSearchParams(location.search).get("project");
    if (id && productionSystems.some((project) => project.id === id)) {
      document.getElementById(id)?.scrollIntoView();
    }
    return () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("sarath231097@gmail.com");
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2500);
    } catch {
      location.href = "mailto:sarath231097@gmail.com";
    }
  };
  const visibleCases = engineeringCases.filter(
    (project) => filter === "All projects" || domains[project.id] === filter,
  );
  return (
    <div className="e-site">
      <a className="e-skip" href="#main">
        Skip to content
      </a>
      <header
        className="e-header"
        onKeyDown={(event) => {
          if (event.key === "Escape" && menuOpen) {
            setMenuOpen(false);
            menuRef.current?.focus();
          }
        }}
      >
        <a href="#top" className="e-brand" aria-label="Sarath Gentela home">
          <span className="e-monogram">
            sg<span>.</span>
          </span>
          <span>
            Sarath Gentela<small>AI ENGINEER</small>
          </span>
        </a>
        <nav
          ref={navigationRef}
          id="engineering-navigation"
          className={menuOpen ? "e-nav e-nav-open" : "e-nav"}
          aria-label="Main navigation"
        >
          {navItems.map(([id, label]) => (
            <a
              key={id}
              href={"#" + id}
              className={active === id ? "is-active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
          <a href="#contact" onClick={() => setMenuOpen(false)}>
            Contact
          </a>
        </nav>
        <a
          className="e-header-resume"
          href="./sarath-ai-ml-engineer-resume.pdf"
          target="_blank"
          rel="noreferrer"
        >
          Résumé <span aria-hidden="true">↓</span>
        </a>
        <button
          ref={menuRef}
          className="e-mobile-toggle"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="engineering-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "×" : "☰"}
        </button>
      </header>
      <main id="main">
        <section className="e-hero e-container" id="top">
          <div className="e-hero-copy">
            <p className="e-eyebrow">
              <span className="e-live-dot" /> FOUNDING AI ENGINEER / SPICE &
              LUCIDREAM
            </p>
            <p className="e-hero-name">Sarath Chandra Gentela</p>
            <h1>
              I engineer the systems
              <br />
              behind <span>reliable AI.</span>
            </h1>
            <p className="e-hero-description">
              Agent harnesses. Multi-stage search and ranking. Asynchronous
              infrastructure. I build the control, context, and state around
              models that turn reasoning into verifiable application outcomes.
            </p>
            <div className="e-hero-stack">
              <span>Python</span>
              <span>TypeScript</span>
              <span>FastAPI</span>
              <span>React</span>
              <span>PostgreSQL</span>
              <span>AWS</span>
            </div>
            <div className="e-hero-actions">
              <a className="e-button e-button-primary" href="#production">
                Explore production work
                <Arrow />
              </a>
              <a className="e-button e-button-secondary" href="#architecture">
                Inspect the architecture
                <Arrow />
              </a>
            </div>
            <div className="e-person">
              <img
                src="./assets/sarath-profile.jpg"
                alt="Sarath Chandra Gentela"
                width="40"
                height="40"
              />
              <span>
                Austin, Texas <i /> Open to AI engineering roles
              </span>
              <LinkOut href="https://github.com/akira231097">GitHub</LinkOut>
            </div>
          </div>
          <ScopeMap />
        </section>
        <div className="e-scale-band">
          <div className="e-container">
            <div className="e-scale-title">
              <span className="e-mono">PRODUCTION SCALE</span>
              <span>Spice / AskSpice</span>
            </div>
            <div>
              <strong>1M+</strong>
              <span>searchable chunks</span>
            </div>
            <div>
              <strong>10,000+</strong>
              <span>processed episodes</span>
            </div>
            <div>
              <strong>16</strong>
              <span>concurrent workers</span>
            </div>
            <div>
              <strong>
                ~20<span>/min</span>
              </strong>
              <span>bulk-processing episodes</span>
            </div>
            <p>
              Reported in my résumé.
              <br /> Public-project measurements are labeled separately.
            </p>
          </div>
        </div>
        <section className="e-production e-container" id="production">
          <div className="e-section-heading">
            <div>
              <p className="e-eyebrow">01 / PRODUCTION ENGINEERING</p>
              <h2>
                What I shipped.
                <br />
                <span>Where I went deep.</span>
              </h2>
            </div>
            <p>
              Specific implementation work across the model loop, execution
              controls, retrieval pipeline, and product interface. Each boundary
              has a job—and a failure mode to account for.
            </p>
          </div>
          {productionSystems.map((system, i) => (
            <article
              className="e-production-case"
              id={system.id}
              key={system.id}
            >
              <div className="e-production-intro">
                <div className="e-production-label">
                  <span className="e-live-dot" />
                  {system.label}
                  <span className="e-mono">0{i + 1}</span>
                </div>
                <div className="e-production-heading">
                  <h3>{system.name}</h3>
                  <span>SPICE · 2025—PRESENT</span>
                </div>
                <h4>{system.title}</h4>
                <p>{system.summary}</p>
                <div className="e-design-question">
                  <span className="e-mono">SYSTEM DESIGN QUESTION</span>
                  <p>{system.question}</p>
                </div>
                <div className="e-production-flow">
                  {system.flow.map((stage, index) => (
                    <span key={stage}>
                      {index > 0 && <i aria-hidden="true">→</i>}
                      {stage}
                    </span>
                  ))}
                </div>
                <div className="e-production-links">
                  {system.sources.map((source) => (
                    <LinkOut key={source.url} href={source.url}>
                      {source.label}
                    </LinkOut>
                  ))}
                </div>
                {system.id === "lucidream" && (
                  <figure className="e-product-proof">
                    <a
                      href="https://lucidream.io/"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="See the Lucidream product"
                    >
                      <img
                        src="./assets/lucidream-public-editor.jpg"
                        width="1060"
                        height="431"
                        loading="lazy"
                        alt="Lucidream's public editor preview, showing the media canvas, transcript and editing controls"
                      />
                    </a>
                    <figcaption>
                      Product context · Lucidream’s public editor preview.
                      Team-built product; my contributions are detailed
                      alongside.
                    </figcaption>
                  </figure>
                )}
              </div>
              <div className="e-production-modules">
                <span className="e-mono e-block-label">
                  IMPLEMENTATION & ENGINEERING OUTCOME
                </span>
                {system.modules.map((module, index) => (
                  <div className="e-module" key={module.title}>
                    <span className="e-module-index">0{index + 1}</span>
                    <div>
                      <h5>{module.title}</h5>
                      <p>{module.implementation}</p>
                      <span className="e-module-outcome">
                        <b>Result</b>
                        {module.outcome}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="e-production-stack">
                <div className="e-stack-header">
                  <h5>Stack by system boundary</h5>
                  <span className="e-mono">TECHNOLOGY → RESPONSIBILITY</span>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Boundary</th>
                      <th>Implementation</th>
                      <th>Responsibility</th>
                    </tr>
                  </thead>
                  <tbody>
                    {system.stack.map((row) => (
                      <tr key={row.boundary}>
                        <th scope="row">{row.boundary}</th>
                        <td>{row.tools}</td>
                        <td>{row.responsibility}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="e-ownership">{system.ownership}</p>
              </div>
            </article>
          ))}
          <article className="e-ingestion">
            <div>
              <p className="e-eyebrow">THE DATA LAYER BEHIND RETRIEVAL</p>
              <h3>Search quality starts before the query.</h3>
              <p>
                I implemented split/merge transcription with speaker mapping,
                sentence-level timestamps, extraction and chunking improvements,
                and dense/sparse index insertion changes.
              </p>
            </div>
            <div className="e-ingestion-flow">
              {[
                ["01", "Media ingestion", "S3 · queued workers"],
                ["02", "Transcript structure", "Speaker mapping · timestamps"],
                ["03", "Searchable records", "Chunks · quotes · metadata"],
                [
                  "04",
                  "Index & retrieve",
                  "Embeddings · sparse signals · Pinecone",
                ],
              ].map(([number, title, tools]) => (
                <div key={number}>
                  <span>{number}</span>
                  <strong>{title}</strong>
                  <small>{tools}</small>
                </div>
              ))}
            </div>
          </article>
        </section>
        <section className="e-architecture-section" id="architecture">
          <div className="e-container">
            <div className="e-section-heading">
              <div>
                <p className="e-eyebrow">02 / SYSTEM DESIGN, OPENED UP</p>
                <h2>
                  Inspect the boundaries.
                  <br />
                  <span>Follow the execution.</span>
                </h2>
              </div>
              <p>
                Three technical views: the agent harness, the retrieval and
                ranking pipeline, and durable background work. Select a
                component to inspect its responsibility and connections.
              </p>
            </div>
            <ArchitectureExplorer diagrams={architectureDiagrams} />
            <div className="e-design-principles">
              <article>
                <span className="e-mono">CONTROL PLANE</span>
                <h3>Reasoning ≠ authorization</h3>
                <p>
                  Typed arguments, ownership, policy, and confirmation each
                  answer a different question before an external effect can run.
                </p>
              </article>
              <article>
                <span className="e-mono">STATE OWNERSHIP</span>
                <h3>Durable records over narration</h3>
                <p>
                  A tool proposal, queued job, completed operation, and UI event
                  are distinct states. The system needs an authoritative result.
                </p>
              </article>
              <article>
                <span className="e-mono">RETRIEVAL QUALITY</span>
                <h3>Recall, precision, then selection</h3>
                <p>
                  Candidate generation, rank fusion, hydration, and reranking
                  are separate stages that can be reasoned about and evaluated.
                </p>
              </article>
            </div>
          </div>
        </section>
        <section className="e-projects e-container" id="projects">
          <div className="e-section-heading">
            <div>
              <p className="e-eyebrow">03 / PUBLIC IMPLEMENTATIONS</p>
              <h2>
                Architecture you can inspect.
                <br />
                <span>Code you can follow.</span>
              </h2>
            </div>
            <p>
              Six public implementations make the engineering concrete: source,
              named mechanisms, design tradeoffs, and scoped verification.
              FinishOS builds on the MIT-licensed EdgeChat engine.
            </p>
          </div>
          <div className="e-project-filters" aria-label="Filter projects">
            {[
              "All projects",
              "On-device agents",
              "Search & ranking",
              "Agent systems",
              "State & evidence",
              "AI media pipelines",
            ].map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                aria-pressed={filter === item}
              >
                {item}
              </button>
            ))}
            <span className="e-mono" aria-live="polite">
              {visibleCases.length} BUILDS
            </span>
          </div>
          <div className="e-project-grid">
            {visibleCases.map((project) => (
              <ProjectCard
                project={project}
                index={engineeringCases.indexOf(project)}
                key={project.id}
                onOpen={() => openCase(project)}
              />
            ))}
          </div>
          <div className="e-evidence-banner">
            <div>
              <span className="e-mono">VERIFICATION, WITH CONTEXT</span>
              <h3>Go beyond the architecture diagram.</h3>
              <p>
                Inspect saved pipeline outputs, a real retrieval miss,
                execution-gate outcomes, exact revisions, and commands to
                reproduce the checks.
              </p>
            </div>
            <a href="./evidence.html" className="e-button e-button-primary">
              Open engineering evidence
              <Arrow external />
            </a>
          </div>
        </section>
        <section className="e-experience-section" id="experience">
          <div className="e-container">
            <div className="e-section-heading">
              <div>
                <p className="e-eyebrow">04 / EXPERIENCE & TECHNICAL RANGE</p>
                <h2>
                  From data systems
                  <br />
                  <span>to agent infrastructure.</span>
                </h2>
              </div>
              <a
                className="e-button e-button-secondary"
                href="./sarath-ai-ml-engineer-resume.pdf"
                target="_blank"
                rel="noreferrer"
              >
                Full résumé <span>↓</span>
              </a>
            </div>
            <div className="e-experience-grid">
              <div className="e-timeline">
                <article>
                  <span className="e-timeline-dot" />
                  <p className="e-mono">FEB 2025 — PRESENT</p>
                  <h3>Founding AI Engineer / Data Scientist</h3>
                  <h4>Spice · Austin, Texas</h4>
                  <p>
                    Production agent control layers, conversational retrieval,
                    ranking, context and memory, media-data pipelines, and
                    full-stack lifecycle integration.
                  </p>
                  <div className="e-tags">
                    <span>Agent harnesses</span>
                    <span>Search & ranking</span>
                    <span>AI infrastructure</span>
                  </div>
                </article>
                <article>
                  <span className="e-timeline-dot" />
                  <p className="e-mono">DEC 2022 — JAN 2025</p>
                  <h3>Research Assistant, Data Analytics</h3>
                  <h4>Illinois Department of Human Services</h4>
                  <p>
                    Python/SQL analysis, Tableau reporting, demographic and
                    regional analysis, and NLP/retrieval prototypes for
                    public-health data access.
                  </p>
                </article>
                <article>
                  <span className="e-timeline-dot" />
                  <p className="e-mono">JUN 2020 — MAY 2022</p>
                  <h3>Junior Data Analyst</h3>
                  <h4>Sunairiya Technologies</h4>
                  <p>
                    SQL/Python data workflows, Power BI dashboards, forecasting,
                    and business reporting systems.
                  </p>
                </article>
              </div>
              <div className="e-skills">
                <h3>Technical toolkit</h3>
                {[
                  [
                    "Languages & APIs",
                    "Python · TypeScript · SQL · FastAPI · Fastify · Pydantic",
                  ],
                  [
                    "LLM application engineering",
                    "Tool loops · structured outputs · context assembly · LangGraph · MCP",
                  ],
                  [
                    "Retrieval & ranking",
                    "RAG · dense + sparse search · HyDE · RRF · Pinecone · Cohere · evaluation",
                  ],
                  [
                    "State & infrastructure",
                    "PostgreSQL · asyncpg · SQLite · SQS · S3 · async workers",
                  ],
                  [
                    "Interfaces & validation",
                    "React · Next.js · Zustand · SSE · Pytest · contract/regression tests",
                  ],
                ].map(([title, tools]) => (
                  <div className="e-skill-row" key={title}>
                    <h4>{title}</h4>
                    <p>{tools}</p>
                  </div>
                ))}
                <div className="e-education">
                  <span className="e-mono">EDUCATION</span>
                  <h4>
                    M.S. Data Analytics <span>4.0 / 4.0</span>
                  </h4>
                  <p>University of Illinois Springfield · 2022–2024</p>
                  <h4>B.Sc. Computer Science</h4>
                  <p>Osmania University · 2016–2020</p>
                  <div>
                    <strong>Continued study: LLM inference engineering</strong>
                    <p>
                      Vizuara coursework and local experiments in KV/prefix
                      caching, batching, quantization, attention, and serving.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="e-contact e-container" id="contact">
          <div>
            <p className="e-eyebrow">
              <span className="e-live-dot" /> OPEN TO AI ENGINEERING
              OPPORTUNITIES
            </p>
            <h2>
              Building an agent platform
              <br /> or a serious retrieval system?
            </h2>
            <p>
              I’m interested in AI engineering, applied AI, and ML engineering
              roles where model behavior has to connect to dependable software.
            </p>
            <a className="e-email" href="mailto:sarath231097@gmail.com">
              sarath231097@gmail.com
              <Arrow external />
            </a>
            <button className="e-copy" onClick={copyEmail} aria-live="polite">
              {copied ? "✓ Email copied" : "Copy email address"}
            </button>
          </div>
          <div className="e-contact-links">
            <LinkOut href="https://www.linkedin.com/in/sarathgentela/">
              LinkedIn
            </LinkOut>
            <LinkOut href="https://github.com/akira231097">GitHub</LinkOut>
            <a
              href="./sarath-ai-ml-engineer-resume.pdf"
              target="_blank"
              rel="noreferrer"
            >
              Download résumé
              <Arrow external />
            </a>
            <span>Austin, TX · Remote / hybrid / relocation</span>
          </div>
        </section>
      </main>
      <footer className="e-footer e-container">
        <a className="e-brand" href="#top">
          <span className="e-monogram">
            sg<span>.</span>
          </span>
          <span>Sarath Gentela</span>
        </a>
        <p>Production work. Public code. Explicit evidence.</p>
        <span className="e-mono">© {new Date().getFullYear()}</span>
        <a href="#top" aria-label="Back to top">
          ↑
        </a>
      </footer>
      <CaseDialog project={selected} onClose={closeCase} />
    </div>
  );
}
