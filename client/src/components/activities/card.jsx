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

const colors = {
  matching: "bg-blue-300",
  dnd: "bg-red-400",
  identification: "bg-orange-300",
  essay: "bg-cyan-400",
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
        `${import.meta.env.VITE_ENDPOINT}api/activity/delete/${activityToDelete}`,
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
          <Badge
            className={`ml-auto capitalize bg-fuchsia-400 dark:bg-neutral-300`}
          >
            {activity.activityType === "dnd"
              ? "Drag and Drop"
              : activity.activityType}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          <h2 className="text-lg font-medium tracking-wide">
            {activity.activityName}
          </h2>
          <p className="text-gray-100">{activity.activityDescription}</p>
        </CardContent>
        <CardFooter>
          {currentUser.role === "teacher" ? (
            <Button
              variant="destructive"
              className={`w-full cursor-pointer ${deleting && "animate-pulse"}`}
              onClick={() => deleteActivity(activity._id)}
              disabled={deleting}
            >
              {deleting ? "Deleting" : "Delete"}
            </Button>
          ) : (
            <Button
              className="w-full cursor-pointer"
              disabled={activity.submittedUser.includes(currentUser._id)}
              onClick={() => takeQuiz(activity._id)}
              variant={
                activity.submittedUser.includes(currentUser._id)
                  ? "sky"
                  : "default"
              }
            >
              {activity.submittedUser.includes(currentUser._id)
                ? "Completed"
                : "Take Quiz"}
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
            <AlertDialogAction className='bg-red-600 hover:bg-red-700' onClick={() => confirmDelete()}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default ActivityCard;
