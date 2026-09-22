import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import "./ArchitectureExplorer.css";

export type ArchitectureNode = {
  id: string;
  title: string;
  technology: string;
  detail: string;
  kind?: "interface" | "runtime" | "control" | "storage" | "worker";
  /** Zero-based grid slots. Leave slots empty to make room for branches. */
  column: number;
  row: number;
};

export type ArchitectureEdge = {
  from: string;
  to: string;
  label?: string;
  dashed?: boolean;
};
export type ArchitectureDiagram = {
  id: string;
  title: string;
  subtitle: string;
  scope: string;
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
  lanes?: { row: number; label: string }[];
  notes?: string[];
};

type Point = { x: number; y: number };
type PositionedNode = ArchitectureNode & {
  x: number;
  y: number;
  height: number;
  number: string;
};
type RoutedEdge = ArchitectureEdge & {
  points: Point[];
  path: string;
  labelPoint?: Point;
  index: number;
};
const NODE_WIDTH = 250;
const NODE_HEIGHT = 84;
const COLUMN_GAP = 310;
const nodeKinds = {
  interface: "Interface",
  runtime: "Runtime",
  control: "Control boundary",
  storage: "Persistence",
  worker: "Worker",
};
const pointKey = (point: Point) => `${point.x},${point.y}`;

/** Routes orthogonal connectors through free space, including return edges. */
function routeBetween(
  start: Point,
  end: Point,
  nodes: PositionedNode[],
  width: number,
  height: number,
): Point[] {
  const xs = [
    ...new Set([
      24,
      width - 24,
      start.x,
      end.x,
      ...nodes.flatMap((node) => [
        node.x - 18,
        node.x + NODE_WIDTH / 2,
        node.x + NODE_WIDTH + 18,
      ]),
    ]),
  ].sort((a, b) => a - b);
  const ys = [
    ...new Set([
      18,
      height - 18,
      start.y,
      end.y,
      ...nodes.flatMap((node) => [
        node.y - 18,
        node.y + node.height / 2,
        node.y + node.height + 18,
      ]),
    ]),
  ].sort((a, b) => a - b);
  const obstacles = nodes.map((node) => ({
    left: node.x - 11,
    right: node.x + NODE_WIDTH + 11,
    top: node.y - 11,
    bottom: node.y + node.height + 11,
  }));
  const blocked = (a: Point, b: Point) =>
    obstacles.some((rect) =>
      a.x === b.x
        ? a.x > rect.left &&
          a.x < rect.right &&
          Math.max(a.y, b.y) > rect.top &&
          Math.min(a.y, b.y) < rect.bottom
        : a.y > rect.top &&
          a.y < rect.bottom &&
          Math.max(a.x, b.x) > rect.left &&
          Math.min(a.x, b.x) < rect.right,
    );
  type Candidate = {
    point: Point;
    direction: "x" | "y" | "";
    cost: number;
    path: Point[];
  };
  const queue: Candidate[] = [
    { point: start, direction: "", cost: 0, path: [start] },
  ];
  const best = new Map<string, number>();
  while (queue.length) {
    queue.sort((a, b) => a.cost - b.cost);
    const current = queue.shift()!;
    if (current.point.x === end.x && current.point.y === end.y)
      return current.path;
    const xi = xs.indexOf(current.point.x);
    const yi = ys.indexOf(current.point.y);
    const neighbours = [
      xi > 0 ? { x: xs[xi - 1], y: current.point.y } : null,
      xi < xs.length - 1 ? { x: xs[xi + 1], y: current.point.y } : null,
      yi > 0 ? { x: current.point.x, y: ys[yi - 1] } : null,
      yi < ys.length - 1 ? { x: current.point.x, y: ys[yi + 1] } : null,
    ];
    for (const next of neighbours) {
      if (!next || blocked(current.point, next)) continue;
      const direction = next.x === current.point.x ? "y" : "x";
      const cost =
        current.cost +
        Math.abs(next.x - current.point.x) +
        Math.abs(next.y - current.point.y) +
        (current.direction && current.direction !== direction ? 18 : 0);
      const key = `${pointKey(next)}:${direction}`;
      if ((best.get(key) ?? Infinity) <= cost) continue;
      best.set(key, cost);
      queue.push({
        point: next,
        direction,
        cost,
        path: [...current.path, next],
      });
    }
  }
  return [start, { x: start.x, y: end.y }, end];
}

