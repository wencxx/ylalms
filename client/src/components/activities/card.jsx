import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/auth-provider";
import { toast } from "sonner";
import axios from "axios";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import moment from "moment";

const colors = {
  matching: "bg-[#87C7F1]",
  dnd: "bg-[#EACFFF]",
  identification: "bg-[#FFEDA9]",
  essay: "bg-[#AAE9E5]",
};

function ActivityCard({ activity, setActivities }) {
  const { currentUser } = useAuth();

  const navigate = useNavigate();

  const takeQuiz = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };

  // delete activity
  const [deleting, setDeleting] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState(null);
  const [showAlertDialog, setShowAlertDialog] = useState(false);

  const deleteActivity = async (activityID) => {
    setActivityToDelete(activityID);
    setShowAlertDialog(true);
  };

  const confirmDelete = async () => {
    try {
      setDeleting(false);
      const res = await axios.delete(
        `${
          import.meta.env.VITE_ENDPOINT
        }api/activity/delete/${activityToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          validateStatus: (status) => status < 500,
        }
      );

      if (res.status === 200) {
        toast.success("Deleted activity successfully");
        setActivities((prev) =>
          prev.filter((activity) => activity._id !== activityToDelete)
        );
      } else {
        toast.error(res.data);
      }
    } catch (error) {
      toast.error("Server error");
    } finally {
      setDeleting(true);
      setShowAlertDialog(false);
    }
  };
  return (
    <>
      <Card
        className={`text-white ${
          colors[activity.activityType]
        } dark:bg-neutral-600`}
      >
        <CardHeader>
          <div className="flex justify-end gap-x-2">
            {currentUser.role === "student" &&
              activity.dueDate &&
              moment(activity.dueDate).isBefore(moment()) && (
                <Badge className={`capitalize bg-red-500 dark:bg-neutral-300`}>
                  Missed
                </Badge>
              )}
            <Badge className={`capitalize bg-fuchsia-400 dark:bg-neutral-300`}>
              {activity.activityType === "dnd"
                ? "Drag and Drop"
                : activity.activityType}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <h2 className="text-black capitalize text-lg font-medium tracking-wide">
            {activity.activityName}
          </h2>
          <div>
            <p className="text-black capitalize">{activity.activityDescription}</p>
            {activity.dueDate && (
              <p className="text-black">
                <span className="font-semibold">Due Date:</span>{" "}
                {moment(activity.dueDate).format("lll")}
              </p>
            )}
            {/* Show attempts for student */}
            {currentUser.role === "student" &&
              (() => {
                const userSubmission = activity.submittedUser.find(
                  (u) => u.id === currentUser._id
                );
                if (userSubmission) {
                  return (
                    <p className="text-black">
                      <span className="font-semibold">Attempts:</span>{" "}
                      {userSubmission.attempt} / 3
                    </p>
                  );
                }
                return null;
              })()}
          </div>
        </CardContent>
        <CardFooter>
          {currentUser.role === "teacher" ? (
            <Button
              className={`w-full cursor-pointer bg-red-400 hover:bg-red-500 ${deleting && "animate-pulse"}`}
              onClick={() => deleteActivity(activity._id)}
              disabled={deleting}
            >
              {deleting ? "Deleting" : "Delete"}
            </Button>
          ) : activity.dueDate &&
            moment(activity.dueDate).isBefore(moment()) ? (
            <Button
              className="w-full cursor-pointer bg-red-400"
              disabled
            >
              Missed
            </Button>
          ) : (
            <Button
              className="w-full cursor-pointer capitalize"
              disabled={
                activity.submittedUser.find((u) => u.id === currentUser._id)
                  ?.attempt >= 3
              }
              onClick={() => takeQuiz(activity._id)}
              variant="sky"
            >
              {activity.submittedUser.find((u) => u.id === currentUser._id)
                ?.attempt >= 3
                ? "Completed"
                : `Take ${activity.type}`}
            </Button>
          )}
        </CardFooter>
      </Card>

      <AlertDialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. It will permanently delete the
              activity and all corresponding answers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => confirmDelete()}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default ActivityCard;
