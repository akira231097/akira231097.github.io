/**
 * Technical case data grounded in the inspected public revisions below.
 * Results describe captured offline runs; implementation details are not
 * claims about live provider performance or private production systems.
 */
export type EngineeringCaseId =
  "echofind" | "artha" | "clipopedia" | "commitment" | "reelforge";

export type EngineeringSourceLink = {
  label: string;
  url: string;
};

export type EngineeringStackGroup = {
  boundary: string;
  technologies: string[];
};

export type EngineeringFlowNode = {
  id: string;
  title: string;
  technology: string;
  responsibility: string;
  failureMode: string;
};

export type EngineeringBranch = {
  from: string;
  to: string;
  label: string;
  behavior: string;
};

export type EngineeringDecision = {
  title: string;
  mechanism: string;
  tradeoff: string;
  evidence: EngineeringSourceLink[];
};

export type EngineeringResult = {
  value: string;
  label: string;
  scope: string;
};

export type EngineeringCase = {
  id: EngineeringCaseId;
  title: string;
  subtitle: string;
  role: string;
  stack: EngineeringStackGroup[];
  /** Ordered overview; a node can group adjacent implementation stages. */
  flow: EngineeringFlowNode[];
  /** Conditional paths supplement the main flow, using its node IDs. */
  branches: EngineeringBranch[];
  decisions: EngineeringDecision[];
  results: EngineeringResult[];
  sourceLinks: EngineeringSourceLink[];
  limitations: string[];
};

const revisions = {
  echofind: "8b5a3ab9ecbc491ca290979eeeb2112c2de8c62f",
  "artha-council": "bc3ef17b4ebc4a56004fc098209caa39919500f5",
  clipopedia: "b2cc9d85c38117f5787dc364446f3d6bd500ce71",
  "commitment-decay-engine": "6068ad45bddbe777261a030b0d7618018d629fe7",
  reelforge: "c0d08c8de046901ba429b183e5c849335a25aa34",
} as const;

function source(
  repository: keyof typeof revisions,
  path: string,
  label: string,
): EngineeringSourceLink {
  return {
    label,
    url: `https://github.com/akira231097/${repository}/blob/${revisions[repository]}/${path}`,
  };
}