function simplify(points: Point[]): Point[] {
  return points.filter((point, index) => {
    if (!index || index === points.length - 1) return true;
    const previous = points[index - 1];
    const next = points[index + 1];
    return !(
      (previous.x === point.x && point.x === next.x) ||
      (previous.y === point.y && point.y === next.y)
    );
  });
}

function buildGraph(diagram: ArchitectureDiagram) {
  const maxColumn = Math.max(2, ...diagram.nodes.map((node) => node.column));
  const maxRow = Math.max(1, ...diagram.nodes.map((node) => node.row));
  const nodeHeight = diagram.nodes.some(
    (node) => node.title.length > 27 || node.technology.length > 44,
  )
    ? 110
    : NODE_HEIGHT;
  const rowGap = nodeHeight + 52;
  const width = maxColumn * COLUMN_GAP + 360;
  const height = maxRow * rowGap + nodeHeight + 76;
  const nodes: PositionedNode[] = diagram.nodes.map((node, index) => ({
    ...node,
    x: 55 + node.column * COLUMN_GAP,
    y: 40 + node.row * rowGap,
    height: nodeHeight,
    number: String(index + 1).padStart(2, "0"),
  }));
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const edges: RoutedEdge[] = diagram.edges.flatMap((edge, index) => {
    const from = byId.get(edge.from);
    const to = byId.get(edge.to);
    if (!from || !to) return [];
    let start: Point;
    let startStub: Point;
    let end: Point;
    let endStub: Point;
    if (edge.dashed) {
      // Feedback leaves through a separate port so a return path cannot hide
      // beneath the corresponding request edge.
      start = { x: from.x + NODE_WIDTH / 2, y: from.y };
      end = { x: to.x + NODE_WIDTH / 2, y: to.y };
      startStub = { x: start.x, y: start.y - 18 };
      endStub = { x: end.x, y: end.y - 18 };
    } else if (from.column !== to.column) {
      const forward = to.column > from.column;
      start = {
        x: from.x + (forward ? NODE_WIDTH : 0),
        y: from.y + from.height / 2,
      };
      end = { x: to.x + (forward ? 0 : NODE_WIDTH), y: to.y + to.height / 2 };
      startStub = { x: start.x + (forward ? 18 : -18), y: start.y };
      endStub = { x: end.x + (forward ? -18 : 18), y: end.y };
    } else {
      const down = to.row > from.row;
      start = {
        x: from.x + NODE_WIDTH / 2,
        y: from.y + (down ? from.height : 0),
      };
      end = { x: to.x + NODE_WIDTH / 2, y: to.y + (down ? 0 : to.height) };
      startStub = { x: start.x, y: start.y + (down ? 18 : -18) };
      endStub = { x: end.x, y: end.y + (down ? -18 : 18) };
    }
    const points = simplify([
      start,
      ...routeBetween(startStub, endStub, nodes, width, height),
      end,
    ]);
    const labelWidth = (edge.label?.length ?? 0) * 5.8 + 20;
    const labelSegments = points.slice(1).map((point, i) => ({
      from: points[i],
      to: point,
      length: Math.abs(point.x - points[i].x),
    }));
    const labelSegment = labelSegments
      .filter(
        (segment) =>
          segment.from.y === segment.to.y && segment.length >= labelWidth + 12,
      )
      .sort((a, b) => b.length - a.length)[0];
    const labelPoint = labelSegment
      ? {
          x: (labelSegment.from.x + labelSegment.to.x) / 2,
          y: labelSegment.from.y,
        }
      : undefined;
    return [
      {
        ...edge,
        points,
        path: points
          .map((point, i) => `${i ? "L" : "M"}${point.x} ${point.y}`)
          .join(" "),
        labelPoint,
        index,
      },
    ];
  });
  return { nodes, edges, width, height, maxColumn, rowGap };
}

