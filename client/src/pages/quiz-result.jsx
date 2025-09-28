import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import IdentificationQuizResult from "@/components/results/identification-result";
import MatchingQuizResult from "@/components/results/matching-result";
import DndQuizResult from "@/components/results/dnd-result";
import moment from "moment";

export default function QuizResultPage() {
  const { resultId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResult() {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_ENDPOINT}api/activity/result/${resultId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            validateStatus: (status) => status < 500,
          }
        );
        if (res.status === 200) {
          setResult(res.data);
        } else {
          setResult(null);
        }
      } catch (err) {
        setResult(null);
      } finally {
        setLoading(false);
      }
    }
    fetchResult();
  }, [resultId]);

  if (loading) {
    return (
      <Card className="w-full max-w-3xl mx-auto mt-8">
        <CardHeader>
          <Skeleton className="h-8 w-1/2 rounded" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-6 w-1/3 rounded mb-2" />
          <Skeleton className="h-6 w-full rounded mb-2" />
          <Skeleton className="h-6 w-full rounded mb-2" />
        </CardContent>
      </Card>
    );
  }

  if (!result || !result.quizId || !Array.isArray(result.quizId.items)) {
    return (
      <Card className="w-full max-w-3xl mx-auto mt-8">
        <CardHeader>
          <h2 className="text-xl font-bold text-red-500">Result not found</h2>
        </CardHeader>
        <CardContent>
          <Link to="/activities">
            <Button>Back to Activities</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const { quizId } = result;
  const score =
    typeof result.score === "number" || !isNaN(Number(result.score))
      ? Number(result.score)
      : 0;
  const correctAnswers = Array.isArray(result.correctAnswers)
    ? result.correctAnswers
    : [];
  const wrongAnswers = Array.isArray(result.wrongAnswers)
    ? result.wrongAnswers
    : [];
  const activityType = quizId.activityType || "activity";
  const activityName = quizId.activityName || "";
  const activityDesc = quizId.activityDescription || "";
  const quizItems = Array.isArray(quizId.items) ? quizId.items : [];
  const totalItems =
    typeof result.items === "number" || !isNaN(Number(result.items))
      ? Number(result.items)
      : quizItems.length;

  return (
    <>
      <div className="flex justify-center gap-1 mb-6">
        <div className="w-8 h-2 bg-red-500 rounded-full"></div>
        <div className="w-8 h-2 bg-orange-500 rounded-full"></div>
        <div className="w-8 h-2 bg-yellow-500 rounded-full"></div>
        <div className="w-8 h-2 bg-green-500 rounded-full"></div>
        <div className="w-8 h-2 bg-blue-500 rounded-full"></div>
        <div className="w-8 h-2 bg-indigo-500 rounded-full"></div>
        <div className="w-8 h-2 bg-pink-500 rounded-full"></div>
      </div>
      <h1 className="text-center text-2xl font-bold text-red-600 capitalize">{quizId.type} Results</h1>
      <Card className="w-full max-w-5xl mx-auto mt-8">
        <CardHeader>
         <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-blue-600 capitalize">
              {quizId.type} - {activityName}
            </h2>
            <p>Date Taken: {moment(result.createdAt).format('lll')}</p>
         </div>
          <p className="text-gray-700">{activityDesc}</p>
          <p className="mt-2 text-lg font-semibold">
            Score: {score} / {totalItems}
          </p>
        </CardHeader>
        <CardContent className="px-0">
          {/* Use the correct result component based on activityType */}
          {activityType === "identification" && (
            <IdentificationQuizResult
              items={quizItems}
              correctAnswers={correctAnswers}
              wrongAnswers={wrongAnswers}
            />
          )}
          {activityType === "matching" && (
            <MatchingQuizResult
              items={quizItems}
              correctAnswers={correctAnswers}
              wrongAnswers={wrongAnswers}
            />
          )}
          {activityType === "dnd" && (
            <DndQuizResult
              items={quizItems} // quizId.items
              correctAnswers={correctAnswers}
              wrongAnswers={wrongAnswers}
            />
          )}
          {/* <div className="mt-8">
            <Link to="/activities">
              <Button>Back to Activities</Button>
            </Link>
          </div> */}
        </CardContent>
      </Card>
    </>
  );
}
