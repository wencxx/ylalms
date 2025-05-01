import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Link } from "react-router-dom";

const colors = {
  matching: "bg-blue-300",
  dnd: "bg-red-400",
  identification: "bg-orange-300",
  essay: "bg-cyan-400",
};

function ActivityCard({ activity }) {
  return (
    <>
      <Card
        className={`text-white ${colors[activity.activityType]} dark:bg-neutral-600`}
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
          <Link to={`/quiz/${activity._id}`} className="w-full">
            <Button className="w-full cursor-pointer">Take Quiz</Button>
          </Link>
        </CardFooter>
      </Card>
    </>
  );
}

export default ActivityCard;
