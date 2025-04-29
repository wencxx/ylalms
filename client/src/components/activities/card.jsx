import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

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
        className={`text-white ${
          colors[activity.type]
        }`}
      >
        <CardHeader>
          <Badge className={`ml-auto capitalize bg-fuchsia-400`}>
            {activity.type === "dnd" ? "Drag and Drop" : activity.type}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-3">
            <h2 className="text-lg font-medium tracking-wide">{activity.title}</h2>
            <p className="text-gray-100">
              Match one item on the left with its correct pair on the right!
            </p>    
        </CardContent>
        <CardFooter>
          <Button className="w-full">Take Quiz</Button>
        </CardFooter>
      </Card>
    </>
  );
}

export default ActivityCard;
