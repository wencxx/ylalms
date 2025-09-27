import { CardContent } from "../ui/card";
import { Button } from "../ui/button";

export default function IdentificationQuizResult({ items = [], correctAnswers = [], wrongAnswers = [] }) {
  const correctMap = new Map(correctAnswers.map(ans => [ans.index, ans]));
  const wrongMap = new Map(wrongAnswers.map(ans => [ans.index, ans]));

  return (
    <CardContent className="space-y-4">
      {items.map((item, idx) => {
        const correct = correctMap.get(idx);
        const wrong = wrongMap.get(idx);
        const userAnswer = correct ? correct.answer : wrong ? wrong.answer : null;
        const isCorrect = !!correct;
        return (
          <div key={idx} className="mb-4">
            <h2 className="text-xl font-bold">
              Question {idx + 1} of {items.length}
            </h2>
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt="Question image"
                className="w-full max-w-md rounded-lg mb-2"
              />
            )}
            <p className="text-lg mb-2">{item.question}</p>
            <div className="grid gap-2 mb-2">
              {item.choices.map((choice, choiceIdx) => {
                // Determine button color
                let btnClass = "outline";
                let extraClass = "";
                if (userAnswer === choice) {
                  btnClass = "default";
                  extraClass = isCorrect
                    ? "bg-green-100 text-green-700 border-green-700"
                    : "bg-red-100 text-red-700 border-red-700";
                } else if (choiceIdx === item.correctAnswer) {
                  extraClass = "bg-green-100 text-green-700 border-green-700";
                }
                return (
                  <Button
                    key={choiceIdx}
                    variant={btnClass}
                    className={extraClass}
                    disabled
                  >
                    {choice}
                  </Button>
                );
              })}
            </div>
            <div className="mb-3">
              <span
                className={`font-semibold px-2 py-1 rounded ${
                  isCorrect
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                Your Answer: {userAnswer ?? <span className="text-gray-500">No answer</span>}
              </span>
            </div>
            <div className="mt-1">
              <span className="font-semibold px-2 py-1 rounded bg-green-100 text-green-700">
                Correct Answer: {item.choices[item.correctAnswer]}
              </span>
            </div>
          </div>
        );
      })}
    </CardContent>
  );
}
