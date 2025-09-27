import { CardContent } from "../ui/card";
import { useEffect, useMemo, useState } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { motion, AnimatePresence } from "framer-motion";

const generateDraggables = (items) =>
  items.flatMap((group) =>
    group.items.map((item, index) => ({
      id: `${item}-${index}`,
      label: item,
      correctContainer: group.container,
    }))
  );

function DndQuizMain({
  data,
  setScore,
  colors,
  setItems,
  setCorrectAnswers,
  setWrongAnswers,
  setDroppedItems,
  droppedItems,
}) {
  const [draggables] = useState(generateDraggables(data.items));
  const [correctList, setCorrectList] = useState([]);
  const [wrongList, setWrongList] = useState([]);

  useEffect(() => {
    setItems(draggables.length);
  }, [draggables]);

  useEffect(() => {
    setCorrectAnswers(correctList);
    setWrongAnswers(wrongList);
  }, [correctList, wrongList, setCorrectAnswers, setWrongAnswers]);

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
      setCorrectList((prev) => [...prev, draggedItem]);
      setWrongList((prev) => prev.filter((item) => item.id !== draggedItem.id));
    } else if (!isNowCorrect && wasCorrectBefore) {
      setScore((prev) => prev - 1);
      setWrongList((prev) => [...prev, draggedItem]);
      setCorrectList((prev) =>
        prev.filter((item) => item.id !== draggedItem.id)
      );
    } else if (!wasCorrectBefore && !isNowCorrect) {
      setWrongList((prev) => [...prev, draggedItem]);
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
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-rose-500"
    >
      {label}
    </div>
  );
}

function DroppableZone({ id, label, droppedItems, draggables, colors }) {
  const { isOver, setNodeRef } = useDroppable({ id });

  const itemsHere = Object.entries(droppedItems)
    .filter(([, target]) => target === id)
    .map(([itemId]) => itemId);

  const backgroundColor = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * colors.length);

    return colors[randomIndex];
  }, [id]);

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

export default function DndQuiz(props) {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <CardContent>
      <AnimatePresence>
        {showIntro ? (
          <motion.div
            className="fixed inset-0 bg-black/75 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-xl max-w-2xl text-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h2 className="text-2xl font-bold mb-4">How to Play</h2>
              <p className="mb-4">
                Drag the words into the correct box. If you match them
                correctly, your score increases. Otherwise, try again!
              </p>

              {/* Simple animated demo block */}
              <div className="flex gap-1 pl-2">
                <motion.div
                  className="inline-block bg-rose-500 text-white px-4 py-2 rounded-md mb-6"
                  animate={{ y: [0, 100, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Cat
                </motion.div>
                <motion.div
                  className="inline-block bg-rose-500 text-white px-4 py-2 rounded-md mb-6"
                  animate={{ x: [0, 260, 0], y: [0, 100, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Square
                </motion.div>
              </div>
              <div className="flex gap-x-2 mb-5 h-40">
                <div className="border w-1/2 pl-2">
                  <p className="text-start font-semibold text-neutral-600">Animals</p>
                </div>
                <div className="border w-1/2 pl-2">
                  <p className="text-start font-semibold text-neutral-600">Shapes</p>
                </div>
              </div>

              <button
                className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
                onClick={() => setShowIntro(false)}
              >
                Start Quiz
              </button>
            </motion.div>
          </motion.div>
        ) : (
          <DndQuizMain {...props} />
        )}
      </AnimatePresence>
    </CardContent>
  );
}
