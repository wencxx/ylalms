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

const colors = {
  matching: "bg-blue-300",
  dnd: "bg-red-400",
  identification: "bg-orange-300",
  essay: "bg-cyan-400",
};

function ActivityCard({ activity }) {
  const { currentUser } = useAuth();
  
  const navigate = useNavigate()

  const takeQuiz = (quizId) => {
    navigate(`/quiz/${quizId}`)
  }

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
          <Button
            className="w-full cursor-pointer"
            disabled={activity.submittedUser.includes(currentUser._id)}
            onClick={() => takeQuiz(activity._id)}
            variant={activity.submittedUser.includes(currentUser._id) ?'sky' : 'default'}
          >
            {activity.submittedUser.includes(currentUser._id) ? 'Completed' : 'Take Quiz'}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}

export default ActivityCard;
