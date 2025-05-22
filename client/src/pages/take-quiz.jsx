import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import DndQuiz from "@/components/quiz/dnd-quiz";
import MatchingQuiz from "@/components/quiz/matching-quiz";
import IdentificationQuiz from "@/components/quiz/identification-quiz";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";
import { QuizResultDialog } from "@/components/quiz-result-dialog";

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
  const { currentUser } = useAuth();

  const navigate = useNavigate();

  const [score, setScore] = useState(0);
  const [items, setItems] = useState(0);

  // get activity
  const [activity, setActivity] = useState(null);
  const [fetching, setFetching] = useState(false);

  const getActivity = async () => {
    try {
      setFetching(true);
      const res = await axios.get(
        `${import.meta.env.VITE_ENDPOINT}api/activity/get/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
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

  useEffect(() => {
    if (activity) {
      if (activity.submittedUser.includes(currentUser._id)) {
        toast.warning("You already taken this quiz.");
        navigate("/activities");
      }
    }
  }, [activity]);

  // submit quiz
  const [showPassDialog, setShowPassDialog] = useState(false);
  const [showFailDialog, setShowFailDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submitQuiz = async () => {
    const data = {
      quizId: activity._id,
      score,
      items,
    };

    try {
      setSubmitting(true);
      const res = await axios.post(
        `${import.meta.env.VITE_ENDPOINT}api/activity/add-answer`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          validateStatus: (status) => status < 500,
        }
      );

      if (res.status === 200) {
        if (score >= 0.75 * items) {
          setShowPassDialog(true);
        } else {
          setShowFailDialog(true);
        }
      } else {
        toast.error("Failed submitting quiz", {
          description: "Please try again later.",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed submitting quiz", {
        description: "Please try again later.",
      });
    } finally {
      setSubmitting(false);
    }

    console.log(data);
  };

  return (
    <>
      {!fetching ? (
        activity && (
          <Card className="w-full max-w-6xl mx-auto bg-rose-300">
            <CardHeader>
              <h1 className="text-2xl font-bold capitalize text-blue-500">
                {activity.activityName} {score} {items}
              </h1>
              <p className="text-gray-700">{activity.activityDescription}</p>
            </CardHeader>
            {activity.activityType === "dnd" ? (
              <DndQuiz
                data={activity}
                setScore={setScore}
                colors={colors}
                setItems={setItems}
              />
            ) : activity.activityType === "identification" ? (
              <IdentificationQuiz
                data={activity}
                setScore={setScore}
                setItems={setItems}
              />
            ) : (
              <MatchingQuiz
                data={activity.items}
                setScore={setScore}
                setItems={setItems}
              />
            )}
            <CardFooter className="flex justify-end">
              <Button
                onClick={() => submitQuiz()}
                disabled={submitting}
                className={`${submitting && "animate-pulse"}`}
              >
                {submitting ? "Submitting Quiz" : "Submit Quiz"}
              </Button>
            </CardFooter>
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
            <div className="w-full">
              <Skeleton className="h-10 w-30 float-end mt-4" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* dialog for success quiz */}
      <QuizResultDialog
        isOpen={showPassDialog}
        onClose={() => setShowPassDialog(false)}
        isPassed={true}
        score={score}
        totalQuestions={items}
      />

      <QuizResultDialog
        isOpen={showFailDialog}
        onClose={() => setShowFailDialog(false)}
        isPassed={false}
        score={score}
        totalQuestions={items}
      />
    </>
  );
}
