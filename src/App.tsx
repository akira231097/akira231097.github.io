import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import SystemsLab from "./components/SystemsLab";
import { askspice, lucidream, projects } from "./projects";
import type { Project } from "./projects";

const Arrow = ({ diagonal = false }: { diagonal?: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d={diagonal ? "M6 18 18 6M6 6h12v12" : "M4 12h15m-6-6 6 6-6 6"}
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
function Mark() {
  return (
    <svg viewBox="0 0 44 44" aria-hidden="true">
      <rect width="44" height="44" rx="13" fill="currentColor" />
      <path
        d="M29 12H19a6 6 0 000 12h6a5 5 0 010 10H13"
        fill="none"
        stroke="#d7f78b"
        strokeWidth="3.5"
      />
      <circle cx="32" cy="32" r="2.5" fill="#f37859" />
    </svg>
  );
}
function External({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const internal = href.startsWith(".");
  return (
    <a
      className={className}
      href={href}
      target={internal ? undefined : "_blank"}
      rel={internal ? undefined : "noreferrer"}
    >
      {children}
      <Arrow diagonal />
    </a>
  );
}
const heroSteps = [
  {
    title: "Ground the answer.",
    label: "01 / CONTEXT",
    text: "Find useful evidence and preserve the context that makes it meaningful.",
    chip: "Relevant sources, ready",
    nodes: ["Question", "Source context", "Supported answer"],
  },
  {
    title: "Make actions reviewable.",
    label: "02 / CONTROL",
    text: "Turn a model’s proposal into a clear action people can inspect and approve.",
    chip: "Proposed → reviewed",
    nodes: ["Intent", "Review & validate", "Confirmed action"],
  },
  {
    title: "Finish the work.",
    label: "03 / CONTINUITY",
    text: "Connect background work to honest progress, visible results, and recovery.",
    chip: "Work can reconnect",
    nodes: ["Request", "Progress & recovery", "Usable result"],
  },
];
function HeroDiagram() {
  const [step, setStep] = useState(0);
  const current = heroSteps[step];
  return (
    <div className="hero-diagram">
      <div className="diagram-top">
        <span className="mono">THE ENGINEERING AROUND AI</span>
        <span className="small-dot" />
      </div>
      <div className="diagram-canvas">
        <svg
          className="diagram-paths"
          viewBox="0 0 530 335"
          fill="none"
          aria-hidden="true"
        >
          <path d="M72 93H226Q264 93 264 134V190Q264 221 305 221H451" />
          <path
            d="M78 236H158Q186 236 186 205V168Q186 142 218 142H391"
            className="dashed"
          />
          <circle cx="73" cy="93" r="5" />
          <circle cx="449" cy="221" r="5" />
          <circle cx="77" cy="236" r="4" />
          <circle cx="391" cy="142" r="4" />
        </svg>
        <div className="input-fragment">
          <span className="fragment-icon">↳</span>
          <div>
            <span className="mono">HUMAN INTENT</span>
            <strong>{current.nodes[0]}</strong>
          </div>
          <span className="signal-dot" />
        </div>
        <div className="core-orbit orbit-one" />
        <div className="core-orbit orbit-two" />
        <div className="core-node">
          <span className="core-spark">✳</span>
          <span>AI + engineering</span>
          <strong>{current.nodes[1]}</strong>
          <div className="core-bars">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
        <div className="output-fragment">
          <span className="check-circle">✓</span>
          <div>
            <span className="mono">USEFUL OUTPUT</span>
            <strong>{current.nodes[2]}</strong>
          </div>
        </div>
        <span className="diagram-coordinate mono">
          ↙ EXPLORE THE PRINCIPLES
        </span>
        <span className="float-label">
          <span /> {current.chip}
        </span>
      </div>
      <div className="hero-step-tabs" aria-label="Engineering principles">
        {heroSteps.map((s, i) => (
          <button
            key={s.label}
            aria-pressed={step === i}
            onClick={() => setStep(i)}
          >
            <span>0{i + 1}</span>
            {["Context", "Control", "Continuity"][i]}
          </button>
        ))}
      </div>
      <div className="diagram-caption" aria-live="polite">
        <strong>{current.title}</strong>
        <p>{current.text}</p>
      </div>
    </div>
  );
}

function ProjectArt({ project }: { project: Project }) {
  const bars = [
    25, 42, 64, 34, 76, 90, 53, 78, 40, 62, 95, 70, 47, 87, 58, 33, 65, 46, 29,
  ];
  return (
    <div className={"project-art art-" + project.id} aria-hidden="true">
      <span className="art-meta mono">
        {project.id === "artha"
          ? "REASON → REVIEW"
          : project.id === "commitment"
            ? "TEXT → EVIDENCE"
            : "INPUT → INTELLIGENCE → OUTPUT"}
      </span>
      {project.id === "echofind" && (
        <>
          <div className="search-visual">
            <span>⌕</span> What did they say about focus?
            <span className="search-enter">↵</span>
          </div>
          <div className="search-results">
            <div>
              <i className="result-square" />
              <span>
                <b />
                <b />
              </span>
              <em>01</em>
            </div>
            <div>
              <i className="result-square" />
              <span>
                <b />
                <b />
              </span>
              <em>02</em>
            </div>
            <div>
              <i className="result-square" />
              <span>
                <b />
                <b />
              </span>
              <em>03</em>
            </div>
          </div>
          <span className="art-note">A follow-up keeps its context.</span>
        </>
      )}
      {project.id === "artha" && (
        <>
          <div className="council-visual">
            <div className="council-people">
              <span>Research</span>
              <span>Challenge</span>
              <span>Risk</span>
            </div>
            <svg viewBox="0 0 380 90">
              <path d="M65 0V30Q65 45 95 45H280Q315 45 315 15V0M190 0V90" />
            </svg>
            <div className="decision-box">
              <span>◇</span> Reviewable proposal <span>↗</span>
            </div>
            <div className="gate-box">✓ Deterministic checks</div>
          </div>
        </>
      )}
      {project.id === "clipopedia" && (
        <>
          <div className="clip-visual">
            <div className="clip-wave">
              {bars.map((h, i) => (
                <i key={i} style={{ height: h + "%" }} />
              ))}
            </div>
            <div className="clip-range">
              <span>00:42</span>
              <b>ONE RELEVANT MOMENT</b>
              <span>01:18</span>
            </div>
            <div className="mini-flow">
              <span>Search</span>
              <i>→</i>
              <span>Rank</span>
              <i>→</i>
              <span>Select</span>
            </div>
          </div>
        </>
      )}
      {project.id === "commitment" && (
        <>
          <div className="ledger-visual">
            <div className="ledger-head">
              <span>COMMITMENT</span>
              <span>STATE</span>
            </div>
            <div>
              <span>
                <i />
                Rewrite onboarding email
              </span>
              <em className="fulfilled">Fulfilled</em>
            </div>
            <div>
              <span>
                <i />
                Fix API rate limits
              </span>
              <em>Open</em>
            </div>
            <div>
              <span>
                <i />
                Investigate stale search
              </span>
              <em>Open</em>
            </div>
          </div>
          <span className="art-note">Bundled local demo · 3 commitments</span>
        </>
      )}
      {project.id === "reelforge" && (
        <>
          <div className="film-visual">
            <div className="film-screen">
              <span>✳</span>
              <i>PLAN / EDIT / REVIEW</i>
            </div>
            <div className="film-track">
              <span />
              <span />
              <span />
            </div>
            <div className="film-audio">
              {bars.map((h, i) => (
                <i key={i} style={{ height: h + "%" }} />
              ))}
            </div>
            <span className="playhead" />
          </div>
          <span className="art-note">From edit plan to media operations.</span>
        </>
      )}
    </div>
  );
}

function CaseStudy({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (project) {
      setStage(0);
      dialog.current?.showModal();
      document.body.style.overflow = "hidden";
    } else {
      dialog.current?.close();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [project]);
  return (
    <dialog
      ref={dialog}
      className="case-dialog"
      aria-labelledby="case-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === dialog.current) onClose();
      }}
    >
      {project && (
        <div className="case-inner">
          <div className="case-toolbar">
            <span className="mono">
              CASE STUDY / {project.category.toUpperCase()}
            </span>
            <button
              autoFocus
              className="close-button"
              onClick={onClose}
              aria-label="Close case study"
            >
              ✕
            </button>
          </div>
          <p className="eyebrow">{project.eyebrow}</p>
          <h2 id="case-title">{project.name}</h2>
          <p className="case-tagline">{project.tagline}</p>
          <div className="tags">
            {project.tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <div className="case-summary">
            <div>
              <h3>The problem</h3>
              <p>{project.problem}</p>
            </div>
            <div>
              <h3>My contribution</h3>
              <p>{project.contribution}</p>
            </div>
          </div>
          {project.id === "lucidream" && (
            <figure className="case-product-image">
              <img
                src="./assets/lucidream-public-editor.jpg"
                alt="Lucidream's public conversational editing feature with a podcast clip preview"
              />
              <figcaption>
                Captured from Lucidream’s public product page · team-built
                product
              </figcaption>
            </figure>
          )}
          <section className="case-flow" aria-label="Workflow walkthrough">
            <div className="case-flow-heading">
              <h3>Follow the idea through the system</h3>
              <span className="mono">ILLUSTRATIVE WORKFLOW</span>
            </div>
            <div className="flow-buttons">
              {project.stages.map((s, i) => (
                <button
                  key={s.title}
                  onClick={() => setStage(i)}
                  aria-pressed={stage === i}
                >
                  <span>0{i + 1}</span>
                  {s.title}
                  <Arrow />
                </button>
              ))}
            </div>
            <div className="flow-detail" aria-live="polite">
              <span>0{stage + 1}</span>
              <div>
                <h4>{project.stages[stage].title}</h4>
                <p>{project.stages[stage].detail}</p>
              </div>
            </div>
          </section>
          <h3 className="case-subtitle">The engineering decisions</h3>
          <div className="case-decisions">
            {project.decisions.map((d) => (
              <div key={d.title}>
                <span>↳</span>
                <h4>{d.title}</h4>
                <p>{d.detail}</p>
              </div>
            ))}
          </div>
          <section className="case-evidence">
            <h3>Go from the story to the evidence</h3>
            {project.evidence.map((e) => (
              <External key={e.label} href={e.url}>
                <span>
                  <strong>{e.label}</strong>
                  <small>{e.detail}</small>
                </span>
              </External>
            ))}
            <p className="scope-note">{project.scope}</p>
          </section>
          <div className="case-bottom">
            <button className="text-button" onClick={onClose}>
              ← Back to the portfolio
            </button>
            <External href={project.url} className="button dark">
              {project.category === "Production"
                ? "Visit product"
                : "Explore repository"}
            </External>
          </div>
        </div>
      )}
    </dialog>
  );
}

const allProjects = [lucidream, askspice, ...projects];
export default function App() {
  const [selected, setSelected] = useState<Project | null>(
    () =>
      allProjects.find(
        (p) => p.id === new URLSearchParams(location.search).get("project"),
      ) ?? null,
  );
  const [filter, setFilter] = useState("All work");
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState("work");
  const [copied, setCopied] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  const openCase = (p: Project) => {
    setSelected(p);
    const u = new URL(location.href);
    u.searchParams.set("project", p.id);
    history.pushState({ portfolioCase: true }, "", u);
  };
  const closeCase = () => {
    setSelected(null);
    if (history.state?.portfolioCase) {
      history.back();
    } else {
      const u = new URL(location.href);
      u.searchParams.delete("project");
      history.replaceState({}, "", u);
    }
  };
  useEffect(() => {
    if (menu) navRef.current?.querySelector("a")?.focus();
  }, [menu]);
  useEffect(() => {
    const fn = () =>
      setSelected(
        allProjects.find(
          (p) => p.id === new URLSearchParams(location.search).get("project"),
        ) ?? null,
      );
    window.addEventListener("popstate", fn);
    return () => window.removeEventListener("popstate", fn);
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-15% 0px -65% 0px" },
    );
    document
      .querySelectorAll("main > section[id]")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("sarath231097@gmail.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.location.href = "mailto:sarath231097@gmail.com";
    }
  };
  const filtered =
    filter === "All work"
      ? projects
      : projects.filter((p) => p.category === filter);
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header
        className="site-header"
        onKeyDown={(e) => {
          if (e.key === "Escape" && menu) {
            setMenu(false);
            menuRef.current?.focus();
          }
        }}
      >
        <a className="brand" href="#top" aria-label="Sarath Gentela, home">
          <Mark />
          <span>
            sarath<span className="brand-dot">.</span>
          </span>
        </a>
        <nav
          id="main-navigation"
          ref={navRef}
          className={menu ? "nav open" : "nav"}
          aria-label="Main navigation"
        >
          {[
            ["work", "Selected work"],
            ["systems", "Inside the systems"],
            ["about", "About"],
          ].map(([id, label]) => (
            <a
              key={id}
              href={"#" + id}
              onClick={() => setMenu(false)}
              className={active === id ? "active" : ""}
            >
              {label}
            </a>
          ))}
        </nav>
        <a
          className="header-contact"
          href="#contact"
          onClick={() => setMenu(false)}
        >
          Let’s talk <Arrow diagonal />
        </a>
        <button
          ref={menuRef}
          className="menu-button"
          aria-label={menu ? "Close menu" : "Open menu"}
          aria-expanded={menu}
          aria-controls="main-navigation"
          onClick={() => setMenu(!menu)}
        >
          {menu ? "✕" : "☰"}
        </button>
      </header>
      <main id="main">
        <section className="hero page-width" id="top">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="status-dot" /> SARATH CHANDRA GENTELA{" "}
              <span className="eyebrow-divider">/</span> AI ENGINEER
            </p>
            <h1>
              Intelligence,
              <br />
              made <em>useful.</em>
              <svg
                viewBox="0 0 62 64"
                className="hero-asterisk"
                aria-hidden="true"
              >
                <path d="M31 3v58M3 32h56M11 11l40 42M11 53l40-42" />
              </svg>
            </h1>
            <p className="hero-description">
              I build the systems that turn AI into something people can
              actually use. Grounded answers. Reviewable actions. Work that
              finds its way to done.
            </p>
            <div className="hero-actions">
              <a href="#work" className="button dark">
                Explore my work <Arrow />
              </a>
              <a
                href="./sarath-ai-ml-engineer-resume.pdf"
                className="resume-link"
                target="_blank"
                rel="noreferrer"
              >
                Read my résumé <span>↓</span>
              </a>
            </div>
            <div className="hero-person">
              <img
                src="./assets/sarath-profile.jpg"
                alt="Sarath Chandra Gentela"
                width="44"
                height="44"
              />
              <div>
                <strong>Building at Spice / Lucidream</strong>
                <span>
                  Austin, Texas <i /> Open to AI engineering roles
                </span>
              </div>
            </div>
          </div>
          <HeroDiagram />
        </section>
        <div className="expertise-strip">
          <div className="page-width">
            <span className="mono">FROM MODEL TO PRODUCT</span>
            <span>Agent systems</span>
            <span className="strip-cross">+</span>
            <span>Retrieval & context</span>
            <span className="strip-cross">+</span>
            <span>Human-centered interfaces</span>
            <span className="strip-cross">+</span>
            <span>Recovery & evidence</span>
          </div>
        </div>
        <section id="work" className="work-section page-width">
          <div className="section-heading">
            <div>
              <p className="eyebrow">01 / SELECTED WORK</p>
              <h2>
                Real problems.
                <br />
                <em>Thoughtful systems.</em>
              </h2>
            </div>
            <p>
              Production contributions and independent builds.
              <br />
              Open a case study to see the problem, the decisions, and the work
              behind it.
            </p>
          </div>
          <article className="featured-project">
            <div className="featured-copy">
              <div className="featured-label">
                <span className="small-dot" /> PRODUCTION WORK{" "}
                <span>2025 — PRESENT</span>
              </div>
              <h3>
                Lucidream<span>↗</span>
              </h3>
              <p className="featured-lead">
                One conversation.
                <br />A whole creative workflow.
              </p>
              <p>
                Helping creators move from a long episode to a moment worth
                sharing—with clear controls and visible progress.
              </p>
              <div className="contribution-list">
                <span>
                  01 <b>Agent actions & review</b>
                </span>
                <span>
                  02 <b>Precision clip editing</b>
                </span>
                <span>
                  03 <b>Streaming & recovery</b>
                </span>
              </div>
              <button
                className="button lime"
                onClick={() => openCase(lucidream)}
              >
                Inside the case study <Arrow />
              </button>
              <small>My contributions within a team-built product.</small>
            </div>
            <div className="featured-visual">
              <div className="browser-frame">
                <div className="browser-bar">
                  <i />
                  <i />
                  <i />
                  <span>lucidream.io / product experience</span>
                  <Arrow diagonal />
                </div>
                <img
                  src="./assets/lucidream-public-editor.jpg"
                  alt="Lucidream public product screenshot demonstrating conversational clip editing"
                  width="1060"
                  height="431"
                />
                <div className="product-proof">
                  <span className="proof-tick">✓</span>
                  <div>
                    <strong>From intent to a reviewable result.</strong>
                    <p>A public look at the product I help build.</p>
                  </div>
                </div>
              </div>
              <div className="workflow-ribbon">
                <span>Find a moment</span>
                <Arrow />
                <span>Review & edit</span>
                <Arrow />
                <span>Follow progress</span>
              </div>
              <div className="visual-caption">
                <span className="mono">
                  REAL PRODUCT / PUBLIC FEATURE PRESENTATION
                </span>
                <a href="https://lucidream.io" target="_blank" rel="noreferrer">
                  Visit Lucidream <Arrow diagonal />
                </a>
              </div>
            </div>
          </article>
          <button className="earlier-work" onClick={() => openCase(askspice)}>
            <span className="earlier-icon">⌕</span>
            <span>
              <span className="mono">ALSO AT SPICE</span>
              <strong>AskSpice</strong>
            </span>
            <p>
              Conversational discovery.
              <br />
              From a question to the right podcast moment.
            </p>
            <span className="earlier-flow">
              <i>Question</i>→<i>Evidence</i>→<i>Answer</i>
            </span>
            <Arrow diagonal />
          </button>
          <div className="projects-heading">
            <div>
              <p className="eyebrow">THE INDEPENDENT BUILDS</p>
              <h3>Ideas, made inspectable.</h3>
            </div>
            <External href="https://github.com/akira231097">
              All code on GitHub
            </External>
          </div>
          <div
            className="project-filters"
            aria-label="Filter independent projects"
          >
            {["All work", "Retrieval", "Agents", "Workflow", "Media"].map(
              (f) => (
                <button
                  key={f}
                  className={filter === f ? "selected" : ""}
                  aria-pressed={filter === f}
                  onClick={() => setFilter(f)}
                >
                  {f}
                  {f === "All work" && <span>05</span>}
                </button>
              ),
            )}
            <span className="mono filter-count" aria-live="polite">
              {filtered.length} PROJECT{filtered.length === 1 ? "" : "S"}
            </span>
          </div>
          <div className="projects-grid">
            {filtered.map((p) => (
              <article className={"project-card " + p.color} key={p.id}>
                <button
                  className="project-card-main"
                  onClick={() => openCase(p)}
                  aria-label={"Explore " + p.name + " case study"}
                >
                  <ProjectArt project={p} />
                  <div className="project-card-body">
                    <p className="mono">{p.eyebrow}</p>
                    <div className="project-name">
                      <h3>{p.name}</h3>
                      <span>
                        <Arrow diagonal />
                      </span>
                    </div>
                    <p className="project-tagline">{p.tagline}</p>
                    <p className="project-description">{p.description}</p>
                    <div className="tags">
                      {p.tags.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                    <div className="card-footer">
                      <span>Explore the build</span>
                      <Arrow />
                    </div>
                  </div>
                </button>
              </article>
            ))}
          </div>
          <div className="evidence-note">
            <span className="evidence-symbol">↳</span>
            <p>
              <strong>Work you can inspect.</strong> Each project links to
              source code or a public product walkthrough. Local checks and
              synthetic-demo results are documented with their scope.
            </p>
            <a href="./evidence.html">
              View the evidence record <Arrow diagonal />
            </a>
          </div>
        </section>
        <section id="systems" className="systems-section">
          <div className="page-width">
            <div className="section-heading">
              <div>
                <p className="eyebrow">02 / INSIDE THE SYSTEMS</p>
                <h2>
                  Don’t just read it.
                  <br />
                  <em>Try the moving parts.</em>
                </h2>
              </div>
              <p>
                What makes an AI system useful?
                <br />
                Explore three engineering ideas behind my work. Change a state.
                See why it matters.
              </p>
            </div>
            <SystemsLab />
          </div>
        </section>
        <section id="about" className="about-section page-width">
          <div className="about-top">
            <div>
              <p className="eyebrow">03 / THE PERSON BEHIND THE SYSTEMS</p>
              <h2>
                Curious about models.
                <br />
                <em>Responsible for outcomes.</em>
              </h2>
            </div>
            <div className="about-intro">
              <p>
                I’m Sarath, an AI engineer based in Austin. My path runs from
                data analytics to building AI products—and the thread is the
                same: making complex information useful to people.
              </p>
              <p>
                At Spice / Lucidream, I work across Python services and the
                React experience. I enjoy the point where an ambitious AI idea
                meets the practical questions: What evidence supports it? What
                can the user control? What happens when the connection drops?
              </p>
              <div className="about-links">
                <External href="https://www.linkedin.com/in/sarathgentela/">
                  LinkedIn
                </External>
                <External href="https://github.com/akira231097">
                  GitHub
                </External>
              </div>
            </div>
          </div>
          <div className="about-details">
            <div className="experience">
              <h3>A path from data to action.</h3>
              <div className="timeline">
                <article>
                  <span className="timeline-dot current" />
                  <p className="mono">FEB 2025 — PRESENT</p>
                  <h4>Founding AI Engineer / Data Scientist</h4>
                  <h5>Spice · Austin, Texas</h5>
                  <p>
                    Creator-agent workflows, conversational retrieval, precise
                    editing, and recovery across backend and frontend.
                  </p>
                </article>
                <article>
                  <span className="timeline-dot" />
                  <p className="mono">DEC 2022 — JAN 2025</p>
                  <h4>Research Assistant, Data Analytics</h4>
                  <h5>Illinois Department of Human Services</h5>
                  <p>
                    Python and SQL analysis, Tableau dashboards, and
                    NLP/retrieval prototypes for working with public-health
                    datasets.
                  </p>
                </article>
                <article>
                  <span className="timeline-dot" />
                  <p className="mono">JUN 2020 — MAY 2022</p>
                  <h4>Junior Data Analyst</h4>
                  <h5>Sunairiya Technologies</h5>
                  <p>
                    SQL/Python data workflows, Power BI dashboards, and
                    forecasting for business planning.
                  </p>
                </article>
              </div>
            </div>
            <div className="toolbox">
              <h3>My working toolkit.</h3>
              <div className="toolbox-row">
                <span>01</span>
                <div>
                  <h4>Build the application</h4>
                  <p>Python · TypeScript · FastAPI · React · SSE</p>
                </div>
              </div>
              <div className="toolbox-row">
                <span>02</span>
                <div>
                  <h4>Give it useful context</h4>
                  <p>Hybrid retrieval · Reranking · LangGraph · Memory</p>
                </div>
              </div>
              <div className="toolbox-row">
                <span>03</span>
                <div>
                  <h4>Connect it to real work</h4>
                  <p>Typed tools · PostgreSQL · AWS · Async jobs · Tests</p>
                </div>
              </div>
              <div className="education">
                <span className="mono">FOUNDATIONS & CONTINUED LEARNING</span>
                <h4>
                  M.S. Data Analytics <span>4.0 / 4.0</span>
                </h4>
                <p>University of Illinois Springfield · 2022–2024</p>
                <h4>B.Sc. Computer Science</h4>
                <p>Osmania University · 2016–2020</p>
                <div className="learning-note">
                  <span>↗</span>
                  <p>
                    Currently extending my interests into inference engineering:
                    caching, quantization, batching, and serving. Coursework and
                    local experiments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="contact" className="contact-section">
          <div className="page-width contact-inner">
            <div>
              <p className="eyebrow">
                <span className="status-dot" /> OPEN TO AI ENGINEERING
                OPPORTUNITIES
              </p>
              <h2>
                Let’s build something
                <br />
                <em>worth using.</em>
              </h2>
              <p>
                AI engineering, applied AI, and ML engineering roles.
                <br />
                Based in Austin. Open to remote, hybrid, and relocation.
              </p>
              <a className="contact-email" href="mailto:sarath231097@gmail.com">
                sarath231097@gmail.com <Arrow diagonal />
              </a>
              <button
                className="copy-email"
                onClick={copyEmail}
                aria-live="polite"
              >
                {copied ? "✓ Email copied" : "Copy email address"}
              </button>
            </div>
            <div className="contact-aside">
              <span className="contact-asterisk" aria-hidden="true">
                ✳
              </span>
              <a
                className="button dark"
                href="./sarath-ai-ml-engineer-resume.pdf"
                target="_blank"
                rel="noreferrer"
              >
                Read my résumé <span>↓</span>
              </a>
              <div>
                <External href="https://www.linkedin.com/in/sarathgentela/">
                  LinkedIn
                </External>
                <External href="https://github.com/akira231097">
                  GitHub
                </External>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="page-width site-footer">
        <a className="brand" href="#top">
          <Mark />
          <span>sarath.</span>
        </a>
        <p>Built with care. Grounded in real work.</p>
        <span className="mono">
          © {new Date().getFullYear()} SARATH GENTELA
        </span>
        <a href="#top" aria-label="Back to top">
          ↑
        </a>
      </footer>
      <CaseStudy project={selected} onClose={closeCase} />
    </>
  );
}
