import { useState, useEffect, useRef } from "react";
import { CardContent } from "../ui/card";
import { motion, AnimatePresence } from "framer-motion";

function MatchingQuizMain({
  data,
  setScore,
  setItems,
  setCorrectAnswers,
  setWrongAnswers,
}) {
  const [leftItems, setLeftItems] = useState([]);
  const [rightItems, setRightItems] = useState([]);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [pairings, setPairings] = useState([]);
  const [correctMatches, setCorrectMatches] = useState([]);
  const [wrongMatches, setWrongMatches] = useState([]);

  const leftRefs = useRef({});
  const rightRefs = useRef({});
  const containerRef = useRef(null);

  useEffect(() => {
    resetGame();
    setItems(data.length);
  }, []);

  useEffect(() => {
    setCorrectAnswers(correctMatches);
    setWrongAnswers(wrongMatches);
  }, [correctMatches, wrongMatches, setCorrectAnswers, setWrongAnswers]);

  // Handle selection of left item
  const handleLeftSelect = (item) => {
    // Don't allow selection of already paired items
    if (pairings.some((pair) => pair.leftId === item.id)) return;

    setSelectedLeft(item);

    // If right is already selected, create a pairing
    if (selectedRight) {
      createPairing(item, selectedRight);
    }
  };

  // Handle selection of right item
  const handleRightSelect = (item) => {
    // Don't allow selection of already paired items
    if (pairings.some((pair) => pair.rightId === item.id)) return;

    setSelectedRight(item);

    // If left is already selected, create a pairing
    if (selectedLeft) {
      createPairing(selectedLeft, item);
    }
  };

  // Create a pairing between any left and right item
  const createPairing = (left, right) => {
    const newPairing = { leftId: left.id, rightId: right.id };
    setPairings((prev) => [...prev, newPairing]);

    if (left.id === right.id) {
      setCorrectMatches((prev) => [
        ...prev,
        { leftId: left.id, rightId: right.id },
      ]);
      setWrongMatches((prev) => prev.filter((pair) => pair.leftId !== left.id));
      setScore(correctMatches.length + 1);
    } else {
      setWrongMatches((prev) => [
        ...prev,
        { leftId: left.id, rightId: right.id },
      ]);
      setCorrectMatches((prev) =>
        prev.filter((pair) => pair.leftId !== left.id)
      );
    }

    // reset/clear selection
    setSelectedLeft(null);
    setSelectedRight(null);
  };

  // Reset the f*cking activity
  const resetGame = () => {
    const shuffledLeft = [...data].sort(() => Math.random() - 0.5);
    const shuffledRight = [...data].sort(() => Math.random() - 0.5);

    setLeftItems(shuffledLeft);
    setRightItems(shuffledRight);
    setSelectedLeft(null);
    setSelectedRight(null);
    setPairings([]);
    setCorrectMatches([]);
  };

  // Set up refs for each item
  const setLeftRef = (id, element) => {
    leftRefs.current[id] = element;
  };

  const setRightRef = (id, element) => {
    rightRefs.current[id] = element;
  };

  // Calculate lines for all pairings
  const renderLines = () => {
    if (!containerRef.current) return null;

    const containerRect = containerRef.current.getBoundingClientRect();

    return pairings.map((pair) => {
      const leftElement = leftRefs.current[pair.leftId];
      const rightElement = rightRefs.current[pair.rightId];

      if (!leftElement || !rightElement) return null;

      const leftRect = leftElement.getBoundingClientRect();
      const rightRect = rightElement.getBoundingClientRect();

      const x1 = leftRect.right - containerRect.left;
      const y1 = leftRect.top + leftRect.height / 2 - containerRect.top;
      const x2 = rightRect.left - containerRect.left;
      const y2 = rightRect.top + rightRect.height / 2 - containerRect.top;

      const lineColor = "#6366F1";

      return (
        <line
          key={`line-${pair.leftId}-${pair.rightId}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={lineColor}
          strokeWidth="3"
        />
      );
    });
  };

  const renderItemContent = (item) => {
    if (item.type === "image") {
      return (
        <img
          src={item.imageUrl}
          alt="quiz-item"
          className="w-16 h-16 object-cover rounded-md border"
        />
      );
    }
    return <span>{item.content}</span>;
  };

  return (
    <CardContent>
      <div
        className="relative flex justify-between h-fit mb-6"
        ref={containerRef}
      >
        {/* Left Column */}
        <div className="flex flex-col gap-4 w-2/5">
          {leftItems.map((item) => (
            <div
              key={`left-${item.id}`}
              ref={(el) => setLeftRef(item.id, el)}
              className={`p-4 rounded-lg flex items-center justify-center text-lg cursor-pointer transition-transform 
                ${
                  pairings.some((pair) => pair.leftId === item.id)
                    ? "bg-purple-100 border-2 border-purple-500"
                    : selectedLeft?.id === item.id
                    ? "bg-red-100 border-2 border-blue-500 shadow-md"
                    : "bg-red-100 shadow"
                }`}
              onClick={() => handleLeftSelect(item)}
            >
              {renderItemContent(item.leftItem)}
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4 w-2/5">
          {rightItems.map((item) => (
            <div
              key={`right-${item.id}`}
              ref={(el) => setRightRef(item.id, el)}
              className={`p-4 rounded-lg flex items-center justify-center font-bold text-lg cursor-pointer transition-transform
                ${
                  pairings.some((pair) => pair.rightId === item.id)
                    ? "bg-purple-100 border-2 border-purple-500"
                    : selectedRight?.id === item.id
                    ? "bg-green-100 border-2 border-blue-500 shadow-md"
                    : "bg-green-100 shadow"
                }`}
              onClick={() => handleRightSelect(item)}
            >
              {renderItemContent(item.rightItem)}
            </div>
          ))}
        </div>

        {/* Lines */}
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
          {renderLines()}
        </svg>
      </div>
    </CardContent>
  );
}

export default function MatchingQuiz(props) {
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
              className="bg-white rounded-2xl p-6 shadow-xl max-w-xl text-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h2 className="text-2xl font-bold mb-4">How to Play</h2>
              <p className="mb-6">
                Select one item from the left column and match it with its pair
                on the right. A line will connect them. Correct matches increase
                your score!
              </p>

              {/* Demo: fake pair with animated line */}
              <div className="flex justify-between relative mb-6 px-6">
                <div className="p-3 bg-red-100 rounded shadow">Apple</div>
                <div className="p-3 bg-green-100 rounded shadow">Fruit</div>

                <motion.svg
                  className="absolute left-0 w-full h-8"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  <motion.line
                    x1="100"
                    y1="20"
                    x2="440"
                    y2="20"
                    stroke="#6366F1"
                    strokeWidth="3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  />
                </motion.svg>
              </div>
              <div className="flex justify-between relative mb-6 px-6">
                <div className="p-3 bg-red-100 rounded shadow">Dog</div>
                <div className="p-3 bg-green-100 rounded shadow">Animal</div>

                <motion.svg
                  className="absolute left-0 w-full h-8"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  <motion.line
                    x1="90"
                    y1="20"
                    x2="425"
                    y2="20"
                    stroke="#6366F1"
                    strokeWidth="3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  />
                </motion.svg>
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
          <MatchingQuizMain {...props} />
        )}
      </AnimatePresence>
    </CardContent>
  );
}
