import { CardContent } from "../ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const colors = [
  "bg-red-400",
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

function AddDragAndDrop() {
  const [activityName, setActivityName] = useState("");
  const [activityDescription, setActivityDescription] = useState("");
  const [dueDate, setDueDate] = useState(null);

  // add container
  const [containers, setContainer] = useState([]);
  const [currentContainer, setCurrentContainer] = useState("");

  const addContainer = () => {
    const existingContainer = containers.find(
      (container) =>
        container.container.toLowerCase() === currentContainer.toLowerCase()
    );

    if (existingContainer) {
      return alert("Container already exist.");
    }
    const newContainer = {
      container: currentContainer,
      items: [],
    };
    setContainer((prev) => [...prev, newContainer]);
    setCurrentContainer("");
  };

  // add item
  const [item, setItem] = useState("");
  const [belongTo, setBelongsTo] = useState("");

  const addItem = () => {
    setContainer((prevContainers) =>
      prevContainers.map((container) =>
        container.container === belongTo
          ? { ...container, items: [...container.items, item] }
          : container
      )
    );
    setItem("");
    setBelongsTo("");
  };

  // remove container
  const removeContainer = (indexToRemove) => {
    const mappedContainers = containers.filter(
      (container, index) => index !== indexToRemove
    );
    setContainer(mappedContainers);
  };

  // add activity to datebase
  const [adding, setAdding] = useState(false);

  const navigate = useNavigate();

  const addActivity = async () => {
    const newActivity = {
      activityName,
      dueDate,
      type: 'todo',
      activityType: "dnd",
      activityDescription,
      items: [...containers],
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

  // generate random color
  const [colorMap, setColorMap] = useState({});

  useEffect(() => {
    const initialColors = {};
    containers.forEach((container, index) => {
      const randomIndex = Math.floor(Math.random() * colors.length);
      initialColors[index] = colors[randomIndex];
    });
    setColorMap(initialColors);
  }, [containers]);

  return (
    <>
      <CardContent className="space-y-8">
        <div className="space-y-2">
          <Label className="text-md">Todo Name</Label>
          <Input
            className="border-purple-500 bg-white"
            placeholder="Enter todo name"
            value={activityName}
            onChange={(e) => setActivityName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-md">Description</Label>
          <Textarea
            className="border-purple-500 bg-white"
            placeholder="Enter activity description"
            value={activityDescription}
            onChange={(e) => setActivityDescription(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-md">Due Date</Label>
          <Input
            className="border-purple-500 bg-white"
            type='datetime-local'
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        {/* container part hereee */}
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="space-y-2 w-full lg:w-1/2">
              <Label className="text-md">Container</Label>
              <Input
                className="border-purple-500 bg-white"
                placeholder="e.g., Animals"
                value={currentContainer}
                onChange={(e) => setCurrentContainer(e.target.value)}
              />
              <Button
                className="w-full bg-violet-500 hover:bg-violet-500/80 mt-2"
                onClick={() => addContainer()}
              >
                <Plus />
                Add Container
              </Button>
            </div>
            <div className="space-y-2 w-full lg:w-1/2">
              <Label className="text-md">Containers</Label>
              <div className="border border-purple-500 min-h-30 lg:min-h-22 rounded-md bg-white p-2 flex flex-wrap gap-2">
                {containers.map((container, index) => (
                  <Badge
                    key={index}
                    className={`h-fit ${colorMap[index]} cursor-pointer`}
                    onDoubleClick={() => removeContainer(index)}
                  >
                    {container.container}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* item part hereeee */}
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="space-y-2 w-full lg:w-1/2">
              <Label className="text-md">Item</Label>
              <Input
                className="border-purple-500 bg-white"
                placeholder="e.g., Dog"
                value={item}
                onChange={(e) => setItem(e.target.value)}
              />
            </div>
            <div className="space-y-2 w-full lg:w-1/2">
              <Label className="text-md">Belongs to</Label>
              <Select
                onValueChange={(value) => setBelongsTo(value)}
                value={belongTo}
              >
                <SelectTrigger className="w-full border-purple-500 bg-white">
                  <SelectValue placeholder="Select Container" />
                </SelectTrigger>
                <SelectContent>
                  {containers.length ? (
                    containers.map((container, index) => (
                      <SelectItem key={index} value={container.container}>
                        {container.container}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled>Add container first</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            className="w-full bg-red-400 hover:bg-red-400/80 mt-2"
            onClick={() => addItem()}
          >
            <Plus />
            Add Item
          </Button>
        </div>
        {/* items list part hereeee */}
        {containers.length &&
        containers.some((container) => container.items.length) ? (
          <div className="space-y-2">
            <h1>Items</h1>
            <div className="bg-white border border-purple-500 rounded-md p-3 flex flex-wrap gap-5">
              {containers.map(
                (container, index) =>
                  container.items.length > 0 && (
                    <div
                      key={index}
                      className={`${colorMap[index]} p-2 rounded text-white`}
                    >
                      <h4>{container.container}</h4>
                      <ul className="list-disc pl-4">
                        {container.items.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )
              )}
            </div>
            <Button
              className={`w-full mt-2 ${adding && "animate-pulse"}`}
              onClick={() => addActivity()}
            >
              {adding ? "Adding activity" : "Add Activity"}
            </Button>
          </div>
        ) : (
          <p className="text-center text-gray-500">No items to show.</p>
        )}
      </CardContent>
    </>
  );
}

export default AddDragAndDrop;
