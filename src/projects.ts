export type Project = {
  id: string;
  name: string;
  category: string;
  eyebrow: string;
  tagline: string;
  description: string;
  color: string;
  tags: string[];
  problem: string;
  contribution: string;
  stages: { title: string; detail: string }[];
  decisions: { title: string; detail: string }[];
  evidence: { label: string; detail: string; url: string }[];
  scope: string;
  url: string;
};
const gh = "https://github.com/akira231097/";
export const lucidream: Project = {
  id: "lucidream",
  name: "Lucidream",
  category: "Production",
  eyebrow: "SPICE / LUCIDREAM · TEAM PRODUCT",
  tagline: "From a conversation to content you can use.",
  description:
    "A creator-facing AI product for finding moments, editing clips, and turning long-form media into finished content.",
  color: "green",
  tags: ["Python", "React", "TypeScript", "FastAPI", "Agent workflows"],
  problem:
    "A creator asks for a clip. The assistant has to find useful material, make its proposed changes understandable, and show when the work is actually ready. A convincing chat response alone cannot do that.",
  contribution:
    "I contributed agent action evidence and review, confirmation flows, guided content workflows, precision clip editing, and recovery behavior across the Python backend and React interface.",
  stages: [
    {
      title: "Find a moment",
      detail:
        "Connect a creator’s request to relevant source material, so the next action starts with context.",
    },
    {
      title: "Review the action",
      detail:
        "Make proposed actions and their outcomes understandable. I built action evidence and contributed review and confirmation flows.",
    },
    {
      title: "Refine the clip",
      detail:
        "Give creators precise transcript and clip-editing controls. I contributed editing behavior and the interface around it.",
    },
    {
      title: "Follow the work",
      detail:
        "Keep asynchronous progress and results legible. I worked with teammates on orchestration and recovery when a stream is interrupted.",
    },
  ],
  decisions: [
    {
      title: "“Done” needs evidence",
      detail:
        "The application’s recorded outcome should support what the assistant tells the user.",
    },
    {
      title: "Control belongs in the product",
      detail:
        "A proposed action needs validation and review where appropriate, plus clear controls in the interface.",
    },
    {
      title: "A lost connection is a separate state",
      detail:
        "Long-running work needs understandable recovery behavior, rather than treating every disconnected stream as a failed job.",
    },
  ],
  evidence: [
    {
      label: "Explore the live product",
      detail: "Public product experience and feature presentation.",
      url: "https://lucidream.io/",
    },
    {
      label: "My engineering walkthrough",
      detail:
        "Public LinkedIn post describing my action ledger, review path, and collaboration on recovery.",
      url: "https://www.linkedin.com/feed/update/urn:li:activity:7506398595475124224/",
    },
  ],
  scope:
    "Production contribution within a team-built product. The workflow here is an illustration; the screenshots show the public product presentation. Company source remains private.",
  url: "https://lucidream.io/",
};
export const askspice: Project = {
  id: "askspice",
  name: "AskSpice",
  category: "Production",
  eyebrow: "SPICE · EARLIER PRODUCTION WORK",
  tagline: "A question should lead to the right moment.",
  description:
    "Conversational discovery across podcast episodes, clips, quotes, and transcripts.",
  color: "blue",
  tags: [
    "Conversational retrieval",
    "Python",
    "Transcript processing",
    "Ranking",
  ],
  problem:
    "A useful answer can be hidden inside a long episode. Follow-up questions also depend on what the person already asked, not just the latest search string.",
  contribution:
    "I contributed conversational retrieval, episode-chat behavior, and podcast-content processing, including transcript, speaker, timestamp, and AI-assisted extraction work.",
  stages: [
    {
      title: "Understand",
      detail: "Interpret the current question alongside conversation context.",
    },
    {
      title: "Retrieve",
      detail: "Find potentially useful media records and supporting text.",
    },
    {
      title: "Rank & resolve",
      detail:
        "Choose relevant candidates and connect them to complete episode or clip context.",
    },
    {
      title: "Answer with context",
      detail:
        "Return useful supporting media, or make a lack of suitable results clear.",
    },
  ],
  decisions: [
    {
      title: "Retrieval is a sequence",
      detail:
        "Query understanding, retrieval, ranking, and source hydration each affect whether the final answer is useful.",
    },
    {
      title: "Preserve the moment",
      detail:
        "Speaker and timestamp processing make text actionable as media, rather than just a block of words.",
    },
  ],
  evidence: [
    {
      label: "Professional background",
      detail: "Public account of my retrieval and media-processing work.",
      url: "https://www.linkedin.com/in/sarathgentela/",
    },
    {
      label: "Explore the related public pattern",
      detail:
        "EchoFind is a separate personal implementation of conversational retrieval.",
      url: gh + "echofind/tree/8b5a3ab9ecbc491ca290979eeeb2112c2de8c62f",
    },
  ],
  scope:
    "Team-owned production work. The diagram explains the general retrieval pattern. EchoFind is separate public code, not the AskSpice production codebase.",
  url: "https://thespice.ai/",
};
export const projects: Project[] = [
  {
    id: "echofind",
    name: "EchoFind",
    category: "Retrieval",
    eyebrow: "01 / CONVERSATIONAL SEARCH",
    tagline: "Search that follows the conversation.",
    description:
      "Turn a question—and its follow-ups—into useful podcast evidence.",
    color: "peach",
    tags: ["FastAPI", "SSE", "Hybrid search", "Memory"],
    problem:
      "People ask questions in context. A useful retrieval system must handle follow-ups, exact terms, and paraphrases while connecting answers to source material.",
    contribution:
      "I built a public conversational retrieval project with query routing, hybrid search, ranking, conversation memory, and streaming responses.",
    stages: [
      {
        title: "Question + memory",
        detail:
          "Recent turns, summaries, and remembered facts help retain context across follow-up questions.",
      },
      {
        title: "Search broadly",
        detail:
          "Hybrid retrieval combines meaning-based and lexical search. Hypothetical query expansion can broaden the candidate pool.",
      },
      {
        title: "Rank & hydrate",
        detail:
          "Ranking narrows the shortlist; source hydration restores useful media context.",
      },
      {
        title: "Stream a response",
        detail:
          "FastAPI and server-sent events support progressive responses rather than one opaque wait.",
      },
    ],
    decisions: [
      {
        title: "Memory has a job",
        detail:
          "Keep relevant conversation context while bounding how much history is carried forward.",
      },
      {
        title: "Evaluate the retrieval",
        detail:
          "The repository includes evaluation scaffolding. Its sample mode does not establish a production accuracy score.",
      },
    ],
    evidence: [
      {
        label: "Retrieval implementation",
        detail: "Inspect hybrid search and ranking code.",
        url:
          gh +
          "echofind/blob/8b5a3ab9ecbc491ca290979eeeb2112c2de8c62f/engine/agent.py",
      },
      {
        label: "Source & setup",
        detail: "Run instructions and project structure.",
        url: gh + "echofind/tree/8b5a3ab9ecbc491ca290979eeeb2112c2de8c62f",
      },
    ],
    scope:
      "Independent public project. The portfolio visualization is explanatory; no live model service runs in this website.",
    url: gh + "echofind",
  },
  {
    id: "artha",
    name: "Artha Council",
    category: "Agents",
    eyebrow: "02 / MULTI-MODEL RESEARCH",
    tagline: "Many perspectives. One reviewable decision.",
    description:
      "A research council with an explicit boundary between reasoning and action.",
    color: "lavender",
    tags: ["Multi-model agents", "MCP", "Python", "Audit"],
    problem:
      "A research recommendation is not enough to justify an external action. Evidence, disagreements, constraints, and the resulting state all need to remain inspectable.",
    contribution:
      "I built a multi-model equity research system with distinct analyst roles, proposed decisions, deterministic execution checks, and audit/reconciliation paths.",
    stages: [
      {
        title: "Gather evidence",
        detail:
          "Research starts with data and candidate screening, preserving the distinction between source facts and model judgment.",
      },
      {
        title: "Convene the council",
        detail:
          "Separate analyst perspectives examine a candidate before a proposed decision is formed.",
      },
      {
        title: "Check the proposal",
        detail:
          "Deterministic gates check proposed actions before a configured execution adapter can act.",
      },
      {
        title: "Reconcile outcomes",
        detail:
          "Audit records connect intended actions with observed state. Research and execution remain separate responsibilities.",
      },
    ],
    decisions: [
      {
        title: "Judgment is not authorization",
        detail:
          "Model output proposes a decision; executable checks constrain what can actually happen.",
      },
      {
        title: "Keep the reasoning inspectable",
        detail:
          "Distinct roles and audit records make it possible to revisit how a decision was reached.",
      },
    ],
    evidence: [
      {
        label: "Design walkthrough",
        detail: "Public research, council, execution, and audit boundaries.",
        url:
          gh +
          "artha-council/blob/bc3ef17b4ebc4a56004fc098209caa39919500f5/docs/DESIGN.md",
      },
      {
        label: "Source & safety defaults",
        detail: "Inspect the implementation and public configuration.",
        url: gh + "artha-council/tree/bc3ef17b4ebc4a56004fc098209caa39919500f5",
      },
    ],
    scope:
      "Independent research software. Public defaults cannot place live trades. See the evidence record for test scope.",
    url: gh + "artha-council",
  },
  {
    id: "clipopedia",
    name: "Clipopedia",
    category: "Retrieval",
    eyebrow: "03 / TESTABLE RAG",
    tagline: "The right clip, with a traceable path.",
    description:
      "A graph-based retrieval workflow you can run entirely offline.",
    color: "blue",
    tags: ["LangGraph", "Hybrid RAG", "Ports & adapters"],
    problem:
      "Retrieval pipelines are hard to improve when provider calls and application logic are tightly coupled. Each stage needs to be inspectable and testable.",
    contribution:
      "I built a LangGraph workflow with explicit service interfaces, hybrid retrieval, rank fusion, reranking, and deterministic offline adapters.",
    stages: [
      {
        title: "Interpret the question",
        detail: "Resolve query intent, entities, and context before searching.",
      },
      {
        title: "Retrieve candidates",
        detail:
          "Dense and sparse signals plus hypothetical expansion produce a wider candidate set.",
      },
      {
        title: "Fuse & rerank",
        detail:
          "Rank fusion combines result lists; a reranking stage focuses on relevant passages.",
      },
      {
        title: "Select a clip",
        detail:
          "The selection stage chooses a supported result. Offline fakes allow the entire path to run without API keys.",
      },
    ],
    decisions: [
      {
        title: "Replace providers, keep the pipeline",
        detail:
          "Ports and adapters separate external services from the workflow itself.",
      },
      {
        title: "Make evaluation reproducible",
        detail:
          "A small labeled synthetic corpus makes offline results reproducible without suggesting production performance.",
      },
    ],
    evidence: [
      {
        label: "Design & architecture",
        detail: "Read the workflow design and provider boundaries.",
        url:
          gh +
          "clipopedia/blob/b2cc9d85c38117f5787dc364446f3d6bd500ce71/docs/DESIGN.md",
      },
      {
        label: "Reproduce the evaluation",
        detail:
          "14 synthetic clips / 14 labeled queries; deterministic stand-ins.",
        url:
          gh +
          "clipopedia/blob/b2cc9d85c38117f5787dc364446f3d6bd500ce71/evals/retrieval_eval.py",
      },
    ],
    scope:
      "Independent reference implementation. The measured demo uses synthetic data and deterministic model substitutes; it is not a live production benchmark.",
    url: gh + "clipopedia",
  },
  {
    id: "commitment",
    name: "Commitment Decay Engine",
    category: "Workflow",
    eyebrow: "04 / EVIDENCE & ACCOUNTABILITY",
    tagline: "A promise becomes a record.",
    description:
      "Turn meeting text into commitments and check what actually happened.",
    color: "lime",
    tags: ["Python", "Local-first", "Evidence matching"],
    problem:
      "Commitments disappear into meeting notes, while later updates may or may not prove completion. A useful tracker needs conservative extraction and explicit evidence.",
    contribution:
      "I built a local text-to-ledger workflow with commitment extraction, deterministic evidence matching, status reconciliation, and nudge generation.",
    stages: [
      {
        title: "Read local text",
        detail:
          "Start from local meeting and update files, without relying on live workplace integrations.",
      },
      {
        title: "Extract commitments",
        detail:
          "Capture concrete promises with enough context to identify what someone intended to do.",
      },
      {
        title: "Match evidence",
        detail:
          "Check updates against the commitment rather than treating a similar sentence as automatic completion.",
      },
      {
        title: "Update the ledger",
        detail:
          "Record fulfilled or open status and generate a nudge where follow-up is appropriate.",
      },
    ],
    decisions: [
      {
        title: "Conservative by design",
        detail:
          "An uncertain match should remain reviewable, rather than silently closing a commitment.",
      },
      {
        title: "A small, runnable example",
        detail:
          "The bundled demo extracts three commitments and reconciles one fulfilled and two open.",
      },
    ],
    evidence: [
      {
        label: "Source & local demo",
        detail: "Inspect extraction, ledger, and evidence reconciliation.",
        url:
          gh +
          "commitment-decay-engine/tree/6068ad45bddbe777261a030b0d7618018d629fe7",
      },
      {
        label: "Verified local run",
        detail: "Read the portfolio verification record and commands.",
        url: "./evidence.html#commitment",
      },
    ],
    scope:
      "Independent local-file project with runnable extraction, evidence matching, and ledger examples.",
    url: gh + "commitment-decay-engine",
  },
  {
    id: "reelforge",
    name: "ReelForge",
    category: "Media",
    eyebrow: "05 / AI-ASSISTED MEDIA",
    tagline: "Creative intent meets concrete edits.",
    description:
      "A local video workflow that connects model planning to media-processing stages.",
    color: "pink",
    tags: ["Python", "FFmpeg", "Media planning"],
    problem:
      "A creative edit plan only becomes useful when it can be translated into specific, inspectable media operations.",
    contribution:
      "I built a public reference workflow that combines AI-assisted planning with deterministic video post-production stages and quality-check structures.",
    stages: [
      {
        title: "Ingest the source",
        detail:
          "Inspect input media and establish the material available to the editing workflow.",
      },
      {
        title: "Build an edit plan",
        detail:
          "Use transcript and planning stages to describe the intended result.",
      },
      {
        title: "Apply media operations",
        detail:
          "Translate the plan into concrete caption and media-processing behavior.",
      },
      {
        title: "Review the output",
        detail:
          "Quality-check structures provide a place to inspect results and determine what needs revision.",
      },
    ],
    decisions: [
      {
        title: "Keep the plan executable",
        detail:
          "Structured planning helps connect open-ended creative intent to deterministic operations.",
      },
      {
        title: "Test meaningful boundaries",
        detail:
          "Local tests cover ingest, transcript parsing, captions, and domain models. These tests do not establish output video quality.",
      },
    ],
    evidence: [
      {
        label: "Source & workflow",
        detail: "Inspect the local post-production reference implementation.",
        url: gh + "reelforge/tree/c0d08c8de046901ba429b183e5c849335a25aa34",
      },
      {
        label: "Verified local checks",
        detail:
          "15 repository tests passed; no generated-video quality benchmark is claimed.",
        url: "./evidence.html#reelforge",
      },
    ],
    scope:
      "Independent local reference implementation. The evidence record covers component tests; a complete rendered video was not produced during verification.",
    url: gh + "reelforge",
  },
];
// Keep each public case one click away from the saved, reproducible run record.
for (const project of projects) {
  if (
    !project.evidence.some((item) => item.url.startsWith("./evidence.html"))
  ) {
    project.evidence.push({
      label: "Inspect the recorded local run",
      detail:
        "Captured outputs, checked revisions, reproduction commands, and verification scope.",
      url: "./evidence.html#" + project.id,
    });
  }
}
