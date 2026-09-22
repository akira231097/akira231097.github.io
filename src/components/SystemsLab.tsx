import { useEffect, useId, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import "./SystemsLab.css";

type LabTab = "actions" | "retrieval" | "jobs";
type ActionState = "idle" | "proposed" | "reviewing" | "approved" | "rejected";
type JobState = "queued" | "running" | "interrupted" | "completed";

const tabs: { id: LabTab; number: string; label: string; short: string }[] = [
  { id: "actions", number: "01", label: "Agent actions", short: "Control" },
  {
    id: "retrieval",
    number: "02",
    label: "Hybrid retrieval",
    short: "Grounding",
  },
  { id: "jobs", number: "03", label: "Recoverable jobs", short: "Continuity" },
];

const sources = [
  {
    id: "AGENT–01",
    title: "An action has a contract",
    category: "Agent actions",
    body: "Validate tool inputs, show the proposed change, and ask for human approval before a write action.",
    terms: [
      "agent",
      "agents",
      "tool",
      "tools",
      "approval",
      "approve",
      "permission",
      "action",
      "actions",
      "human",
      "write",
      "control",
      "change",
      "safe",
      "safety",
    ],
    answer:
      "A proposed write should be validated and reviewed before it is applied. The approval boundary keeps the person in control of the change.",
  },
  {
    id: "SEARCH–02",
    title: "An answer needs evidence",
    category: "Hybrid retrieval",
    body: "Combine keyword and semantic search, rank the retrieved documents, and cite the source supporting the answer.",
    terms: [
      "retrieval",
      "search",
      "evidence",
      "source",
      "sources",
      "citation",
      "citations",
      "cite",
      "answer",
      "answers",
      "find",
      "grounded",
      "grounding",
      "semantic",
      "keyword",
      "document",
      "documents",
    ],
    answer:
      "Keyword matching finds exact terms; semantic matching finds related ideas. Merging both signals can find useful evidence, which should be cited in the answer.",
  },
  {
    id: "JOBS–03",
    title: "Progress outlives a connection",
    category: "Recoverable jobs",
    body: "Persist job state and completed checkpoints so a client can reconnect and resume without repeating finished steps.",
    terms: [
      "job",
      "jobs",
      "checkpoint",
      "checkpoints",
      "resume",
      "recover",
      "recovery",
      "recoverable",
      "connection",
      "disconnect",
      "disconnected",
      "reconnect",
      "lost",
      "survive",
      "interrupted",
      "interrupt",
      "progress",
      "retry",
      "background",
    ],
    answer:
      "Keep job progress and checkpoints separate from the client connection. After reconnecting, resume at the last saved checkpoint so completed steps are not repeated.",
  },
];

const stopWords = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "can",
  "do",
  "does",
  "for",
  "from",
  "how",
  "i",
  "in",
  "is",
  "it",
  "my",
  "of",
  "on",
  "or",
  "so",
  "the",
  "to",
  "what",
  "when",
  "with",
]);
const tokenize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word && !stopWords.has(word));

function searchFixtures(query: string) {
  const tokens = [...new Set(tokenize(query))];
  return sources
    .map((source) => {
      const textTokens = new Set(tokenize(`${source.title} ${source.body}`));
      const lexicalMatches = tokens.filter((token) =>
        textTokens.has(token),
      ).length;
      const conceptMatches = tokens.filter((token) =>
        source.terms.includes(token),
      ).length;
      const lexical = tokens.length
        ? Math.min(1, lexicalMatches / Math.min(tokens.length, 3))
        : 0;
      const semantic = conceptMatches
        ? Math.min(0.96, 0.5 + conceptMatches * 0.13)
        : 0;
      return {
        ...source,
        lexical,
        semantic,
        score: lexical * 0.42 + semantic * 0.58,
      };
    })
    .sort((a, b) => b.score - a.score);
}

function Arrow({ vertical = false }: { vertical?: boolean }) {
  return (
    <span
      className={`sl-arrow${vertical ? " sl-arrow--vertical" : ""}`}
      aria-hidden="true"
    >
      {vertical ? "↓" : "→"}
    </span>
  );
}

