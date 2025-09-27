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
            className="min-h-[120px] p-4 border-2 rounded-md bg-gray-50 border-gray-300"
          >
            <h3 className="font-semibold text-lg mb-2">{container}</h3>
            <div className="flex flex-wrap gap-2">
              {answers.length === 0 ? (
                <div className="text-gray-400">No answers submitted.</div>
              ) : (
                answers.map((ans, idx) => (
                  <div
                    key={ans.label + idx}
                    className={`p-2 rounded text-sm font-medium ${
                      ans.isCorrect
                        ? "bg-green-100 text-green-700 border border-green-400"
                        : "bg-red-100 text-red-700 border border-red-400"
                    }`}
                  >
                    {ans.label}
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