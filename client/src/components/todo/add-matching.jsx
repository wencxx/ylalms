import { CardContent } from "../ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

function AddMatching() {
  const [activityName, setActivityName] = useState("");
  const [activityDescription, setActivityDescription] = useState("");
  const [dueDate, setDueDate] = useState(null)

  const [leftItem, setLeftItem] = useState("");
  const [rightItem, setRightItem] = useState("");

  const [pairs, setPairs] = useState([]);

  const addMatchingPair = () => {
    if (!leftItem || !rightItem) return;

    const data = {
      id: pairs.length + 1,
      leftItem,
      rightItem,
    };

    setPairs((prev) => [...prev, data]);
    setLeftItem("");
    setRightItem("");
  };

  const removePair = (indexToRemove) => {
    setPairs((prevPairs) =>
      prevPairs.filter((_, index) => index !== indexToRemove)
    );
  };

  // add activity to database
  const [adding, setAdding] = useState(false);

  const navigate = useNavigate();

  const addActivity = async () => {
    const newActivity = {
      activityName,
      dueDate,
      type: 'todo',
      activityType: "matching",
      activityDescription,
      items: pairs,
    };

    try {
      setAdding(true);
      const res = await axios.post(
        `${import.meta.env.VITE_ENDPOINT}api/activity/add`,
        newActivity,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          validateStatus: (status) => status < 500,
        }
      );

      if (res.status === 200) {
        toast.success("Added todo successfully");
        navigate("/todo");
      } else {
        toast.error("Failed to add data");
      }
    } catch (error) {
      toast.error("Server error", {
        description: "Please try again later",
      });
    } finally {
      setAdding(false);
    }
  };

  return (
    <>
      <CardContent className="space-y-8">
        <div className="space-y-2">
          <Label className="text-md">Todo Name</Label>
          <Input
            className="border-purple-500 bg-white"
            placeholder="Enter activity name"
            value={activityName}
            onChange={(e) => setActivityName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-md">Description</Label>
          <Textarea
            className="border-purple-500 bg-white"
            placeholder="Enter todo description"
            value={activityDescription}
            onChange={(e) => setActivityDescription(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-md">Due Date</Label>
          <Input
            className="border-purple-500 bg-white"
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        {/* adding items hereee */}
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="space-y-2 w-1/2">
              <Label className="text-md">Left Item</Label>
              <Input
                className="border-purple-500 bg-white"
                placeholder="e.g., Banana"
                value={leftItem}
                onChange={(e) => setLeftItem(e.target.value)}
              />
            </div>
            <div className="space-y-2 w-1/2">
              <Label className="text-md">Right Item</Label>
              <Input
                className="border-purple-500 bg-white"
                value={rightItem}
                placeholder="e.g., Yellow"
                onChange={(e) => setRightItem(e.target.value)}
              />
            </div>
          </div>
          <Button
            className="w-full bg-violet-500 hover:bg-violet-500/80"
            onClick={() => addMatchingPair()}
          >
            <Plus />
            Add Matching Pair
          </Button>
        </div>
        {/* items list heree */}
        <div>
          {pairs.length ? (
            <div className="space-y-2">
              {pairs.map((pair, index) => (
                <div
                  key={index}
                  className="border border-purple-400 w-full bg-white p-2 rounded-lg flex gap-10 items-center"
                >
                  <div className="bg-pink-300 p-1 py-2 w-1/3 text-center text-white rounded">
                    {pair.leftItem}
                  </div>
                  <p className="text-gray-500">matches with</p>
                  <div className="bg-blue-300 p-1 py-2 w-1/3 text-center text-white rounded">
                    {pair.rightItem}
                  </div>
                  <div
                    className="hover:bg-red-200 p-2 rounded"
                    onClick={() => removePair(index)}
                  >
                    <Trash2 className="text-red-500 cursor-pointer" />
                  </div>
                </div>
              ))}
              <Button
                className={`w-full mt-2 ${adding && "animate-pulse"}`}
                onClick={() => addActivity()}
              >
                {adding ? "Adding activity" : "Add Activity"}
              </Button>
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No matching pairs added yet. Add your first pair above!
            </p>
          )}
        </div>
      </CardContent>
    </>
  );
}

export default AddMatching;
