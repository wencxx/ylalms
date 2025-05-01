import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import DndQuiz from "@/components/quiz/dnd-quiz";
import MatchingQuiz from "@/components/quiz/matching-quiz";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const colors = [
  "bg-orange-400",
  "bg-yellow-400",
  "bg-lime-400",
  "bg-green-400",
  "bg-emerald-400",
  "bg-teal-400",
  "bg-cyan-400",
  "bg-sky-400",
  "bg-blue-400",
  "bg-indigo-400",
  "bg-violet-400",
  "bg-purple-400",
  "bg-fuchsia-400",
  "bg-pink-400",
  "bg-rose-400",
];

export default function TakeQuizPage() {
  const { id } = useParams();

  const [score, setScore] = useState(0);

  // get activity
  const [activity, setActivity] = useState(null);
  const [fetching, setFetching] = useState(false);

  const getActivity = async () => {
    try {
      setFetching(true);
      const res = await axios.get(
        `${import.meta.env.VITE_ENDPOINT}api/activity/get/${id}`,
        {
          validateStatus: (status) => status < 500,
        }
      );

      if (res.status === 200) {
        setActivity(res.data);
      } else {
        setActivity(null);
      }
    } catch (error) {
      toast.error("Server error", {
        description: "Failed fetching activities, please try again later.",
      });
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    getActivity();
  }, []);

  return (
    <>
      {!fetching ? (
        activity && (
          <Card className="w-full max-w-6xl mx-auto bg-rose-300">
            <CardHeader>
              <h1 className="text-2xl font-bold capitalize text-blue-500">
                {activity.activityName}
              </h1>
              <p className="text-gray-700">{activity.activityDescription}</p>
            </CardHeader>
            {activity.activityType === "dnd" ? (
              <DndQuiz data={activity} setScore={setScore} colors={colors} />
            ) : (
              <MatchingQuiz data={activity.items} setScore={setScore} />
            )}
          </Card>
        )
      ) : (
        <Card className="w-full max-w-6xl mx-auto bg-rose-300">
          <CardHeader>
            <Skeleton className="h-9 w-56 rounded" />
            <Skeleton className="h-5 w-2/4 rounded" />
            <Skeleton className="h-5 w-1/3 rounded" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-96 w-full rounded-xl" />
          </CardContent>
        </Card>
      )}
    </>
  );
}
