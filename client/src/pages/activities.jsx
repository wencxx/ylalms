import { Button } from "@/components/ui/button";
import { Plus, RotateCcw } from "lucide-react";
import ActivityCard from "@/components/activities/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const activities = [
  {
    title: "Animals and Sound",
    type: "matching",
    items: [1, 2, 3, 4, 5, 6],
  },
  {
    title: "Shapes",
    type: "dnd",
    items: [1, 2, 3, 4, 5, 6],
  },
];

function ActivitiesPage() {
  const navigate = useNavigate();

  const [selectedQuizType, setSelectedQuizType] = useState("");
  const [loading, setLoading] = useState(false);

  const selectQuizType = () => {
    if(!selectedQuizType)return alert('Select quiz type')
    setLoading(true);

    setTimeout(() => {
      navigate(`/add-activity?q=${selectedQuizType}`);
      setLoading(false);
    }, 1500);
  };
  return (
    <>
      <div className="w-full flex justify-between">
        <h1 className="text-lg">Activity Lists</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus />
              Add Activity
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select activity type</DialogTitle>
              <DialogDescription>
                Pick the kind of activity you want to add. It could be a fun
                quiz, a learning video, or a new challenge!
              </DialogDescription>
            </DialogHeader>
            <div>
              <Select onValueChange={(value) => setSelectedQuizType(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select activity type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dnd">Drag and Drop</SelectItem>
                  <SelectItem value="matching">Matching</SelectItem>
                  <SelectItem value="identification">Identification</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                variant="sky"
                onClick={() => selectQuizType()}
                className={`${loading && 'animate-pulse'}`}
              >
                {loading && <RotateCcw className="animate-spin" />}
                {loading ? 'Redirecting' : 'Select Type'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {activities.map((activity, index) => (
          <ActivityCard key={index} activity={activity} />
        ))}
      </div>
    </>
  );
}

export default ActivitiesPage;
