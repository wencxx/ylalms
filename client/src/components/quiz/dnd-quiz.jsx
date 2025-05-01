import { CardContent } from "../ui/card";
import { useMemo, useState } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";

const generateDraggables = (items) =>
  items.flatMap((group) =>
    group.items.map((item, index) => ({
      id: `${item}-${index}`,
      label: item,
      correctContainer: group.container,
    }))
  );

export default function DndQuiz({ data, setScore, colors }) {
  const [draggables] = useState(generateDraggables(data.items));
  const [droppedItems, setDroppedItems] = useState({});

  const [containers, setContainers] = useState(
    data.items.map((item) => item.container)
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || !active) return;

    const draggedItem = draggables.find((d) => d.id === active.id);
    const previousDrop = droppedItems[active.id];
    const isNowCorrect = draggedItem.correctContainer === over.id;
    const wasCorrectBefore = previousDrop === draggedItem.correctContainer;

    if (isNowCorrect && !wasCorrectBefore) {
      setScore((prev) => prev + 1);
    } else if (!isNowCorrect && wasCorrectBefore) {
      setScore((prev) => prev - 1);
    }

    setDroppedItems((prev) => ({
      ...prev,
      [active.id]: over.id,
    }));
  };

  return (
    <CardContent>
      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 flex-wrap mb-6">
          {draggables
            .filter((item) => !(item.id in droppedItems))
            .map((item) => (
              <DraggableItem key={item.id} id={item.id} label={item.label} />
            ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {containers.map((container) => (
            <DroppableZone
              key={container}
              id={container}
              label={container}
              droppedItems={droppedItems}
              draggables={draggables}
              colors={colors}
            />
          ))}
        </div>
      </DndContext>
    </CardContent>
  );
}

function DraggableItem({ id, label }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    padding: "10px 20px",
    color: "white",
    borderRadius: "6px",
    cursor: "grab",
    marginBottom: "10px",
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="bg-rose-500">
      {label}
    </div>
  );
}

function DroppableZone({ id, label, droppedItems, draggables, colors }) {
  const { isOver, setNodeRef } = useDroppable({ id });

  const itemsHere = Object.entries(droppedItems)
    .filter(([, target]) => target === id)
    .map(([itemId]) => itemId);

    const backgroundColor  = useMemo(() => {
        const randomIndex = Math.floor(Math.random() * colors.length)

        return colors[randomIndex]
    }, [id])

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[120px] p-4 border-2 rounded-md transition-colors ${backgroundColor} ${
        isOver ? "border-green-500 bg-green-100" : "border-gray-300"
      }`}
    >
      <h2 className="font-semibold text-lg mb-2">{label}</h2>
      <div className="flex flex-wrap gap-2">
        {itemsHere.map((itemId) => {
          const item = draggables.find((d) => d.id === itemId);
          return (
            item && (
              <DraggableItem key={item.id} id={item.id} label={item.label} />
            )
          );
        })}
      </div>
    </div>
  );
}
