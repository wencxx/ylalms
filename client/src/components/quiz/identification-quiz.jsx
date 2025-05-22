import { useEffect, useState } from "react";
import { CardContent } from "../ui/card";
import { Button } from "../ui/button";

export default function IdentificationQuiz({ data, setScore, setItems }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");

  const currentItem = data?.items?.[currentIndex];

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
  };

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < data.items.length) {
      setCurrentIndex(nextIndex);
      setSelectedAnswer("");
    }
  };

  useEffect(() => {
    setItems(data.items.length);
  }, []);

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
          <Button className="mt-4" onClick={handleNext} disabled={selectedAnswer === "" || currentIndex === data.items.length - 1}>
            Next
          </Button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </CardContent>
  );
}
