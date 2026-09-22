import type { ArchitectureDiagram } from "./components/ArchitectureExplorer";

export const architectureDiagrams: ArchitectureDiagram[] = [
  {
    id: "harness",
    title: "Agent harness",
    subtitle:
      "The model reasons. The application owns execution, state, and evidence.",
    scope:
      "Simplified production pattern, using the publicly described Lucidream stack. My work centers on action control, evidence, editing, and recovery within a team-built runtime.",
    lanes: [
      { row: 0, label: "INTERACTION & REASONING" },
      { row: 1, label: "CONTEXT & EXECUTION CONTROL" },
      { row: 2, label: "DURABLE WORK & RESULTS" },
    ],
    nodes: [
      {
        id: "client",
        title: "Streaming interface",
        technology: "React · TypeScript · SSE",
        detail:
          "Messages, tool progress, review cards, and artifacts are projections of application state. I contributed review controls, precision editing, and lifecycle reconciliation across the interface and backend.",
        kind: "interface",
        column: 0,
        row: 0,
      },
      {
        id: "runtime",
        title: "Agent runtime",
        technology: "Python · FastAPI · tool loop",
        detail:
          "Assemble context, call a model, interpret a tool proposal, observe the result, and continue. I extended the team-built harness with action contracts, review behavior, and lifecycle handling.",
        kind: "runtime",
        column: 1,
        row: 0,
      },
      {
        id: "model",
        title: "Model provider",
        technology: "Provider adapters · structured output",
        detail:
          "The model proposes text and tool calls. Its response is an input to application logic; a completion claim is checked against actual action or job outcomes.",
        kind: "runtime",
        column: 2,
        row: 0,
      },
      {
        id: "context",
        title: "Context assembly",
        technology: "History · memory · source context",
        detail:
          "Use conversation and media context to scope the next model step. My retrieval work treats query understanding, source selection, and context continuity as separate engineering concerns.",
        kind: "storage",
        column: 0,
        row: 1,
      },
      {
        id: "gate",
        title: "Action review boundary",
        technology: "Typed inputs · policy · confirmation",
        detail:
          "I built action-contract and ledger behavior and contributed server-side review and exact-action confirmation. Valid structure alone is not permission: scope and policy still matter before an effect is executed.",
        kind: "control",
        column: 1,
        row: 1,
      },
      {
        id: "tools",
        title: "Application tools",
        technology: "Search · clip edits · render requests",
        detail:
          "Tools perform bounded application operations and return concrete results. I contributed precision editing and the connection between tool effects, recorded outcomes, and creator-visible responses.",
        kind: "runtime",
        column: 2,
        row: 1,
      },
      {
        id: "state",
        title: "Run & action evidence",
        technology: "PostgreSQL · durable records",
        detail:
          "Server-owned records distinguish what was proposed, accepted, and completed. I built the action ledger so the assistant’s account can be checked against recorded execution evidence.",
        kind: "storage",
        column: 0,
        row: 2,
      },
      {
        id: "jobs",
        title: "Asynchronous execution",
        technology: "SQS · background workers",
        detail:
          "Long-running media work is handed off to workers. I contributed recovery behavior around queued work, worker claims, and client reconnection with teammates owning adjacent infrastructure.",
        kind: "worker",
        column: 1,
        row: 2,
      },
      {
        id: "artifacts",
        title: "Outputs & reconciliation",
        technology: "Media storage · S3 · status events",
        detail:
          "A queued render becomes a usable result only when the output and terminal state are available. The frontend reconciles durable outcomes, rather than interpreting a lost stream as the job’s final state.",
        kind: "storage",
        column: 2,
        row: 2,
      },
    ],
    edges: [
      { from: "client", to: "runtime", label: "user turn" },
      { from: "runtime", to: "model", label: "context + tools" },
      { from: "model", to: "runtime", label: "proposal", dashed: true },
      { from: "context", to: "runtime", label: "scoped context" },
      { from: "runtime", to: "gate", label: "tool intent" },
      { from: "gate", to: "tools", label: "authorized action" },
      { from: "gate", to: "state", label: "decision record" },
      { from: "tools", to: "state", label: "observed outcome" },
      { from: "tools", to: "runtime", label: "observation", dashed: true },
      { from: "tools", to: "jobs", label: "long-running work" },
      { from: "jobs", to: "artifacts", label: "terminal result" },
      { from: "state", to: "context", label: "restore context", dashed: true },
    ],
    notes: [
      "The ledger records observed application outcomes; model prose is not an execution receipt.",
      "Typed tool arguments, resource scope, and approval are separate checks.",
      "This architecture does not imply a global exactly-once transaction across services.",
    ],
  },
  {
    id: "retrieval",
    title: "Search & ranking",
    subtitle:
      "Retrieve broadly, fuse by rank, rerank with context, and return source-backed results.",
    scope:
      "Source-grounded reference architecture from EchoFind and Clipopedia. The production AskSpice case describes my related retrieval work; the public repositories are separate implementations.",
    lanes: [
      { row: 0, label: "QUERY PLANNING" },
      { row: 1, label: "CANDIDATE GENERATION & FUSION" },
      { row: 2, label: "HYDRATION, RERANKING & SELECTION" },
    ],
    nodes: [
      {
        id: "question",
        title: "Question + session",
        technology: "FastAPI · SSE · typed state",
        detail:
          "Resolve whether the turn needs conversation, an episode, or a clip. Retain relevant entities and topic context while handling follow-ups and topic shifts explicitly.",
        kind: "interface",
        column: 0,
        row: 0,
      },
      {
        id: "plan",
        title: "Query planner",
        technology: "Intent · entities · time buckets",
        detail:
          "Analyze names, intent, and recency. Time-bucket planning separates a request for recent material from relevance-only retrieval rather than forcing both into one ranking.",
        kind: "runtime",
        column: 1,
        row: 0,
      },
      {
        id: "hyde",
        title: "Query expansion",
        technology: "HyDE · weighted hypotheses",
        detail:
          "Generate hypothetical answer/transcript text to expand the query representation. These hypotheses guide retrieval; they do not become factual evidence in the answer.",
        kind: "runtime",
        column: 2,
        row: 0,
      },
      {
        id: "sparse",
        title: "Lexical candidates",
        technology: "Sparse / BM25 signals",
        detail:
          "Lexical signals recover exact names, domain terms, and wording that semantic similarity can underweight. They complement rather than replace the dense candidate set.",
        kind: "storage",
        column: 0,
        row: 1,
      },
      {
        id: "dense",
        title: "Semantic candidates",
        technology: "Embeddings · Pinecone adapters",
        detail:
          "Dense retrieval finds conceptual matches and paraphrases across query variants. Public offline demos use deterministic substitutes, while live adapters require configured indexes and providers.",
        kind: "storage",
        column: 1,
        row: 1,
      },
      {
        id: "fusion",
        title: "Rank fusion + diversity",
        technology: "RRF · bucket weights · caps",
        detail:
          "Combine ranked lists without assuming their raw scores are comparable. Weighted time buckets and per-episode diversity constraints prevent one query or episode from dominating the shortlist.",
        kind: "control",
        column: 2,
        row: 1,
      },
      {
        id: "hydrate",
        title: "Source hydration",
        technology: "PostgreSQL · transcript metadata",
        detail:
          "Resolve candidate IDs to full transcript and episode context. Ranking and generation need the source text and metadata, not just a vector-store ID and similarity score.",
        kind: "storage",
        column: 0,
        row: 2,
      },
      {
        id: "rerank",
        title: "Rerank + rescore",
        technology: "Cohere · recency/entity signals",
        detail:
          "Apply a query–passage reranking stage to a smaller hydrated shortlist, then combine relevance with explicit metadata and recency signals. This stage is inspectable separately from candidate retrieval.",
        kind: "control",
        column: 1,
        row: 2,
      },
      {
        id: "select",
        title: "Select + update memory",
        technology: "Structured selection · source context",
        detail:
          "Select a supported clip or episode, return its context, and update conversation state. EchoFind tracks recent results; Clipopedia supplies a reproducible labeled offline evaluation.",
        kind: "runtime",
        column: 2,
        row: 2,
      },
    ],
    edges: [
      { from: "question", to: "plan", label: "request context" },
      { from: "plan", to: "hyde", label: "expansion plan" },
      { from: "plan", to: "sparse", label: "exact terms" },
      { from: "hyde", to: "dense", label: "query variants" },
      { from: "sparse", to: "fusion", label: "lexical ranks" },
      { from: "dense", to: "fusion", label: "semantic ranks" },
      { from: "fusion", to: "hydrate", label: "candidate IDs" },
      { from: "hydrate", to: "rerank", label: "source text" },
      { from: "rerank", to: "select", label: "ranked shortlist" },
    ],
    notes: [
      "Hybrid retrieval improves candidate coverage; reranking is a separate precision stage.",
      "Synthetic evaluation: Clipopedia reproduced 13/14 relevant first results on 14 fictional clips.",
      "An observed pricing-query miss is included in the evidence record, alongside the successful runs.",
    ],
  },
  {
    id: "infrastructure",
    title: "Durable AI workflows",
    subtitle:
      "Separate the lifetime of a request, a background job, and the client connection.",
    scope:
      "Public-level system design pattern for asynchronous AI/media work. Recovery and user-interface reconciliation are among my verified production contributions.",
    lanes: [
      { row: 0, label: "ACCEPT & PERSIST" },
      { row: 1, label: "EXECUTE & MATERIALIZE" },
      { row: 2, label: "RECONCILE & DELIVER" },
    ],
    nodes: [
      {
        id: "request",
        title: "Request an operation",
        technology: "HTTP API · authenticated context",
        detail:
          "An API request establishes what should happen and which user/resource context it belongs to. It does not need to hold an HTTP connection open until a render finishes.",
        kind: "interface",
        column: 0,
        row: 0,
      },
      {
        id: "validate",
        title: "Validate the action",
        technology: "Typed contracts · authorization",
        detail:
          "Check argument shape, resource scope, and action policy before creating work. A retry must not silently change what was authorized.",
        kind: "control",
        column: 1,
        row: 0,
      },
      {
        id: "persist",
        title: "Persist job identity",
        technology: "PostgreSQL · explicit job states",
        detail:
          "Store identity and state so a request can be distinguished from a later retry or reconnect. Accepted, queued, running, and terminal are different states.",
        kind: "storage",
        column: 2,
        row: 0,
      },
      {
        id: "queue",
        title: "Queue the work",
        technology: "SQS · at-least-once delivery",
        detail:
          "Move expensive work outside the request. Queue delivery can repeat, so application-level claims, stable IDs, and recovery logic must handle duplicate delivery.",
        kind: "worker",
        column: 2,
        row: 1,
      },
      {
        id: "worker",
        title: "Execute the job",
        technology: "Media workers · bounded recovery",
        detail:
          "Workers perform media processing while the application follows job state. I contributed render recovery and handling of claim/watch races within the team-built workflow.",
        kind: "worker",
        column: 1,
        row: 1,
      },
      {
        id: "store",
        title: "Materialize the artifact",
        technology: "S3 · generated media",
        detail:
          "Persist the output before treating the job as complete. The existence of a queued task is not evidence that a usable artifact has been produced.",
        kind: "storage",
        column: 0,
        row: 1,
      },
      {
        id: "reconcile",
        title: "Reconcile terminal state",
        technology: "Recorded outcome · recovery checks",
        detail:
          "Resolve running, failed, and completed states using durable evidence. A late event or interrupted stream should not overwrite an already established outcome.",
        kind: "control",
        column: 0,
        row: 2,
      },
      {
        id: "events",
        title: "Project progress",
        technology: "SSE · typed lifecycle events",
        detail:
          "Progress is an interface projection of application state. I contributed event handling and reconciliation that keep users informed about queued and ongoing work.",
        kind: "runtime",
        column: 1,
        row: 2,
      },
      {
        id: "reattach",
        title: "Reload or reconnect",
        technology: "React · state hydration",
        detail:
          "Rebuild the interface from persisted state and subsequent events. Recovery keeps a transient network issue separate from the actual result of background work.",
        kind: "interface",
        column: 2,
        row: 2,
      },
    ],
    edges: [
      { from: "request", to: "validate", label: "operation" },
      { from: "validate", to: "persist", label: "accepted" },
      { from: "persist", to: "queue", label: "job reference" },
      { from: "queue", to: "worker", label: "claim work" },
      { from: "worker", to: "store", label: "write output" },
      { from: "store", to: "reconcile", label: "result evidence" },
      { from: "reconcile", to: "events", label: "terminal state" },
      { from: "events", to: "reattach", label: "update UI" },
      { from: "reattach", to: "persist", label: "reload state", dashed: true },
    ],
    notes: [
      "Stable job identity and idempotent operations help handle repeated delivery.",
      "A job can outlive the original browser connection.",
      "Database, queue, storage, and model APIs are separate failure boundaries.",
    ],
  },
];