export const engineeringCases: EngineeringCase[] = [
  {
    id: "echofind",
    title: "EchoFind",
    subtitle:
      "Conversation state, temporal search, and three levels of rank fusion.",
    role: "Independent public implementation: retrieval orchestration, deterministic memory, ranking, and a streaming API.",
    stack: [
      {
        boundary: "Runtime & interface",
        technologies: [
          "Python",
          "FastAPI",
          "Uvicorn",
          "Server-sent events",
          "Pydantic v2",
        ],
      },
      {
        boundary: "Reasoning",
        technologies: [
          "Gemini",
          "Query routing",
          "HyDE expansion",
          "Structured selection",
        ],
      },
      {
        boundary: "Retrieval",
        technologies: [
          "OpenAI text-embedding-3-large",
          "BM25",
          "Pinecone dense + sparse indexes",
          "Cohere rerank via Pinecone",
        ],
      },
      {
        boundary: "State & storage",
        technologies: [
          "PostgreSQL metadata",
          "In-process conversation memory",
          "S3 BM25 model loading",
        ],
      },
      {
        boundary: "Concurrency",
        technologies: [
          "asyncio.gather",
          "Batched embeddings",
          "asyncio.to_thread for synchronous clients",
        ],
      },
    ],
    flow: [
      {
        id: "route",
        title: "Route with conversation context",
        technology: "Gemini router · typed route output",
        responsibility:
          "Choose small talk, episode search, or clip search using recent actions and the current conversation thread.",
        failureMode:
          "A confidence threshold and fallback route handle uncertain classification; branch selection remains model-dependent.",
      },
      {
        id: "analyze",
        title: "Resolve the request",
        technology: "ConversationMemory · gazetteer · HyDE",
        responsibility:
          "Resolve follow-up references, identify people and time constraints, and generate transcript-style query expansions.",
        failureMode:
          "A topic shift replaces thread context; inaccurate entity or time extraction can still steer retrieval incorrectly.",
      },
      {
        id: "embed",
        title: "Embed original and expanded queries",
        technology: "OpenAI dense embeddings · BM25 sparse vectors",
        responsibility:
          "Batch dense embeddings while sparse encoding runs concurrently; rank HyDE weights by cosine similarity to the original query.",
        failureMode:
          "Embedding failure emits an error stage. Missing similarity evidence uses configured fallback HyDE weights.",
      },
      {
        id: "retrieve",
        title: "Search and fuse temporal buckets",
        technology: "Pinecone · weighted reciprocal rank fusion",
        responsibility:
          "Fuse dense/sparse results per query, then query variants, then weighted time buckets; apply episode diversity and recent-result exclusion.",
        failureMode:
          "Recall relaxation is intent-dependent. If fewer than three fresh candidates survive exclusion, shown clips are deprioritized instead.",
      },
      {
        id: "rank",
        title: "Restore sources and rerank",
        technology: "PostgreSQL hydration · Cohere · metadata scoring",
        responsibility:
          "Fetch full transcripts and media metadata, rerank a bounded shortlist, then blend relevance with date, person, and show signals.",
        failureMode:
          "Reranker exceptions fall back to the unreranked shortlist; missing or stale source metadata still limits the final answer.",
      },
      {
        id: "select",
        title: "Select evidence and update memory",
        technology: "Gemini · Pydantic structured output",
        responsibility:
          "Request supporting quotes, the selected clip, answer text, and memory fields together; apply the update through explicit state logic.",
        failureMode:
          "Structured parsing falls back to JSON-object mode and JSON repair; schema repair cannot establish factual correctness.",
      },
      {
        id: "deliver",
        title: "Stream a result and follow-ups",
        technology: "FastAPI SSE · cached follow-up clips",
        responsibility:
          "Expose stage progress and a final media-backed response, with alternative clips prepared for subsequent clicks.",
        failureMode:
          "Session memory lives in one process; a restart or multi-worker deployment needs a durable shared-state design.",
      },
    ],
    branches: [
      {
        from: "route",
        to: "deliver",
        label: "Small talk / episode search",
        behavior:
          "Dedicated handlers bypass the main clip pipeline. Small talk can optionally use search grounding; episode search has its own retrieval path.",
      },
      {
        from: "retrieve",
        to: "deliver",
        label: "No candidates",
        behavior:
          "The agent emits a completed no-results response with no selected chunk instead of fabricating a media match.",
      },
      {
        from: "rank",
        to: "select",
        label: "Reranker unavailable",
        behavior:
          "Selection may continue over the bounded pre-rerank candidates. Availability is preserved with weaker ranking evidence.",
      },
    ],
    decisions: [
      {
        title: "Fuse ranks at three different boundaries",
        mechanism:
          "Dense and sparse lists are fused per query; original and HyDE lists are fused by query weight; time buckets are fused by bucket weight. This avoids comparing raw scores from different searches.",
        tradeoff:
          "Additional searches improve coverage but add provider work and tuning. Rank fusion cannot recover relevant content absent from every candidate list.",
        evidence: [
          source(
            "echofind",
            "retrieval/data_fetcher.py",
            "Dense/sparse and query fusion",
          ),
          source(
            "echofind",
            "engine/agent.py",
            "Time buckets and orchestration",
          ),
        ],
      },
      {
        title: "Keep state transitions outside the language model",
        mechanism:
          "Memory tracks recent turns, compressed history, entities, thread topics, last actions, and a five-turn shown-artifact window. Each consumer receives a tailored context rendering.",
        tradeoff:
          "Explicit state is inspectable and cheap, but the retrieved candidate pool can force repetition; exclusion intentionally relaxes when too few fresh results remain.",
        evidence: [
          source("echofind", "engine/memory.py", "Memory state machine"),
          source("echofind", "engine/agent.py", "Exclusion safety fallback"),
        ],
      },
      {
        title: "Combine selection and memory extraction in one call",
        mechanism:
          "A shared structured response carries supporting quotes, chosen index, answer, and memory update fields. The parser escalates from structured output to JSON mode and targeted repair.",
        tradeoff:
          "One model round trip is removed, but selection and memory quality share a failure boundary. Parsing success is not an accuracy guarantee.",
        evidence: [
          source(
            "echofind",
            "engine/selection.py",
            "SelectionWithMemoryOutput and parser fallbacks",
          ),
        ],
      },
    ],
    results: [
      {
        value: "0.028 ms",
        label: "Memory-update p50",
        scope:
          "Captured local CPU microbenchmark: 3,000 iterations, Python 3.12.14 on Windows. Original memory code; online-client imports bypassed.",
      },
      {
        value: "0.066 ms",
        label: "Memory-update p95",
        scope:
          "Same memory-only run. This excludes models, vector search, database access, and network latency.",
      },
      {
        value: "10 labels",
        label: "Retrieval skeleton validated",
        scope:
          "No live credentials or populated private index were used. The harness emitted no retrieval accuracy metrics.",
      },
    ],
    sourceLinks: [
      source(
        "echofind",
        "engine/agent.py",
        "Agent and temporal retrieval plan",
      ),
      source(
        "echofind",
        "retrieval/search.py",
        "Cohere reranking and constraints",
      ),
      source("echofind", "engine/memory.py", "Memory implementation"),
      source(
        "echofind",
        "engine/selection.py",
        "Combined selection and memory",
      ),
      source(
        "echofind",
        "benchmarks/memory_bench.py",
        "Reproduce the memory benchmark",
      ),
      source(
        "echofind",
        "evals/retrieval_eval.py",
        "Live / skeleton evaluation boundary",
      ),
    ],
    limitations: [
      "End-to-end retrieval needs configured providers, populated Pinecone indexes, and PostgreSQL records; no live search quality was measured here.",
      "In-process sessions, permissive CORS, a debug-memory endpoint, and UI sanitization need hardening before an unrestricted deployment.",
      "The memory sample scripts demonstrate behavior but are not counted as assertion-based tests.",
    ],
  },
  {
    id: "artha",
    title: "Artha Council",
    subtitle:
      "Independent analyst judgment, exact-order receipts, and durable execution state.",
    role: "Independent public system: multi-model research orchestration, MCP interfaces, deterministic broker gates, and reconciliation.",
    stack: [
      {
        boundary: "Runtime & research",
        technologies: [
          "Python 3.12+",
          "pandas",
          "Provider adapters",
          "Fundamental / technical / contrarian analysts",
        ],
      },
      {
        boundary: "Model boundaries",
        technologies: [
          "ChatGPT backend",
          "Gemini",
          "Optional Claude contrarian",
          "CIO synthesis",
        ],
      },
      {
        boundary: "Interface & authorization",
        technologies: [
          "MCP",
          "Local stdio",
          "Streamable HTTP",
          "OAuth/JWT",
          "Capability scopes",
        ],
      },
      {
        boundary: "Execution & contracts",
        technologies: [
          "Pydantic order models",
          "BrokerAdapter interface",
          "SHA-256 order hash",
          "Exact-order preview",
        ],
      },
      {
        boundary: "Persistence",
        technologies: [
          "SQLite WAL",
          "synchronous=FULL",
          "BEGIN IMMEDIATE",
          "Receipts and audit state",
        ],
      },
    ],
    flow: [
      {
        id: "screen",
        title: "Screen and verify candidates",
        technology: "Universe funnel · data-quality checks · broker router",
        responsibility:
          "Narrow the research universe and check quote, liquidity, tradability, and data feasibility before spending Council attention.",
        failureMode:
          "Missing or unusable provider data weakens or blocks promotion; ranking is not permission to submit an order.",
      },
      {
        id: "council",
        title: "Collect independent analyst views",
        technology: "Fundamental · technical · contrarian models",
        responsibility:
          "Give separate prompts and data slices to analysts before the CIO synthesizes a scored recommendation and risk constraints.",
        failureMode:
          "The optional Claude contrarian falls back to Gemini; multiple roles do not always mean three independent model families.",
      },
      {
        id: "proposal",
        title: "Form a constrained action",
        technology: "Execution officer · typed OrderRequest",
        responsibility:
          "Translate research intent into explicit instrument, side, quantity or notional, order type, and side-specific price protection.",
        failureMode:
          "Malformed symbols, non-finite amounts, and missing required price guards are rejected by the order contract.",
      },
      {
        id: "preview",
        title: "Require broker evidence",
        technology: "ExecutionCoordinator · deterministic gates",
        responsibility:
          "Check quote freshness, spread, instrument identity, funds or position proof, price caps, market rules, and per-order limits.",
        failureMode:
          "Missing structured proof produces BLOCKED even when a model recommends buying. A passing preview expires quickly.",
      },
      {
        id: "claim",
        title: "Authorize and claim the receipt",
        technology: "CapabilityPolicy · SQLite WAL · BEGIN IMMEDIATE",
        responsibility:
          "Require trade capability, then atomically check receipt state, expiry, duplicate action IDs, and daily capacity before claiming the exact stored order.",
        failureMode:
          "Expired, reused, altered, or over-capacity receipts cannot proceed. Concurrent claims share the database transaction boundary.",
      },
      {
        id: "submit",
        title: "Recheck before submission",
        technology: "Order hash · broker preview · duplicate lookup",
        responsibility:
          "With the stored order hash checked, verify broker capabilities, repeat the preview, and check existing orders before calling placement.",
        failureMode:
          "A pre-submit failure is blocked. An ambiguous submission exception becomes UNKNOWN and the receipt cannot be reused.",
      },
      {
        id: "reconcile",
        title: "Reconcile against observed orders",
        technology: "Broker order IDs/tags · persistent receipt states",
        responsibility:
          "Match intended actions to broker evidence and record submitted, partial, filled, or unresolved state without blindly repeating a placement.",
        failureMode:
          "Missing or ambiguous broker evidence leaves the outcome unresolved. Live adapters without order-status support cannot place through this path.",
      },
    ],
    branches: [
      {
        from: "preview",
        to: "claim",
        label: "Only a passing receipt advances",
        behavior:
          "Blocked previews remain recorded but cannot be claimed for placement. Broker evidence and local policy both have to permit the exact action.",
      },
      {
        from: "submit",
        to: "reconcile",
        label: "Timeout after submission",
        behavior:
          "The receipt becomes UNKNOWN. Reconciliation searches broker state; the coordinator does not treat a timeout as permission to place again.",
      },
    ],
    decisions: [
      {
        title: "Separate research confidence from execution proof",
        mechanism:
          "The Council scores investment judgment, while a separate coordinator requires explicit instrument, quote, funds/position, and order-preview proof. Public defaults start read-only with the kill switch engaged.",
        tradeoff:
          "Failing closed can reject attractive opportunities when evidence is incomplete. That is preferable to treating model confidence as broker authorization.",
        evidence: [
          source(
            "artha-council",
            "artha_mcp/execution.py",
            "Local execution checks",
          ),
          source("artha-council", "artha_mcp/security.py", "Capability policy"),
          source(
            "artha-council",
            "artha_mcp/settings.py",
            "Public startup defaults",
          ),
        ],
      },
      {
        title: "Persist an immutable order, then claim it atomically",
        mechanism:
          "A receipt stores canonical order JSON, its SHA-256 hash, expiry, and execution state. BEGIN IMMEDIATE serializes receipt claims and daily-capacity checks in the SQLite WAL journal.",
        tradeoff:
          "The state machine adds storage and transaction complexity. It targets one local database boundary rather than claiming distributed exactly-once broker execution.",
        evidence: [
          source(
            "artha-council",
            "artha_mcp/execution.py",
            "Receipt storage, hash checks, and atomic claim",
          ),
          source(
            "artha-council",
            "tests/test_mcp_execution.py",
            "Concurrent-capacity and duplicate tests",
          ),
        ],
      },
      {
        title: "Treat an unknown outcome as a durable state",
        mechanism:
          "After an ambiguous placement exception, the receipt is marked unknown and cannot be claimed again. Reconciliation matches broker order IDs or action tags before changing the state.",
        tradeoff:
          "A missed or unresolved action can require inspection. Automatic retries would be simpler but could duplicate a money-moving order.",
        evidence: [
          source(
            "artha-council",
            "artha_mcp/execution.py",
            "Unknown-state handling and reconciliation",
          ),
          source(
            "artha-council",
            "tests/test_mcp_execution.py",
            "Timeout and no-retry scenarios",
          ),
        ],
      },
      {
        title: "Preserve independent views before synthesis",
        mechanism:
          "Fundamental, technical, and contrarian analysts receive separate prompts; the Council retains their reports and a structured scoring audit before mapping the proposal to an action.",
        tradeoff:
          "Multiple analyses increase model work. Correlated inputs and fallback to the same model family can still produce correlated mistakes.",
        evidence: [
          source(
            "artha-council",
            "artha/analysts.py",
            "Analyst isolation and model fallbacks",
          ),
          source(
            "artha-council",
            "artha/council.py",
            "CouncilDecision and score-to-action boundary",
          ),
        ],
      },
    ],
    results: [
      {
        value: "29",
        label: "Execution / contract tests passed",
        scope:
          "Original focused suite with FakeBroker. A Windows-only wrapper collected SQLite handles before existing test teardown; no assertions changed.",
      },
      {
        value: "4 paths",
        label: "Saved coordinator outcomes",
        scope:
          "Valid preview, stale quote, missing funds proof, and ambiguous submission were executed with synthetic broker fixtures.",
      },
      {
        value: "1 call",
        label: "Ambiguous fake submission",
        scope:
          "The timeout fixture made one fake placement call; a second attempt was rejected. No real broker was connected.",
      },
    ],
    sourceLinks: [
      source("artha-council", "artha/funnel.py", "Universe promotion funnel"),
      source("artha-council", "artha/council.py", "Council and scoring audit"),
      source(
        "artha-council",
        "artha_mcp/models.py",
        "Typed order and broker contracts",
      ),
      source(
        "artha-council",
        "artha_mcp/execution.py",
        "Preview, claim, placement, reconciliation",
      ),
      source(
        "artha-council",
        "tests/test_mcp_execution.py",
        "Executed safety-boundary tests",
      ),
      source("artha-council", "docs/PUBLIC_RELEASE.md", "Public data boundary"),
    ],
    limitations: [
      "No investment returns, real portfolio history, production trade volume, or full live research run was measured for this portfolio.",
      "The direct Windows test run hit SQLite cleanup errors; all 29 focused tests passed only after the documented garbage-collection teardown wrapper.",
      "Broker capabilities, provider data, permissions, and market-specific constraints must be configured separately; public defaults cannot place live trades.",
    ],
  },
  {
    id: "clipopedia",
    title: "Clipopedia",
    subtitle:
      "One retrieval pipeline, replaceable providers, and a repeatable offline evaluation.",
    role: "Independent reference implementation: service protocols, a LangGraph worker, hybrid retrieval, deterministic adapters, and evaluation.",
    stack: [
      {
        boundary: "Runtime & contracts",
        technologies: [
          "Python",
          "asyncio",
          "Pydantic v2",
          "typing.Protocol",
          "pydantic-settings",
        ],
      },
      {
        boundary: "Orchestration",
        technologies: [
          "LangGraph StateGraph",
          "Poll → graph → acknowledge worker",
          "Provider-call throttling",
        ],
      },
      {
        boundary: "Live retrieval",
        technologies: [
          "OpenAI embeddings",
          "BM25 / pinecone-text",
          "Pinecone dotproduct hybrid index",
          "Cohere reranker",
          "Gemini selector",
        ],
      },
      {
        boundary: "Storage & delivery",
        technologies: [
          "PostgreSQL / psycopg",
          "AWS SQS",
          "AWS S3",
          "Tweepy / X adapter",
        ],
      },
      {
        boundary: "Offline boundary",
        technologies: [
          "Hash embedder",
          "In-memory vector store",
          "Jaccard reranker",
          "Rule-based model",
          "pytest",
        ],
      },
    ],
    flow: [
      {
        id: "context",
        title: "Receive a query or mention",
        technology: "Offline CLI · LangGraph context node · vision port",
        responsibility:
          "The live worker combines mention and post/image context; the offline CLI accepts plain query text before the same retrieval analysis.",
        failureMode:
          "The live vision adapter supports still images; video and GIF inputs are skipped rather than sent as unsupported media.",
      },
      {
        id: "analyze",
        title: "Extract intent, entities, and expansions",
        technology: "LanguageModel protocol · fuzzy gazetteer",
        responsibility:
          "Create typed query analysis with canonical guest/show names, time intent, and hypothetical transcript documents for search.",
        failureMode:
          "Bad entity constraints can remove relevant clips; small-talk requests return without running the retrieval pipeline.",
      },
      {
        id: "search",
        title: "Search query variants by time bucket",
        technology: "Dense + sparse ports · Pinecone hybrid query",
        responsibility:
          "Embed original and HyDE text concurrently, weight expansions by similarity, and search each planned temporal bucket in parallel.",
        failureMode:
          "An empty entity-filtered result triggers unfiltered safety recall; it broadens coverage while weakening the original entity restriction.",
      },
      {
        id: "fuse",
        title: "Fuse lists and control concentration",
        technology: "Weighted RRF · episode cap · bucket quota",
        responsibility:
          "Fuse query-variant rankings, then temporal buckets; limit episode concentration and preserve representation from time-search buckets.",
        failureMode:
          "Bucket quotas can reintroduce capped items. Diversity constraints are configurable heuristics rather than relevance guarantees.",
      },
      {
        id: "rank",
        title: "Hydrate, rerank, and score",
        technology: "MetadataStore · Cohere/Jaccard reranker",
        responsibility:
          "Restore full Clip records, drop clips at or above ten minutes, rerank transcripts, then apply recency and metadata boosts.",
        failureMode:
          "Missing metadata rows are skipped. The relevance floor retains a configured minimum, so weak candidates can remain in thin result sets.",
      },
      {
        id: "select",
        title: "Choose a single supported clip",
        technology: "LanguageModel selector · typed ClipSelection",
        responsibility:
          "Select from the ranked candidates with a rationale, then prepare a reply carrying the chosen media reference.",
        failureMode:
          "The selector cannot compensate for a missing relevant candidate; the synthetic pricing query demonstrates a real first-choice miss.",
      },
      {
        id: "publish",
        title: "Publish before acknowledging",
        technology: "SocialClient port · SQS message source",
        responsibility:
          "The worker checks PublishResult.success before acknowledging the inbound mention, preserving work across transient delivery failures.",
        failureMode:
          "Failed publication leaves the mention queued. This policy alone does not prove duplicate-free delivery after every possible crash.",
      },
    ],
    branches: [
      {
        from: "analyze",
        to: "publish",
        label: "Small talk",
        behavior:
          "A small-talk node prepares a conversational response and goes directly to publication without clip retrieval.",
      },
      {
        from: "fuse",
        to: "rank",
        label: "Empty filtered shortlist",
        behavior:
          "After fusion returns nothing for an entity-filtered query, safety recall directly searches the original query without metadata filters, then hydrates those candidates as safety_recall.",
      },
      {
        from: "context",
        to: "analyze",
        label: "Offline direct entry",
        behavior:
          "The CLI and evaluation enter the same analyze → retrieve → select pipeline with deterministic adapters. They bypass the live LangGraph wrapper and stop before real publication.",
      },
    ],
    decisions: [
      {
        title: "Depend on protocols, compose providers at the edge",
        mechanism:
          "Embedder, SparseEncoder, VectorStore, MetadataStore, Reranker, and LanguageModel are Protocol ports. The factory chooses live or deterministic adapters without changing retrieval code.",
        tradeoff:
          "The offline path exercises real orchestration, but substitute model behavior cannot validate real embeddings, provider reliability, or production relevance.",
        evidence: [
          source("clipopedia", "src/clipopedia/ports.py", "Provider protocols"),
          source("clipopedia", "src/clipopedia/factory.py", "Composition root"),
          source(
            "clipopedia",
            "src/clipopedia/adapters/memory.py",
            "Deterministic adapters",
          ),
        ],
      },
      {
        title: "Keep vector blending distinct from rank fusion",
        mechanism:
          "The live Pinecone adapter scales dense vectors by alpha and sparse values by 1−alpha in one hybrid index. Weighted RRF then combines query variants and time buckets by rank.",
        tradeoff:
          "Alpha, expansion weights, and bucket weights tune different boundaries. More knobs create useful control but require evaluation rather than intuition.",
        evidence: [
          source(
            "clipopedia",
            "src/clipopedia/adapters/pinecone_store.py",
            "Dense/sparse scaling",
          ),
          source(
            "clipopedia",
            "src/clipopedia/retrieval/fusion.py",
            "Weighted reciprocal rank fusion",
          ),
          source(
            "clipopedia",
            "src/clipopedia/retrieval/hyde.py",
            "Cosine-ranked expansion weights",
          ),
        ],
      },
      {
        title: "Give recency its own search path",
        mechanism:
          "Latest queries build recency-first, recent-semantic, and broad-backstop buckets. Strict on/between ranges remain in-range; soft before/after queries keep a lower-weight global backstop.",
        tradeoff:
          "Freshness and coverage become explicit, but a broad backstop can admit older results and fusion may still select a less useful clip.",
        evidence: [
          source(
            "clipopedia",
            "src/clipopedia/retrieval/time_planning.py",
            "Time-bucket policy",
          ),
          source(
            "clipopedia",
            "src/clipopedia/retrieval/scoring.py",
            "Post-retrieval boosts and floors",
          ),
        ],
      },
      {
        title: "Measure the architecture without inventing production results",
        mechanism:
          "The evaluation runs the original pipeline over 14 labeled questions and 14 fictional clips, reporting retrieval, selection, and local latency independently of live providers.",
        tradeoff:
          "The benchmark is small and synthetic. It is useful for regression visibility; its 13/14 first selections are not a production accuracy claim.",
        evidence: [
          source(
            "clipopedia",
            "evals/retrieval_eval.py",
            "Labels and evaluation metrics",
          ),
          source("clipopedia", "tests/test_pipeline.py", "Pipeline assertions"),
        ],
      },
    ],
    results: [
      {
        value: "34",
        label: "Original tests passed",
        scope:
          "Unmodified offline pytest suite covering fusion, weighting, time plans, scoring, entity matching, nodes, and pipeline behavior.",
      },
      {
        value: "13 / 14",
        label: "Relevant first selections",
        scope:
          "Fictional 14-clip corpus with deterministic models. The startup-pricing query selected a fundraising clip and remains a documented miss.",
      },
      {
        value: "0.964",
        label: "Mean reciprocal rank",
        scope:
          "Same 14 labeled offline queries; Hit@3 and Recall@5 were 1.000. No live service accuracy or latency is implied.",
      },
    ],
    sourceLinks: [
      source(
        "clipopedia",
        "src/clipopedia/retrieval/pipeline.py",
        "Complete retrieval pipeline",
      ),
      source(
        "clipopedia",
        "src/clipopedia/ports.py",
        "Ports and provider contracts",
      ),
      source(
        "clipopedia",
        "src/clipopedia/orchestration/graph.py",
        "LangGraph state machine",
      ),
      source(
        "clipopedia",
        "src/clipopedia/bot.py",
        "Publish-before-acknowledge worker",
      ),
      source(
        "clipopedia",
        "src/clipopedia/demo/corpus.py",
        "Fictional demo corpus",
      ),
      source(
        "clipopedia",
        "evals/retrieval_eval.py",
        "Reproduce the offline evaluation",
      ),
    ],
    limitations: [
      "The offline CLI does not execute live LangGraph/provider infrastructure; all saved relevance numbers use deterministic stand-ins and a small fictional corpus.",
      "Live operation requires a populated hybrid index, PostgreSQL clips, media storage, and an upstream mention producer outside this repository.",
      "A successful offline run does not establish social-delivery idempotency, production quality, or operational scale.",
    ],
  },
  {
    id: "commitment",
    title: "Commitment Decay Engine",
    subtitle:
      "A transparent text-to-ledger pipeline with evidence-aware status changes.",
    role: "Independent local workflow: extraction, markdown persistence, evidence matching, nudge policy, and CLI reporting.",
    stack: [
      {
        boundary: "Runtime & interface",
        technologies: ["Python 3.11+", "argparse CLI", "JSON input/output"],
      },
      {
        boundary: "Domain contracts",
        technologies: [
          "Dataclasses",
          "CommitmentStatus enum",
          "Commitment / EvidenceItem records",
        ],
      },
      {
        boundary: "Extraction",
        technologies: [
          "Speaker-line regex",
          "First-person intent patterns",
          "Coarse deadline parsing",
        ],
      },
      {
        boundary: "Persistence",
        technologies: [
          "One markdown file per commitment",
          "Slug identifiers",
          "Regex field parsing",
        ],
      },
      {
        boundary: "Policy & checks",
        technologies: [
          "Term/actor evidence scoring",
          "Completion-language rules",
          "Pure nudge policy",
          "pytest",
        ],
      },
    ],
    flow: [
      {
        id: "ingest",
        title: "Read speaker-labeled text",
        technology: "Local transcript · CLI date/source arguments",
        responsibility:
          "Supply meeting context and lines in Name: utterance format, keeping the original commitment text available for inspection.",
        failureMode:
          "Unrecognized speaker-line formats are skipped; there is no speech-to-text or live workplace ingestion in the public core.",
      },
      {
        id: "extract",
        title: "Extract explicit future intent",
        technology: "Regex patterns · Commitment dataclass",
        responsibility:
          "Keep first-person promises such as I will or Let me; reject hints such as we should or I already.",
        failureMode:
          "The conservative pattern set misses indirect commitments. Deadlines remain coarse text rather than a complete scheduling model.",
      },
      {
        id: "ledger",
        title: "Write an inspectable record",
        technology: "MarkdownLedger · date/person/title slug",
        responsibility:
          "Store owner, source, original wording, deadline, status, keywords, evidence, and follow-up dates in a self-contained markdown file.",
        failureMode:
          "Slug-based overwrite is simple but not transactional; colliding titles or concurrent writes need stronger identity and storage handling.",
      },
      {
        id: "reconcile",
        title: "Separate progress from completion",
        technology: "Keyword/title overlap · actor boost · completion hints",
        responsibility:
          "Select evidence scoring at least two, add an actor-match boost, and mark Fulfilled only if that evidence contains completion language.",
        failureMode:
          "Actor match alone can meet the threshold. Substring and completion-word matching are not semantic proof of the intended task.",
      },
      {
        id: "nudge",
        title: "Apply a bounded follow-up policy",
        technology: "Pure evaluate_nudge function",
        responsibility:
          "For unmatched open commitments, check minimum age, maximum count, and whether a nudge was already recorded today.",
        failureMode:
          "The CLI records eligibility/counts locally; a transport adapter and delivery guarantees would be separate integration work.",
      },
      {
        id: "report",
        title: "Summarize outstanding work",
        technology: "Counter aggregation · JSON report",
        responsibility:
          "Return status totals, per-person fulfillment counts/rates, and open items while preserving the underlying inspectable ledger.",
        failureMode:
          "Reports reflect local records and heuristic matching, not independently verified organizational outcomes.",
      },
    ],
    branches: [
      {
        from: "extract",
        to: "report",
        label: "Suggestion or past action",
        behavior:
          "The bundled we-should suggestion and already-fixed update create no commitment record; only three of five input lines are extracted.",
      },
      {
        from: "reconcile",
        to: "report",
        label: "Completion or progress evidence matched",
        behavior:
          "Both cases persist the evidence. Completion becomes Fulfilled; progress remains Open. The CLI does not nudge a record with matched evidence.",
      },
      {
        from: "reconcile",
        to: "nudge",
        label: "No related evidence",
        behavior:
          "An unmatched open record enters the age/count/daily-limit policy; the generated message is not automatically sent to a real person.",
      },
    ],
    decisions: [
      {
        title: "Make extraction conservative and replaceable",
        mechanism:
          "A small explicit pattern set produces Commitment dataclasses. The ledger and policy consume the dataclass, allowing a future extractor to change without rewriting the rest of the workflow.",
        tradeoff:
          "Regex extraction is predictable and credential-free but sacrifices linguistic coverage. The public version does not claim an LLM extractor.",
        evidence: [
          source(
            "commitment-decay-engine",
            "commitment_decay_engine/extractor.py",
            "Intent patterns and exclusions",
          ),
          source(
            "commitment-decay-engine",
            "commitment_decay_engine/models.py",
            "Domain contracts",
          ),
        ],
      },
      {
        title: "Store the evidence alongside the status",
        mechanism:
          "Reconciliation records the best matched update and its source/date. Completion words can fulfill a record; a progress match remains open with a progress-evidence explanation.",
        tradeoff:
          "The rule is auditable but coarse: same-person evidence and overlapping terms can still misassociate updates. Human review remains valuable.",
        evidence: [
          source(
            "commitment-decay-engine",
            "commitment_decay_engine/reconcile.py",
            "Matching and state transition rules",
          ),
          source(
            "commitment-decay-engine",
            "tests/test_reconcile.py",
            "Completion, progress, and weak-match tests",
          ),
        ],
      },
      {
        title: "Prefer inspectable local state over early infrastructure",
        mechanism:
          "Each date/person/title slug maps to one markdown document. Render/parse functions preserve domain fields, and a round-trip test checks the storage contract.",
        tradeoff:
          "Files are easy to inspect and diff, but there is no database transaction, distributed lock, or collision-resistant identifier.",
        evidence: [
          source(
            "commitment-decay-engine",
            "commitment_decay_engine/ledger.py",
            "Markdown render / parse boundary",
          ),
          source(
            "commitment-decay-engine",
            "tests/test_ledger.py",
            "Ledger round-trip test",
          ),
        ],
      },
      {
        title: "Encode restraint in the nudge policy",
        mechanism:
          "Default rules require an open commitment at least two days old, allow at most three nudges, and prevent a second nudge on the same day. Wording becomes a gentle final check-in.",
        tradeoff:
          "Policy evaluation is deliberately separate from sending. Delivery tracking and real workspace integrations are not implemented by this local core.",
        evidence: [
          source(
            "commitment-decay-engine",
            "commitment_decay_engine/nudges.py",
            "Eligibility and message policy",
          ),
          source(
            "commitment-decay-engine",
            "commitment_decay_engine/cli.py",
            "Local reconciliation and nudge counting",
          ),
        ],
      },
    ],
    results: [
      {
        value: "5",
        label: "Original tests passed",
        scope:
          "Unmodified local pytest tests for extraction, markdown round-trip, reconciliation, and nudge policy.",
      },
      {
        value: "3 / 5",
        label: "Input lines became commitments",
        scope:
          "Bundled fictional transcript: Maya’s onboarding rewrite, Ava’s API rate-limit work, and Liam’s stale-search investigation.",
      },
      {
        value: "1 + 2",
        label: "Fulfilled + open records",
        scope:
          "Maya’s completion evidence fulfills the rewrite; Ava’s progress and Liam’s missing evidence leave their records open. No messages were sent.",
      },
    ],
    sourceLinks: [
      source(
        "commitment-decay-engine",
        "commitment_decay_engine/extractor.py",
        "Deterministic extractor",
      ),
      source(
        "commitment-decay-engine",
        "commitment_decay_engine/ledger.py",
        "Markdown persistence",
      ),
      source(
        "commitment-decay-engine",
        "commitment_decay_engine/reconcile.py",
        "Evidence matching and status reconciliation",
      ),
      source(
        "commitment-decay-engine",
        "commitment_decay_engine/nudges.py",
        "Nudge policy",
      ),
      source(
        "commitment-decay-engine",
        "examples/sample_transcript.txt",
        "Original fictional transcript",
      ),
      source(
        "commitment-decay-engine",
        "examples/sample_evidence.json",
        "Original fictional evidence",
      ),
    ],
    limitations: [
      "The extractor is regex-based, evidence scoring is lexical, and deadlines are coarse strings; ambiguous natural language is not fully resolved.",
      "The repository contains local inputs and fictional fixtures, not live Slack, Linear, GitHub, Jira, or Notion integrations.",
      "The three-record demo establishes implemented behavior, not measured productivity gains or organization-wide adoption.",
    ],
  },
  {
    id: "reelforge",
    title: "ReelForge",
    subtitle:
      "Typed edit plans connected to timing, framing, compositing, and audio operations.",
    role: "Independent media reference pipeline: model-assisted planning, asset routing, deterministic post-production stages, and component tests.",
    stack: [
      {
        boundary: "Runtime & contracts",
        technologies: [
          "Python",
          "Pydantic v2",
          "ClipData / EnrichedAnalysis / RoutedAsset",
          "CLI stage flags",
        ],
      },
      {
        boundary: "Planning & assets",
        technologies: [
          "Gemini Files API",
          "Three analysis passes",
          "Sora 2 adapter",
          "Pexels stock adapter",
        ],
      },
      {
        boundary: "Framing & typography",
        technologies: [
          "MediaPipe",
          "OpenCV",
          "EMA smoothing",
          "Pillow captions",
        ],
      },
      {
        boundary: "Composition",
        technologies: [
          "MoviePy",
          "Frame-boundary snapping",
          "FFmpeg loudnorm / amix",
          "LUT color grading",
        ],
      },
      {
        boundary: "Music & review",
        technologies: [
          "Freesound",
          "FFmpeg sidechaincompress",
          "Gemini quality evaluator",
          "unittest",
        ],
      },
    ],
    flow: [
      {
        id: "ingest",
        title: "Load video and timed transcript",
        technology: "ClipSource · TranscriptLoader · Pydantic models",
        responsibility:
          "Resolve local media and parse word-level timestamps into typed clip data, preserving text and time ranges for downstream operations.",
        failureMode:
          "Malformed words are skipped and missing transcripts fall back to basic text; a missing source video stops the CLI.",
      },
      {
        id: "plan",
        title: "Plan the edit in three passes",
        technology: "Gemini video upload · structured analysis",
        responsibility:
          "Upload once and reuse the file handle for B-roll segments, zoom events, and emphasis words; snap anchor words to transcript starts.",
        failureMode:
          "Gemini analysis is a required path: missing credentials raises, and no identified segments stops the CLI.",
      },
      {
        id: "route",
        title: "Route each visual requirement",
        technology: "AssetRouter · Sora · Pexels · evaluator",
        responsibility:
          "Choose generated, stock, zoom-only, or text treatment; generated assets can be evaluated and retried before stock fallback.",
        failureMode:
          "Two generation attempts are allowed. Stock retrieval can also fail, leaving no external overlay for that segment.",
      },
      {
        id: "effects",
        title: "Create framing and caption layers",
        technology: "MediaPipe/OpenCV · EMA · Pillow",
        responsibility:
          "Smooth face-center motion for digital zoom and render timed caption chunks with emphasized transcript words.",
        failureMode:
          "Zoom exceptions fall back to the original video; caption exceptions leave the pipeline without the intended caption layer.",
      },
      {
        id: "compose",
        title: "Composite at frame boundaries",
        technology: "MoviePy · round(time × fps) / fps",
        responsibility:
          "Combine the base clip, generated or stock overlays, transitions, and captions using times snapped to the source frame grid.",
        failureMode:
          "The CLI checks whether the output file was actually updated, so a stale existing render is not accepted as a new stitching success.",
      },
      {
        id: "master",
        title: "Master audio, color, and music",
        technology: "FFmpeg · loudnorm · LUT · sidechaincompress",
        responsibility:
          "Normalize voice before mixing effects, apply a color LUT, and duck background music beneath speech with energy-specific settings.",
        failureMode:
          "Optional failures can preserve the prior stage’s output; unavailable music can result in a video without background music.",
      },
      {
        id: "review",
        title: "Produce a quality report",
        technology: "Gemini evaluator · QualityReport",
        responsibility:
          "When configured, score the completed video for caption sync, B-roll relevance, transitions, engagement, audio, and overall quality.",
        failureMode:
          "Without Gemini, the evaluator returns a default passing report with an unavailable-evaluation warning; those scores are not measurements.",
      },
    ],
    branches: [
      {
        from: "route",
        to: "effects",
        label: "Stock or internal effects",
        behavior:
          "Every segment passes through AssetRouter. Rejected generation can fall back to Pexels; zoom/text treatments or unavailable external assets continue without a generated B-roll overlay.",
      },
      {
        from: "effects",
        to: "compose",
        label: "Optional effect unavailable",
        behavior:
          "The CLI can continue with the source video when zoom fails, or with no caption images when caption generation fails.",
      },
    ],
    decisions: [
      {
        title: "Reuse one video upload across narrow planning tasks",
        mechanism:
          "The director uploads a clip once, then reuses its Gemini file handle for segment, zoom, and emphasis passes. Each task requests a separate structured result.",
        tradeoff:
          "Narrow prompts simplify each output shape but still require three model passes. The implemented analysis path remains dependent on Gemini availability.",
        evidence: [
          source(
            "reelforge",
            "reelforge/analysis/director.py",
            "Single upload and three analysis passes",
          ),
          source("reelforge", "reelforge/cli.py", "Required planning call"),
        ],
      },
      {
        title: "Correct model timing with deterministic media rules",
        mechanism:
          "Anchor matching normalizes case/punctuation, finds the nearest identical transcript word within five seconds, and uses its actual start time. Compositing then rounds times onto source frames.",
        tradeoff:
          "The correction reduces loose timestamps but depends on transcript quality; repeated words and missing matches remain ambiguous. No rendered alignment accuracy was measured.",
        evidence: [
          source(
            "reelforge",
            "reelforge/analysis/director.py",
            "Anchor-word timing lookup",
          ),
          source(
            "reelforge",
            "reelforge/compose/stitcher.py",
            "Frame-grid snapping",
          ),
        ],
      },
      {
        title: "Make generation retries and fallback visible",
        mechanism:
          "Per-segment routing records source, evaluation, attempts, and fallback reason. A maximum of two Sora attempts precedes stock fallback; summaries count the chosen asset paths.",
        tradeoff:
          "The reported cost savings are an internal estimate, not billing data. Evaluator unavailability can default to PASS, so the gate is not a verified quality guarantee.",
        evidence: [
          source(
            "reelforge",
            "reelforge/routing/router.py",
            "Retry cap and routing records",
          ),
          source(
            "reelforge",
            "reelforge/quality/evaluator.py",
            "Evaluator fallback behavior",
          ),
        ],
      },
      {
        title: "Preserve speech through the audio-processing order",
        mechanism:
          "Voice normalization precedes sound-effect mixing; amix uses normalize=0. Music ducking splits the voice as a sidechain input so speech drives music attenuation.",
        tradeoff:
          "Fixed levels and energy presets keep the pipeline understandable but still need listening tests across source recordings. Unit checks do not establish final audio quality.",
        evidence: [
          source(
            "reelforge",
            "reelforge/compose/audio.py",
            "Normalization and effects mixing",
          ),
          source(
            "reelforge",
            "reelforge/compose/music.py",
            "Sidechain ducking graph",
          ),
        ],
      },
    ],
    results: [
      {
        value: "15",
        label: "Original tests passed",
        scope:
          "Unmodified unittest suite for ingest, transcript parsing, caption/domain models, emphasis matching, and report formatting.",
      },
      {
        value: "46 words",
        label: "Bundled timed sample",
        scope:
          "The original sample transcript spans 20.92 seconds. Timing data is inspectable; it is not evidence of a generated video.",
      },
      {
        value: "10 stages",
        label: "Implemented CLI workflow",
        scope:
          "Code-level architecture count. Adjacent stages are grouped in this seven-node overview; a full audiovisual render was not run.",
      },
    ],
    sourceLinks: [
      source(
        "reelforge",
        "reelforge/cli.py",
        "Ten-stage CLI and failure handling",
      ),
      source("reelforge", "reelforge/models.py", "Typed media contracts"),
      source(
        "reelforge",
        "reelforge/analysis/director.py",
        "Structured planning and timing",
      ),
      source(
        "reelforge",
        "reelforge/effects/zoom.py",
        "Face tracking and EMA smoothing",
      ),
      source("reelforge", "tests/test_models.py", "Domain-model tests"),
      source("reelforge", "tests/test_ingest.py", "Ingest tests"),
      source(
        "reelforge",
        "reelforge/quality/evaluator.py",
        "Quality-report implementation and caveats",
      ),
    ],
    limitations: [
      "No source video, real reel, live asset-generation run, or audiovisual quality benchmark was produced during portfolio verification.",
      "Gemini analysis is required in the CLI; fallback support is stage-specific, not a fully credential-free rendering promise.",
      "Missing-evaluator defaults and estimated savings must not be presented as measured output quality or actual provider costs.",
    ],
  },
];

export function getEngineeringCase(id: string): EngineeringCase | undefined {
  return engineeringCases.find((project) => project.id === id);
}
