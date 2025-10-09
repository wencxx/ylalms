import { CardContent } from "../ui/card";

function groupAnswersByContainer(items, correctAnswers, wrongAnswers) {
  const containers = items.map((group) => group.container);
  const grouped = {};
  containers.forEach((container) => {
    grouped[container] = [];
  });

  correctAnswers.forEach((ans) => {
    grouped[ans.userContainer]?.push({ ...ans, isCorrect: true });
  });
  wrongAnswers.forEach((ans) => {
    grouped[ans.userContainer]?.push({ ...ans, isCorrect: false });
  });

  return grouped;
}

export default function DndQuizResult({
  items = [],
  correctAnswers = [],
  wrongAnswers = [],
}) {
  const grouped = groupAnswersByContainer(items, correctAnswers, wrongAnswers);

  return (
    <CardContent>
      <div className="grid lg:grid-cols-2 gap-8">
        {Object.entries(grouped).map(([container, answers]) => (
          <div
            key={container}
            className="min-h-[140px] p-4 border-2 rounded-md bg-gray-50 border-gray-300"
          >
            <h3 className="font-semibold text-lg mb-3">{container}</h3>

            <div className="flex flex-wrap gap-3">
              {answers.length === 0 ? (
                <div className="text-gray-400 italic">
                  No answers submitted.
                </div>
              ) : (
                answers.map((ans, idx) => (
                  <div
                    key={`${ans.id || idx}`}
                    className={`p-2 rounded-md flex flex-col items-center justify-center text-sm font-medium transition-all border ${
                      ans.isCorrect
                        ? "bg-green-100 text-green-700 border-green-400"
                        : "bg-red-100 text-red-700 border-red-400"
                    }`}
                  >
                    {ans.type === "image" ? (
                      <img
                        src={
                          ans.imageUrl?.startsWith("http")
                            ? ans.imageUrl
                            : `${import.meta.env.VITE_API_URL}/${ans.imageUrl}`
                        }
                        alt="answer"
                        className="w-16 h-16 object-cover rounded-md mb-1"
                      />
                    ) : (
                      <span>{ans.label || ans.content}</span>
                    )}
                    {/* <span className="text-xs opacity-70">
                      {ans.isCorrect ? "Correct" : "Wrong"}
                    </span> */}
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  );
}