function ActionLab() {
  const [state, setState] = useState<ActionState>("idle");
  const primaryButton = useRef<HTMLButtonElement>(null);
  const reached =
    state === "idle"
      ? 0
      : state === "proposed"
        ? 1
        : state === "reviewing"
          ? 2
          : 3;
  const [details, setDetails] = useState(false);
  const primaryAction = {
    idle: { label: "Prepare the proposal", symbol: "↗", next: "proposed" },
    proposed: { label: "Review this change", symbol: "→", next: "reviewing" },
    reviewing: { label: "Approve & apply", symbol: "✓", next: "approved" },
    approved: { label: "Try the other path", symbol: "↺", next: "idle" },
    rejected: { label: "Try the other path", symbol: "↺", next: "idle" },
  }[state] as { label: string; symbol: string; next: ActionState };
  const changeFromSecondary = (next: ActionState) => {
    setState(next);
    primaryButton.current?.focus();
  };
  return (
    <div className="sl-panel-content">
      <div className="sl-explanation">
        <p className="sl-eyebrow">Capability, with control</p>
        <h3>
          A useful agent knows
          <br /> when to ask.
        </h3>
        <p>
          Follow a proposed edit from request to result. A tool can prepare a
          change; a person decides whether it happens.
        </p>
        <div className="sl-takeaway">
          <span aria-hidden="true">↳</span> The boundary matters as much as the
          intelligence.
        </div>
        <button
          type="button"
          className="sl-details-toggle"
          aria-expanded={details}
          onClick={() => setDetails(!details)}
        >
          {details ? "−" : "+"} Under the hood
        </button>
        {details && (
          <p className="sl-detail-copy">
            This local example uses a typed action, a preview, and an explicit
            approval state. In a real system, validation and authorization must
            also be enforced by the server.
          </p>
        )}
      </div>
      <div className="sl-workbench">
        <div className="sl-bench-heading">
          <span>Action walkthrough</span>
          <span className="sl-small-label">You are the reviewer</span>
        </div>
        <div
          className="sl-action-flow"
          aria-label="Request, proposal, review, result"
        >
          {["Request", "Propose", "Review", "Result"].map((label, index) => (
            <div className="sl-flow-item" key={label}>
              {index > 0 && <Arrow />}
              <div
                className={`sl-flow-node ${reached >= index ? "is-reached" : ""} ${reached === index ? "is-current" : ""}`}
              >
                <span>
                  {reached > index ? "✓" : String(index + 1).padStart(2, "0")}
                </span>
                {label}
              </div>
            </div>
          ))}
        </div>
        <div className="sl-action-card" aria-live="polite" aria-atomic="true">
          <div className="sl-card-kicker">
            <span
              className={`sl-status-dot ${state === "rejected" ? "sl-status-dot--coral" : ""}`}
            />
            {state === "idle"
              ? "REQUEST RECEIVED"
              : state === "proposed"
                ? "PROPOSAL READY"
                : state === "reviewing"
                  ? "WAITING FOR YOUR DECISION"
                  : state === "approved"
                    ? "CHANGE APPLIED · LOCAL DEMO"
                    : "CHANGE DECLINED"}
          </div>
          {state === "idle" && (
            <>
              <h4>“Make this project summary clearer.”</h4>
              <p>
                The agent can suggest an edit to a sample project note. First,
                it has to explain what will change.
              </p>
            </>
          )}
          {(state === "proposed" || state === "reviewing") && (
            <>
              <h4>Update one project note</h4>
              <div className="sl-diff">
                <div>
                  <span>BEFORE</span>
                  <p>Uses AI and search.</p>
                </div>
                <div>
                  <span>PROPOSED</span>
                  <p>
                    Finds relevant documents and connects each answer to its
                    evidence.
                  </p>
                </div>
              </div>
              <p className="sl-action-note">
                {state === "proposed"
                  ? "One field will change. Nothing has been saved."
                  : "Review the exact change above. Your decision determines the next step."}
              </p>
            </>
          )}
          {state === "approved" && (
            <>
              <div className="sl-result-icon" aria-hidden="true">
                ✓
              </div>
              <h4>A clear change. An explicit yes.</h4>
              <p>
                The sample note now reads: “Finds relevant documents and
                connects each answer to its evidence.”
              </p>
              <div className="sl-audit-line">
                Approved by you <span>→</span> Applied once <span>→</span>{" "}
                Result recorded
              </div>
            </>
          )}
          {state === "rejected" && (
            <>
              <h4>Your “no” is a valid result.</h4>
              <p>
                The sample note remains “Uses AI and search.” The proposed
                action ended without applying a change.
              </p>
              <div className="sl-audit-line">
                Declined by you <span>→</span> No write performed
              </div>
            </>
          )}
        </div>
        <div className="sl-controls">
          <button
            type="button"
            ref={primaryButton}
            className={`sl-button ${state === "approved" || state === "rejected" ? "sl-button--secondary" : "sl-button--primary"}`}
            onClick={() => setState(primaryAction.next)}
          >
            {primaryAction.label}{" "}
            <span aria-hidden="true">{primaryAction.symbol}</span>
          </button>
          {state === "reviewing" && (
            <button
              type="button"
              className="sl-button sl-button--secondary"
              onClick={() => changeFromSecondary("rejected")}
            >
              Decline
            </button>
          )}
          {state !== "idle" && state !== "approved" && state !== "rejected" && (
            <button
              type="button"
              className="sl-reset"
              onClick={() => changeFromSecondary("idle")}
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function RetrievalLab() {
  const [query, setQuery] = useState(
    "How does a job survive a lost connection?",
  );
  const [submitted, setSubmitted] = useState(
    "How does a job survive a lost connection?",
  );
  const [details, setDetails] = useState(false);
  const queryId = useId();
  const results = searchFixtures(submitted);
  const winner = results[0];
  const hasEvidence = winner.score >= 0.3;
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(query.trim());
  };
  const chooseQuery = (value: string) => {
    setQuery(value);
    setSubmitted(value);
  };
  return (
    <div className="sl-panel-content">
      <div className="sl-explanation">
        <p className="sl-eyebrow">An answer you can trace</p>
        <h3>
          Find the meaning.
          <br /> Keep the evidence.
        </h3>
        <p>
          Exact words are one signal. Related concepts are another. Explore how
          combining them changes which source rises to the top.
        </p>
        <div className="sl-takeaway">
          <span aria-hidden="true">↳</span> Without enough evidence, say so.
        </div>
        <button
          type="button"
          className="sl-details-toggle"
          aria-expanded={details}
          onClick={() => setDetails(!details)}
        >
          {details ? "−" : "+"} How this demo scores
        </button>
        {details && (
          <p className="sl-detail-copy">
            Three sample documents. Exact token overlap supplies the lexical
            signal; a small hand-written concept dictionary stands in for
            semantic similarity. The score is 42% lexical + 58% conceptual. No
            embeddings or language model run here.
          </p>
        )}
      </div>
      <div className="sl-workbench sl-workbench--retrieval">
        <div className="sl-bench-heading">
          <span>Three sources. Two signals.</span>
          <span className="sl-small-label">Fixture-based search</span>
        </div>
        <form className="sl-query-form" onSubmit={handleSubmit}>
          <label className="sl-sr-only" htmlFor={queryId}>
            Search the sample sources
          </label>
          <input
            id={queryId}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ask about actions, search, or jobs…"
            maxLength={180}
          />
          <button type="submit" aria-label="Search the sample sources">
            <span aria-hidden="true">↗</span>
          </button>
        </form>
        <div className="sl-query-examples">
          <span>Try:</span>
          <button
            type="button"
            onClick={() =>
              chooseQuery("Can a tool make a change without approval?")
            }
          >
            Human control
          </button>
          <button
            type="button"
            onClick={() => chooseQuery("How do answers cite their sources?")}
          >
            Grounded answers
          </button>
          <button
            type="button"
            onClick={() => chooseQuery("What is the weather tomorrow?")}
          >
            No evidence
          </button>
        </div>
        <div className="sl-signal-key">
          <span>
            <i className="sl-key-lexical" />
            Exact words
          </span>
          <span>
            <i className="sl-key-semantic" />
            Related concepts
          </span>
          <span className="sl-score-heading">Combined</span>
        </div>
        <div
          className="sl-search-results"
          aria-live="polite"
          aria-atomic="true"
        >
          {results.map((source, index) => (
            <div
              key={source.id}
              className={`sl-source-row ${hasEvidence && index === 0 ? "is-winner" : ""}`}
            >
              <div className="sl-source-title">
                <span className="sl-source-rank">0{index + 1}</span>
                <div>
                  <strong>{source.title}</strong>
                  <small>{source.id}</small>
                </div>
              </div>
              <div
                className="sl-score-bars"
                aria-label={`Exact word signal ${Math.round(source.lexical * 100)} percent; related concept signal ${Math.round(source.semantic * 100)} percent`}
              >
                <div className="sl-score-track">
                  <span
                    className="sl-score-lexical"
                    style={{ width: `${source.lexical * 100}%` }}
                  />
                </div>
                <div className="sl-score-track">
                  <span
                    className="sl-score-semantic"
                    style={{ width: `${source.semantic * 100}%` }}
                  />
                </div>
              </div>
              <span className="sl-source-score">
                {Math.round(source.score * 100)}
                <small>%</small>
              </span>
            </div>
          ))}
          <div
            className={`sl-grounded-answer ${!hasEvidence ? "sl-grounded-answer--empty" : ""}`}
          >
            <div className="sl-card-kicker">
              {hasEvidence
                ? "SOURCE-BACKED SAMPLE ANSWER"
                : "INSUFFICIENT EVIDENCE"}
            </div>
            <p>
              {hasEvidence
                ? winner.answer
                : "These sample sources do not support an answer to that question. Try asking about agent actions, retrieval, or recoverable jobs."}
            </p>
            {hasEvidence && (
              <span className="sl-citation">
                ↳ {winner.id} · {winner.category}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const jobSteps = [
  "Request accepted",
  "Inputs prepared",
  "Result computed",
  "Result saved",
];

function JobsLab() {
  const [status, setStatus] = useState<JobState>("queued");
  const primaryButton = useRef<HTMLButtonElement>(null);
  const resetButton = useRef<HTMLButtonElement>(null);
  const [checkpoint, setCheckpoint] = useState(0);
  const [reconnections, setReconnections] = useState(0);
  const [details, setDetails] = useState(false);
  useEffect(() => {
    if (status !== "running") return;
    const timeout = window.setTimeout(() => {
      const nextCheckpoint = checkpoint + 1;
      setCheckpoint(nextCheckpoint);
      if (nextCheckpoint >= jobSteps.length) {
        if (document.activeElement === resetButton.current)
          primaryButton.current?.focus({ preventScroll: true });
        setStatus("completed");
      }
    }, 1800);
    return () => window.clearTimeout(timeout);
  }, [status, checkpoint]);
  const reset = () => {
    setStatus("queued");
    setCheckpoint(0);
    setReconnections(0);
  };
  const reconnect = () => {
    setReconnections((value) => value + 1);
    setStatus("running");
  };
  const statusLabel =
    status === "queued"
      ? "Ready to start"
      : status === "running"
        ? "Processing"
        : status === "interrupted"
          ? "Connection interrupted"
          : "Completed";
  const primaryAction = {
    queued: {
      label: "Start the job",
      symbol: "→",
      style: "primary",
      run: () => setStatus("running"),
    },
    running: {
      label: "Interrupt connection",
      symbol: "↯",
      style: "coral",
      run: () => setStatus("interrupted"),
    },
    interrupted: {
      label: "Reconnect & resume",
      symbol: "↻",
      style: "primary",
      run: reconnect,
    },
    completed: {
      label: "Run it again",
      symbol: "↺",
      style: "secondary",
      run: reset,
    },
  }[status];
  return (
    <div className="sl-panel-content">
      <div className="sl-explanation">
        <p className="sl-eyebrow">Built for the imperfect path</p>
        <h3>
          A lost connection
          <br /> isn’t lost work.
        </h3>
        <p>
          Start a job, interrupt it, then reconnect. Completed steps remain
          checked off as the work resumes from its saved checkpoint.
        </p>
        <div className="sl-takeaway">
          <span aria-hidden="true">↳</span> Reliability is something people
          experience.
        </div>
        <button
          type="button"
          className="sl-details-toggle"
          aria-expanded={details}
          onClick={() => setDetails(!details)}
        >
          {details ? "−" : "+"} Under the hood
        </button>
        {details && (
          <p className="sl-detail-copy">
            This simulation pauses a local timer and retains progress in
            component state. Production recovery needs durable server-side
            state, stable job IDs, and idempotent steps. Refreshing this demo
            resets it.
          </p>
        )}
      </div>
      <div className="sl-workbench">
        <div className="sl-bench-heading">
          <span>One job. A continuous history.</span>
          <span className="sl-small-label">JOB–0042</span>
        </div>
        <div className="sl-connection-map">
          <div
            className={`sl-endpoint ${status === "interrupted" ? "is-offline" : ""}`}
          >
            <span className="sl-endpoint-icon" aria-hidden="true">
              ▣
            </span>
            <strong>Your browser</strong>
            <small>
              {status === "interrupted" ? "Disconnected" : "Connected"}
            </small>
          </div>
          <div
            className={`sl-connection-line ${status === "interrupted" ? "is-broken" : ""}`}
          >
            <span>{status === "interrupted" ? "×" : "↔"}</span>
            <small>
              {status === "interrupted" ? "connection lost" : "connection"}
            </small>
          </div>
          <div className="sl-endpoint sl-endpoint--durable">
            <span className="sl-endpoint-icon" aria-hidden="true">
              ▤
            </span>
            <strong>Job + checkpoint</strong>
            <small>Progress retained</small>
          </div>
        </div>
        <div className="sl-job-progress">
          <div>
            <span
              className={`sl-status-dot ${status === "interrupted" ? "sl-status-dot--coral" : ""}`}
            />
            <strong aria-live="polite">{statusLabel}</strong>
            <span className="sl-progress-count">
              {checkpoint}/{jobSteps.length} steps
            </span>
          </div>
          <div
            className="sl-progress-track"
            role="progressbar"
            aria-label="Completed job steps"
            aria-valuenow={checkpoint}
            aria-valuemin={0}
            aria-valuemax={jobSteps.length}
          >
            <span
              style={{ width: `${(checkpoint / jobSteps.length) * 100}%` }}
            />
          </div>
        </div>
        <ol className="sl-job-steps">
          {jobSteps.map((step, index) => (
            <li
              key={step}
              className={
                checkpoint > index
                  ? "is-done"
                  : status === "running" && checkpoint === index
                    ? "is-running"
                    : ""
              }
            >
              <span className="sl-step-marker" aria-hidden="true">
                {checkpoint > index ? "✓" : String(index + 1).padStart(2, "0")}
              </span>
              <span>{step}</span>
              <small>
                {checkpoint > index
                  ? "Saved"
                  : status === "running" && checkpoint === index
                    ? "Working…"
                    : "Pending"}
              </small>
            </li>
          ))}
        </ol>
        <div className="sl-job-feedback" aria-live="polite">
          {status === "queued"
            ? "Start the job, then try interrupting the connection."
            : status === "interrupted"
              ? `Checkpoint ${checkpoint} is retained. Reconnect to continue from here.`
              : status === "completed"
                ? `${reconnections ? `Recovered after ${reconnections} ${reconnections === 1 ? "interruption" : "interruptions"}. ` : ""}All four steps finished exactly once in this simulation.`
                : reconnections
                  ? `Resumed from saved progress. ${checkpoint} ${checkpoint === 1 ? "step" : "steps"} completed.`
                  : "The job saves its progress as each step finishes."}
        </div>
        <div className="sl-controls">
          <button
            type="button"
            ref={primaryButton}
            className={`sl-button sl-button--${primaryAction.style}`}
            onClick={primaryAction.run}
          >
            {primaryAction.label}{" "}
            <span aria-hidden="true">{primaryAction.symbol}</span>
          </button>
          {status !== "queued" && status !== "completed" && (
            <button
              type="button"
              ref={resetButton}
              className="sl-reset"
              onClick={() => {
                reset();
                primaryButton.current?.focus();
              }}
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SystemsLab() {
  const [activeTab, setActiveTab] = useState<LabTab>("actions");
  const instanceId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const handleTabKey = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft")
      next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;
    event.preventDefault();
    setActiveTab(tabs[next].id);
    tabRefs.current[next]?.focus();
  };
  return (
    <div className="systems-lab">
      <div className="sl-topline">
        <span>
          <i aria-hidden="true" /> Inside the system
        </span>
        <span>Interactive engineering notes</span>
      </div>
      <div
        className="sl-tabs"
        role="tablist"
        aria-label="Explore system design concepts"
      >
        {tabs.map((tab, index) => (
          <button
            type="button"
            key={tab.id}
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            id={`${instanceId}-${tab.id}-tab`}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`${instanceId}-${tab.id}-panel`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            className={`sl-tab ${activeTab === tab.id ? "is-active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
            onKeyDown={(event) => handleTabKey(event, index)}
          >
            <span className="sl-tab-number">{tab.number}</span>
            <span>
              {tab.label}
              <small>{tab.short}</small>
            </span>
            <span className="sl-tab-arrow" aria-hidden="true">
              ↗
            </span>
          </button>
        ))}
      </div>
      <div
        id={`${instanceId}-actions-panel`}
        role="tabpanel"
        aria-labelledby={`${instanceId}-actions-tab`}
        tabIndex={0}
        className="sl-tab-panel"
        hidden={activeTab !== "actions"}
      >
        <ActionLab />
      </div>
      <div
        id={`${instanceId}-retrieval-panel`}
        role="tabpanel"
        aria-labelledby={`${instanceId}-retrieval-tab`}
        tabIndex={0}
        className="sl-tab-panel"
        hidden={activeTab !== "retrieval"}
      >
        <RetrievalLab />
      </div>
      <div
        id={`${instanceId}-jobs-panel`}
        role="tabpanel"
        aria-labelledby={`${instanceId}-jobs-tab`}
        tabIndex={0}
        className="sl-tab-panel"
        hidden={activeTab !== "jobs"}
      >
        <JobsLab />
      </div>
      <div className="sl-footer">
        <span className="sl-demo-label">Illustrative local simulation</span>
        <span>Sample data · No live AI or private system architecture</span>
      </div>
    </div>
  );
}
