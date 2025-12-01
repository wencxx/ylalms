import { useEffect, useState } from "react";
import { CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";

function IdentificationQuizMain({
  data,
  setScore,
  setItems,
  setCorrectAnswers,
  setWrongAnswers,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [correctList, setCorrectList] = useState([]);
  const [wrongList, setWrongList] = useState([]);

  const currentItem = data?.items?.[currentIndex];

  useEffect(() => {
    setItems(data.items.length);
  }, []);

  useEffect(() => {
    setCorrectAnswers(correctList);
    setWrongAnswers(wrongList);
  }, [correctList, wrongList, setCorrectAnswers, setWrongAnswers]);

  const handleChoice = (choice, idx) => {
    // Check if previous answer was correct
    const prevIdx = currentItem.choices.findIndex((c) => c === selectedAnswer);
    const prevWasCorrect =
      selectedAnswer !== "" &&
      String(prevIdx) === String(currentItem.correctAnswer);
    const newIsCorrect = String(idx) === String(currentItem.correctAnswer);

    setSelectedAnswer(choice);

    setScore((prev) => {
      let newScore = prev;
      if (prevWasCorrect && !newIsCorrect) {
        newScore -= 1;
      } else if (!prevWasCorrect && newIsCorrect) {
        newScore += 1;
      }
      return newScore;
    });

    if (newIsCorrect) {
      setCorrectList((prev) => {
        // Remove previous wrong if exists
        const filtered = prev.filter((ans) => ans.index !== currentIndex);
        return [
          ...filtered,
          {
            index: currentIndex,
            question: currentItem.question,
            answer: choice,
            correctAnswer: currentItem.choices[currentItem.correctAnswer], // <-- include correct answer
          },
        ];
      });
      setWrongList((prev) => prev.filter((ans) => ans.index !== currentIndex));
    } else {
      setWrongList((prev) => {
        // Remove previous correct if exists
        const filtered = prev.filter((ans) => ans.index !== currentIndex);
        return [
          ...filtered,
          {
            index: currentIndex,
            question: currentItem.question,
            answer: choice,
            correctAnswer: currentItem.choices[currentItem.correctAnswer], // <-- include correct answer
          },
        ];
      });
      setCorrectList((prev) =>
        prev.filter((ans) => ans.index !== currentIndex)
      );
    }
  };

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < data.items.length) {
      setCurrentIndex(nextIndex);
      setSelectedAnswer("");
    }
  };

  return (
    <CardContent className="space-y-4">
      {currentItem ? (
        <>
          <h2 className="text-xl font-bold">
            Question {currentIndex + 1} of {data.items.length}
          </h2>

          {currentItem.imageUrl && (
            <img
              src={currentItem.imageUrl}
              alt="Question image"
              className="w-full max-w-md rounded-lg"
            />
          )}

          <p className="text-lg">{currentItem.question}</p>

          <div className="grid gap-2">
            {currentItem.choices.map((choice, idx) => (
              <Button
                key={idx}
                variant={selectedAnswer === choice ? "default" : "outline"}
                onClick={() => handleChoice(choice, idx)}
              >
                {choice}
              </Button>
            ))}
          </div>
          <Button
            className="mt-4"
            onClick={handleNext}
            disabled={
              selectedAnswer === "" || currentIndex === data.items.length - 1
            }
          >
            Next
          </Button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </CardContent>
  );
}

export default function IdentificationQuiz(props) {
  const [showIntro, setShowIntro] = useState(true);

  // Find a sample image if available
  const sampleImageItem = props.data?.items?.find((item) => item.imageUrl);

  return (
    <CardContent>
      <AnimatePresence>
        {showIntro ? (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
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
                Read the question carefully and select the correct answer from
                the given choices. Your score updates automatically. Click{" "}
                <b>Next</b> to move forward.
              </p>

              {/* Demo animation */}
              <div className="text-left mb-6">
                {sampleImageItem && (
                  <div className="mb-4 flex justify-center">
                    <img
                      src={
                        sampleImageItem.imageUrl.startsWith("http")
                          ? sampleImageItem.imageUrl
                          : `${import.meta.env.VITE_API_URL}/${
                              sampleImageItem.imageUrl
                            }`
                      }
                      alt="demo question"
                      className="h-32 object-contain rounded-md"
                    />
                  </div>
                )}
                <p className="font-semibold mb-4">Which of these is a fruit?</p>
                <div className="space-y-3">
                  {["Carrot 🥕", "Apple 🍎", "Potato 🥔", "Broccoli 🥦"].map(
                    (choice, idx) => (
                      <motion.div
                        key={idx}
                        className="flex items-center gap-3 p-2 border rounded-lg cursor-pointer justify-center"
                        initial={{ backgroundColor: "#ffffff" }}
                        animate={
                          choice.includes("Apple")
                            ? {
                                backgroundColor: [
                                  "#ffffff",
                                  "#86efac",
                                  "#ffffff",
                                ],
                              }
                            : { backgroundColor: "#ffffff" }
                        }
                        transition={
                          choice.includes("Apple")
                            ? { duration: 2, repeat: Infinity }
                            : {}
                        }
                      >
                        <span>{choice}</span>
                      </motion.div>
                    )
                  )}
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
          <IdentificationQuizMain {...props} />
        )}
      </AnimatePresence>
    </CardContent>
  );
}
