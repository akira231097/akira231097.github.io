export type ProductionSystem = {
  id: string;
  name: string;
  label: string;
  title: string;
  summary: string;
  question: string;
  ownership: string;
  flow: string[];
  modules: { title: string; implementation: string; outcome: string }[];
  stack: { boundary: string; tools: string; responsibility: string }[];
  sources: { label: string; url: string }[];
};
export const productionSystems: ProductionSystem[] = [
  {
    id: "lucidream",
    name: "Lucidream",
    label: "PRODUCTION AGENT HARNESS",
    title: "Connecting model decisions to controlled execution.",
    summary:
      "A creator request can span retrieval, editing, rendering, and written outputs. I implemented major control, context, and lifecycle capabilities within the production agent harness—and carried their state into the React experience.",
    question:
      "How do you give an agent useful tools while keeping execution, authorization, and completion grounded in application state?",
    ownership:
      "My implementation areas: action evidence and contracts, review and confirmation, context extensions, run lifecycle, precision editing, and recovery. Team-built product.",
    flow: [
      "Context assembly",
      "Model ↔ tool loop",
      "Action review",
      "Recorded effects",
      "Async results",
    ],
    modules: [
      {
        title: "Action evidence & contracts",
        implementation:
          "Server-owned action records, structured obligations, tool-result validation, and separate read/mutation semantics.",
        outcome:
          "Completion claims can be reconciled with observed tool outcomes; queued work is distinct from finished work.",
      },
      {
        title: "Review & confirmation",
        implementation:
          "Backend allow/confirm/deny decisions, scoped confirmation state, and corresponding React approval cards.",
        outcome:
          "The application checks proposed effects before execution and makes the decision visible to the user.",
      },
      {
        title: "Context & run lifecycle",
        implementation:
          "Source-aware context, memory extensions, cancellation, status/attach APIs, streaming lifecycle, and replay/reload handling.",
        outcome:
          "A follow-up retains useful context, and a broken client stream is separate from the run’s actual state.",
      },
      {
        title: "Editing & asynchronous recovery",
        implementation:
          "Transcript-driven clip edits, timeline state, rendering recovery, worker-claim handling, and frontend reconciliation.",
        outcome:
          "Editing intent connects to concrete media changes; long-running work converges on a recorded outcome.",
      },
    ],
    stack: [
      {
        boundary: "Application/API",
        tools: "Python · FastAPI · Pydantic",
        responsibility:
          "Typed inputs, workflow services, authorization boundaries",
      },
      {
        boundary: "Agent runtime",
        tools: "Custom tool loop · provider adapters",
        responsibility:
          "Context, structured calls, action policy, observations",
      },
      {
        boundary: "Durable state",
        tools: "PostgreSQL · asyncpg",
        responsibility:
          "Sessions, runs, decisions, jobs, and execution evidence",
      },
      {
        boundary: "Background work",
        tools: "AWS SQS · S3 · workers",
        responsibility:
          "Queue handoff, media artifacts, recovery and reconciliation",
      },
      {
        boundary: "Product interface",
        tools: "Next.js · React · TypeScript · Zustand · SSE",
        responsibility:
          "Streaming chat, action review, editing and state hydration",
      },
    ],
    sources: [
      {
        label: "Public engineering walkthrough",
        url: "https://www.linkedin.com/feed/update/urn:li:activity:7506398595475124224/",
      },
      { label: "Live product", url: "https://lucidream.io/" },
    ],
  },
  {
    id: "askspice",
    name: "AskSpice",
    label: "PRODUCTION SEARCH & RANKING",
    title: "Conversational retrieval over a large media corpus.",
    summary:
      "I implemented the Universal AskSpice endpoint and retrieval flow: query routing, conversation resolution, HyDE expansion, hybrid candidates, rank fusion, source hydration, reranking, and grounded selection.",
    question:
      "How do you turn an ambiguous follow-up into the right timestamped source, while balancing exact terms, semantic relevance, freshness, and diversity?",
    ownership:
      "My implementation areas: universal query routing, clip/episode retrieval, hydration, selection, conversational memory, episode chat, and retrieval-path improvements. Team-built product.",
    flow: [
      "Intent + context",
      "HyDE + hybrid search",
      "Weighted RRF",
      "Hydrate + rerank",
      "Grounded selection",
    ],
    modules: [
      {
        title: "Query planning & conversation",
        implementation:
          "Intent routes, entity continuity, pronoun resolution, topic-change handling, episode chat, and shown-result tracking.",
        outcome:
          "Multi-turn search carries the right context forward and handles a genuine topic shift explicitly.",
      },
      {
        title: "Hybrid candidate generation",
        implementation:
          "Original-query and HyDE representations; dense embeddings plus sparse/BM25 signals; time-aware candidate searches.",
        outcome:
          "Exact names and paraphrases both contribute to recall, with recency treated as an explicit retrieval policy.",
      },
      {
        title: "Multi-stage ranking",
        implementation:
          "Weighted reciprocal-rank fusion, PostgreSQL hydration, configurable Cohere reranking, metadata scoring, and diversity/repeat handling.",
        outcome:
          "The system separates broad recall, query–passage precision, and the final choice of source-backed media.",
      },
      {
        title: "API & latency-path engineering",
        implementation:
          "Python retrieval orchestration integrated with Node/TypeScript conversation APIs, structured state updates, SSE, and reduced framework overhead.",
        outcome:
          "Search behavior stays connected to the product’s conversations and streamed results.",
      },
    ],
    stack: [
      {
        boundary: "API & orchestration",
        tools: "Python · FastAPI · Node.js · Fastify",
        responsibility:
          "Intent routes, persistent product integration and streaming",
      },
      {
        boundary: "Candidate retrieval",
        tools: "OpenAI embeddings · sparse/BM25 · Pinecone",
        responsibility: "Semantic and lexical recall over query/time variants",
      },
      {
        boundary: "Ranking",
        tools: "HyDE · weighted RRF · Cohere",
        responsibility:
          "Query expansion, fusion, reranking and application scoring",
      },
      {
        boundary: "Source grounding",
        tools: "PostgreSQL · transcripts · metadata",
        responsibility: "Hydrate episode, speaker, text and timestamp evidence",
      },
      {
        boundary: "Conversation state",
        tools: "Typed memory · entities · topic threads",
        responsibility: "Follow-up resolution, topic resets and result history",
      },
    ],
    sources: [
      {
        label: "Professional background",
        url: "https://www.linkedin.com/in/sarathgentela/",
      },
      {
        label: "Related public implementation: EchoFind",
        url: "https://github.com/akira231097/echofind",
      },
    ],
  },
];
