import { useRef, useEffect, useState } from "react";
import { CardContent } from "../ui/card";

export default function MatchingQuizResult({
  items = [],
  correctAnswers = [],
  wrongAnswers = [],
}) {
  // Combine correct and wrong matches for display
  const allMatches = [
    ...correctAnswers.map((pair) => ({ ...pair, isCorrect: true })),
    ...wrongAnswers.map((pair) => ({ ...pair, isCorrect: false })),
  ];

  // Map id to item text for display
  const leftMap = new Map(items.map((item) => [item.id, item.leftItem]));
  const rightMap = new Map(items.map((item) => [item.id, item.rightItem]));

  // Only show matched items in columns
  const leftMatchedIds = allMatches.map((pair) => pair.leftId);
  const rightMatchedIds = allMatches.map((pair) => pair.rightId);
  const leftItems = items.filter((item) => leftMatchedIds.includes(item.id));
  const rightItems = items.filter((item) => rightMatchedIds.includes(item.id));

  // Refs for DOM nodes
  const leftRefs = useRef({});
  const rightRefs = useRef({});
  const containerRef = useRef(null);
  const [containerRect, setContainerRect] = useState(null);

  useEffect(() => {
    if (containerRef.current) {
      setContainerRect(containerRef.current.getBoundingClientRect());
    }
  }, []);

  // useEffect(() => {
  //   if (containerRef.current) {
  //     setContainerRect(containerRef.current.getBoundingClientRect());
  //   }
  // }, [allMatches, leftItems, rightItems]);

  // Draw lines for each match
  const renderLines = () => {
    if (!containerRect) return null;
    return allMatches.map((pair, idx) => {
      const leftEl = leftRefs.current[pair.leftId];
      const rightEl = rightRefs.current[pair.rightId];
      if (!leftEl || !rightEl) return null;

      const leftRect = leftEl.getBoundingClientRect();
      const rightRect = rightEl.getBoundingClientRect();

      const x1 = leftRect.right - containerRect.left;
      const y1 = leftRect.top + leftRect.height / 2 - containerRect.top;
      const x2 = rightRect.left - containerRect.left;
      const y2 = rightRect.top + rightRect.height / 2 - containerRect.top;

      const lineColor = pair.isCorrect ? "#22c55e" : "#ef4444"; // green/red

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

  return (
    <CardContent>
      <h2 className="font-bold mb-2">Your Matches</h2>
      <div
        className="relative flex justify-between h-fit mb-6"
        ref={containerRef}
      >
        {/* Left column */}
        <div className="flex flex-col gap-4 w-2/5">
          {leftItems.map((item) => {
            const matched = allMatches.find((pair) => pair.leftId === item.id);
            return (
              <div
                key={`left-${item.id}`}
                ref={(el) => (leftRefs.current[item.id] = el)}
                className={`p-4 rounded-lg flex items-center justify-center text-lg transition-transform
                  ${
                    matched
                      ? matched.isCorrect
                        ? "bg-purple-100 border-2 border-green-500"
                        : "bg-purple-100 border-2 border-red-500"
                      : "bg-red-100 shadow"
                  }`}
              >
                {item.leftItem}
              </div>
            );
          })}
        </div>
        {/* Right column */}
        <div className="flex flex-col gap-4 w-2/5">
          {rightItems.map((item) => {
            const matched = allMatches.find((pair) => pair.rightId === item.id);
            return (
              <div
                key={`right-${item.id}`}
                ref={(el) => (rightRefs.current[item.id] = el)}
                className={`p-4 rounded-lg flex items-center justify-center font-bold text-lg transition-transform
                  ${
                    matched
                      ? matched.isCorrect
                        ? "bg-green-100 border-2 border-green-500"
                        : "bg-green-100 border-2 border-red-500"
                      : "bg-green-100 shadow"
                  }`}
              >
                {item.rightItem}
              </div>
            );
          })}
        </div>
        {/* Lines */}
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
          {renderLines()}
        </svg>
      </div>
      {allMatches.length === 0 && (
        <div className="text-gray-500">No matches made.</div>
      )}
    </CardContent>
  );
}