export default function ArchitectureExplorer({
  diagrams,
}: {
  diagrams: ArchitectureDiagram[];
}) {
  const instance = useId().replace(/:/g, "");
  const [activeId, setActiveId] = useState(diagrams[0]?.id ?? "");
  const diagram = diagrams.find((item) => item.id === activeId) ?? diagrams[0];
  const [selectedId, setSelectedId] = useState(diagram?.nodes[0]?.id ?? "");
  const [canvasWidth, setCanvasWidth] = useState(980);
  const [showRoutes, setShowRoutes] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const canvasHost = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const nodeRefs = useRef(new Map<string, HTMLButtonElement>());
  const graph = useMemo(
    () => (diagram ? buildGraph(diagram) : null),
    [diagram],
  );
  useEffect(() => {
    const element = canvasHost.current;
    if (!element) return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width) setCanvasWidth(width);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [diagram?.id]);
  if (!diagram || !graph) return null;
  const selected =
    graph.nodes.find((node) => node.id === selectedId) ?? graph.nodes[0];
  const compact = canvasWidth < (graph.maxColumn > 2 ? 940 : 740);
  const scale = canvasWidth / graph.width;
  const incident = graph.edges.filter(
    (edge) => edge.from === selected?.id || edge.to === selected?.id,
  );
  const nodeNames = new Map(graph.nodes.map((node) => [node.id, node.title]));
  const kinds = [...new Set(graph.nodes.map((node) => node.kind ?? "runtime"))];
  const switchDiagram = (id: string) => {
    setActiveId(id);
    setSelectedId(diagrams.find((item) => item.id === id)?.nodes[0]?.id ?? "");
    setShowRoutes(false);
    setShowNotes(false);
  };
  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % diagrams.length;
    else if (event.key === "ArrowLeft")
      next = (index - 1 + diagrams.length) % diagrams.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = diagrams.length - 1;
    else return;
    event.preventDefault();
    switchDiagram(diagrams[next].id);
    tabRefs.current[next]?.focus();
  };
  const onNodeKey = (
    event: KeyboardEvent<HTMLButtonElement>,
    node: PositionedNode,
  ) => {
    const direction = {
      ArrowRight: [1, 0],
      ArrowLeft: [-1, 0],
      ArrowDown: [0, 1],
      ArrowUp: [0, -1],
    }[event.key];
    if (!direction) return;
    const [dx, dy] = direction;
    const candidates = graph.nodes.filter((candidate) =>
      dx
        ? (candidate.column - node.column) * dx > 0
        : (candidate.row - node.row) * dy > 0,
    );
    candidates.sort((a, b) => {
      const distance = (candidate: PositionedNode) =>
        Math.abs(candidate.column - node.column) * (dy ? 3 : 1) +
        Math.abs(candidate.row - node.row) * (dx ? 3 : 1);
      return distance(a) - distance(b);
    });
    if (!candidates.length) return;
    event.preventDefault();
    setSelectedId(candidates[0].id);
    nodeRefs.current.get(candidates[0].id)?.focus();
  };
  const nodeButton = (node: PositionedNode, mobile = false) => (
    <button
      key={node.id}
      type="button"
      className={`ax-node ax-kind-${node.kind ?? "runtime"} ${selected?.id === node.id ? "is-selected" : ""}`}
      style={
        mobile
          ? undefined
          : {
              left: node.x,
              top: node.y,
              width: NODE_WIDTH,
              height: node.height,
            }
      }
      aria-pressed={selected?.id === node.id}
      aria-controls={`${instance}-detail`}
      aria-label={`${node.title}. ${node.technology}. ${nodeKinds[node.kind ?? "runtime"]}. Inspect boundary.`}
      ref={(element) => {
        if (element) nodeRefs.current.set(node.id, element);
        else nodeRefs.current.delete(node.id);
      }}
      onClick={() => setSelectedId(node.id)}
      onKeyDown={(event) => onNodeKey(event, node)}
    >
      <span className="ax-node-top">
        <span>{node.number}</span>
        <span>{nodeKinds[node.kind ?? "runtime"]}</span>
        <i aria-hidden="true" />
      </span>
      <strong>{node.title}</strong>
      <small>{node.technology}</small>
    </button>
  );
  return (
    <div className={`architecture-explorer ${compact ? "ax-compact" : ""}`}>
      {diagrams.length > 1 && (
        <div
          className="ax-tabs"
          role="tablist"
          aria-label="System architectures"
        >
          {diagrams.map((item, index) => (
            <button
              key={item.id}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              type="button"
              role="tab"
              id={`${instance}-tab-${item.id}`}
              aria-selected={diagram.id === item.id}
              aria-controls={`${instance}-panel`}
              tabIndex={diagram.id === item.id ? 0 : -1}
              onClick={() => switchDiagram(item.id)}
              onKeyDown={(event) => onTabKey(event, index)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {item.title}
              <span aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
      )}
      <div
        id={`${instance}-panel`}
        role={diagrams.length > 1 ? "tabpanel" : undefined}
        aria-labelledby={
          diagrams.length > 1
            ? `${instance}-tab-${diagram.id}`
            : `${instance}-title`
        }
      >
        <div className="ax-heading">
          <div>
            <span className="ax-eyebrow">
              SYSTEM BOUNDARIES / {graph.nodes.length} COMPONENTS
            </span>
            <h3 id={`${instance}-title`}>{diagram.title}</h3>
            <p>{diagram.subtitle}</p>
          </div>
          <div className="ax-instruction">
            <span aria-hidden="true">⌘</span> Select a component
            <br />
            <span>Inspect its responsibility & connections.</span>
          </div>
        </div>
        <div className="ax-legend">
          {kinds.map((kind) => (
            <span className={`ax-kind-${kind}`} key={kind}>
              <i />
              {nodeKinds[kind]}
            </span>
          ))}
          <span className="ax-legend-return">
            <i />
            Dashed = conditional / feedback path
          </span>
        </div>
        <div className="ax-canvas-host" ref={canvasHost}>
          {!compact ? (
            <div
              className="ax-canvas-viewport"
              style={{ height: graph.height * scale }}
            >
              <div
                className="ax-canvas"
                style={{
                  width: graph.width,
                  height: graph.height,
                  transform: `scale(${scale})`,
                }}
              >
                <svg
                  className="ax-connectors"
                  width={graph.width}
                  height={graph.height}
                  viewBox={`0 0 ${graph.width} ${graph.height}`}
                  role="img"
                  aria-labelledby={`${instance}-svg-title ${instance}-svg-desc`}
                >
                  <title id={`${instance}-svg-title`}>
                    {diagram.title} architecture connections
                  </title>
                  <desc id={`${instance}-svg-desc`}>
                    {graph.edges
                      .map(
                        (edge) =>
                          `${nodeNames.get(edge.from)} to ${nodeNames.get(edge.to)}${edge.label ? `: ${edge.label}` : ""}${edge.dashed ? " (conditional or feedback path)" : ""}`,
                      )
                      .join(". ")}
                    . Select a component button to inspect its boundary.
                  </desc>
                  <defs>
                    <marker
                      id={`${instance}-arrow`}
                      viewBox="0 0 8 8"
                      refX="7"
                      refY="4"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto"
                    >
                      <path
                        d="M1 1L7 4L1 7"
                        fill="none"
                        stroke="context-stroke"
                        strokeWidth="1.2"
                      />
                    </marker>
                    <pattern
                      id={`${instance}-grid`}
                      width="20"
                      height="20"
                      patternUnits="userSpaceOnUse"
                    >
                      <circle cx="1" cy="1" r=".65" fill="#263442" />
                    </pattern>
                  </defs>
                  <rect
                    width="100%"
                    height="100%"
                    fill={`url(#${instance}-grid)`}
                  />
                  {graph.edges.map((edge) => (
                    <g
                      key={`${edge.from}-${edge.to}-${edge.index}`}
                      className={`ax-edge ${incident.includes(edge) ? "is-incident" : ""} ${edge.dashed ? "is-feedback" : ""}`}
                    >
                      <path
                        d={edge.path}
                        markerEnd={`url(#${instance}-arrow)`}
                      />
                      <title>
                        {nodeNames.get(edge.from)} → {nodeNames.get(edge.to)}
                        {edge.label ? ` · ${edge.label}` : ""}
                      </title>
                      {edge.label && edge.labelPoint && (
                        <g
                          className="ax-edge-label"
                          transform={`translate(${edge.labelPoint.x},${edge.labelPoint.y})`}
                        >
                          <rect
                            x={-(edge.label.length * 5.8 + 16) / 2}
                            y="-9"
                            width={edge.label.length * 5.8 + 16}
                            height="18"
                            rx="3"
                          />
                          <text textAnchor="middle" y="3">
                            {edge.label}
                          </text>
                        </g>
                      )}
                    </g>
                  ))}
                  {diagram.lanes?.map((lane) => (
                    <g className="ax-lane" key={`${lane.row}-${lane.label}`}>
                      <line
                        x1="24"
                        x2={graph.width - 24}
                        y1={26 + lane.row * graph.rowGap}
                        y2={26 + lane.row * graph.rowGap}
                      />
                      <rect
                        x="50"
                        y={11 + lane.row * graph.rowGap}
                        width={Math.min(
                          graph.width - 100,
                          lane.label.length * 5.2 + 12,
                        )}
                        height="15"
                        fill="#0b1119"
                      />
                      <text x="55" y={22 + lane.row * graph.rowGap}>
                        {lane.label.toUpperCase()}
                      </text>
                    </g>
                  ))}
                </svg>
                {graph.nodes.map((node) => nodeButton(node))}
              </div>
            </div>
          ) : (
            <div className="ax-mobile-graph">
              <p className="ax-mobile-note">
                Component view{" "}
                <span>Connections remain below each boundary.</span>
              </p>
              {graph.nodes.map((node) => (
                <div className="ax-mobile-unit" key={node.id}>
                  {nodeButton(node, true)}
                  <div className="ax-mobile-connections">
                    {graph.edges
                      .filter((edge) => edge.from === node.id)
                      .map((edge) => (
                        <span
                          key={`${edge.to}-${edge.index}`}
                          className={edge.dashed ? "is-feedback" : ""}
                        >
                          <b aria-hidden="true">{edge.dashed ? "⇢" : "↳"}</b>
                          <strong>{nodeNames.get(edge.to)}</strong>
                          {edge.label && <small>{edge.label}</small>}
                        </span>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {selected && (
          <div
            id={`${instance}-detail`}
            className={`ax-detail ax-kind-${selected.kind ?? "runtime"}`}
            aria-live="polite"
            aria-atomic="true"
          >
            <div className="ax-detail-identity">
              <span className="ax-detail-number">{selected.number}</span>
              <div>
                <span className="ax-eyebrow">
                  {nodeKinds[selected.kind ?? "runtime"]} BOUNDARY
                </span>
                <h4>{selected.title}</h4>
                <span className="ax-detail-tech">{selected.technology}</span>
              </div>
            </div>
            <div className="ax-detail-copy">
              <p>{selected.detail}</p>
              <div className="ax-detail-routes">
                {incident.map((edge) => (
                  <span key={`${edge.from}-${edge.to}-${edge.index}`}>
                    <b>{edge.from === selected.id ? "OUT" : "IN"}</b>
                    {nodeNames.get(
                      edge.from === selected.id ? edge.to : edge.from,
                    )}
                    {edge.label && <em>{edge.label}</em>}
                    {edge.dashed && <i>conditional / feedback</i>}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="ax-footer">
          <p>
            <span aria-hidden="true">↳</span>
            {diagram.scope}
          </p>
          <div>
            <button
              type="button"
              onClick={() => setShowRoutes(!showRoutes)}
              aria-expanded={showRoutes}
              aria-controls={`${instance}-routes`}
            >
              {showRoutes ? "−" : "+"} Connection index
            </button>
            {Boolean(diagram.notes?.length) && (
              <button
                type="button"
                onClick={() => setShowNotes(!showNotes)}
                aria-expanded={showNotes}
                aria-controls={`${instance}-notes`}
              >
                {showNotes ? "−" : "+"} Design notes
              </button>
            )}
          </div>
        </div>
        <div
          id={`${instance}-routes`}
          className="ax-route-index"
          hidden={!showRoutes}
        >
          <h4>Explicit connections</h4>
          <ol>
            {graph.edges.map((edge) => (
              <li key={`${edge.from}-${edge.to}-${edge.index}`}>
                <span>
                  {nodeNames.get(edge.from)} <b aria-hidden="true">→</b>{" "}
                  {nodeNames.get(edge.to)}
                </span>
                <small>
                  {edge.label || "Data / control flow"}
                  {edge.dashed ? " · conditional / feedback path" : ""}
                </small>
              </li>
            ))}
          </ol>
        </div>
        <div id={`${instance}-notes`} className="ax-notes" hidden={!showNotes}>
          <h4>Design notes</h4>
          <ul>
            {diagram.notes?.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
