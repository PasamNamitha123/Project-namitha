import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { useApplications } from "../../hooks/useApplications";
import { useMoveApplication } from "../../hooks/useMoveApplication";

const STATUSES = ["wishlist", "applied", "interview", "offer", "rejected"];

function Card({ app }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: app.id });
  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="card">
      <strong>{app.company}</strong>
      <div>{app.role}</div>
    </div>
  );
}

function Column({ status, apps }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  return (
    <div ref={setNodeRef} className={`column ${isOver ? "over" : ""}`}>
      <h3>{status} ({apps.length})</h3>
      {apps.map((a) => <Card key={a.id} app={a} />)}
    </div>
  );
}

export default function Board() {
  const { data = [] } = useApplications();
  const move = useMoveApplication();

  function onDragEnd({ active, over }) {
    if (!over) return;
    const app = data.find((a) => a.id === active.id);
    if (!app || app.status === over.id) return;
    const target = data.filter((a) => a.status === over.id);
    const position = target.length
      ? Math.max(...target.map((a) => a.position)) + 1000
      : 1000;
    move.mutate({ id: app.id, status: over.id, position });
  }

  return (
    <DndContext onDragEnd={onDragEnd}>
      <div className="board">
        {STATUSES.map((s) => (
          <Column key={s} status={s}
            apps={data.filter((a) => a.status === s).sort((a, b) => a.position - b.position)} />
        ))}
      </div>
    </DndContext>
  );
}