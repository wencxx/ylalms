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
import { Checkbox } from "@/components/ui/checkbox";

function AddMatching() {
  const [activityName, setActivityName] = useState("");
  const [activityDescription, setActivityDescription] = useState("");
  const [dueDate, setDueDate] = useState(null);

  const [leftItem, setLeftItem] = useState("");
  const [rightItem, setRightItem] = useState("");

  const [pairs, setPairs] = useState([]);

  const [isLeftImage, setIsLeftImage] = useState(false);
  const [isRightImage, setIsRightImage] = useState(false);
  const [leftImageFile, setLeftImageFile] = useState(null);
  const [rightImageFile, setRightImageFile] = useState(null);
  const [leftPreview, setLeftPreview] = useState("");
  const [rightPreview, setRightPreview] = useState("");

  const navigate = useNavigate();

  const handleLeftImageChange = (file) => {
    setLeftImageFile(file);
    setLeftPreview(URL.createObjectURL(file));
  };

  const handleRightImageChange = (file) => {
    setRightImageFile(file);
    setRightPreview(URL.createObjectURL(file));
  };

  const addMatchingPair = () => {
    if (isLeftImage && !leftImageFile) {
      return alert("Please select an image for the left item.");
    }

    if (isRightImage && !rightImageFile) {
      return alert("Please select an image for the right item.");
    }

    if (!isLeftImage && !leftItem.trim()) {
      return alert("Please enter text for the left item.");
    }

    if (!isRightImage && !rightItem.trim()) {
      return alert("Please enter text for the right item.");
    }

    const data = {
      id: pairs.length + 1,
      leftItem: isLeftImage
        ? { type: "image", file: leftImageFile, preview: leftPreview }
        : { type: "text", content: leftItem },
      rightItem: isRightImage
        ? { type: "image", file: rightImageFile, preview: rightPreview }
        : { type: "text", content: rightItem },
    };

    setPairs((prev) => [...prev, data]);
    setLeftItem("");
    setRightItem("");
    setLeftImageFile(null);
    setRightImageFile(null);
    setLeftPreview("");
    setRightPreview("");
  };

  const [adding, setAdding] = useState(false);

  const addActivity = async () => {
    const formData = new FormData();
    formData.append("activityName", activityName);
    formData.append("activityType", "matching");
    formData.append("activityDescription", activityDescription);
    formData.append("dueDate", dueDate);
    formData.append("type", "todo");

    const serializedPairs = pairs.map((pair, idx) => ({
      id: pair.id,
      leftItem:
        pair.leftItem.type === "text"
          ? { type: "text", content: pair.leftItem.content }
          : { type: "image", index: `left_${idx}` },
      rightItem:
        pair.rightItem.type === "text"
          ? { type: "text", content: pair.rightItem.content }
          : { type: "image", index: `right_${idx}` },
    }));

    formData.append("items", JSON.stringify(serializedPairs));

    pairs.forEach((pair, idx) => {
      if (pair.leftItem.type === "image" && pair.leftItem.file) {
        formData.append(`left_${idx}`, pair.leftItem.file);
      }
      if (pair.rightItem.type === "image" && pair.rightItem.file) {
        formData.append(`right_${idx}`, pair.rightItem.file);
      }
    });

    try {
      setAdding(true);
      const res = await axios.post(
        `${import.meta.env.VITE_ENDPOINT}api/activity/add`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
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
              <div className="flex justify-between items-center">
                <Label className="text-md">Left Item</Label>
                <div className="flex items-center gap-x-3">
                  <Label>Add image</Label>
                  <Checkbox
                    className="border-black"
                    checked={isLeftImage}
                    onCheckedChange={(checked) => setIsLeftImage(!!checked)}
                  />
                </div>
              </div>
              {isLeftImage ? (
                <>
                  <Input
                    type="file"
                    accept="image/*"
                    className="border-purple-500 bg-white"
                    onChange={(e) => handleLeftImageChange(e.target.files[0])}
                  />
                  {leftPreview && (
                    <img
                      src={leftPreview}
                      alt="Left Preview"
                      className="w-32 h-32 object-cover rounded-md border"
                    />
                  )}
                </>
              ) : (
                <Input
                  className="border-purple-500 bg-white"
                  placeholder="e.g., Banana"
                  value={leftItem}
                  onChange={(e) => setLeftItem(e.target.value)}
                />
              )}
            </div>
            <div className="space-y-2 w-1/2">
              <div className="flex justify-between items-center">
                <Label className="text-md">Right Item</Label>
                <div className="flex items-center gap-x-3">
                  <Label>Add image</Label>
                  <Checkbox
                    className="border-black"
                    checked={isRightImage}
                    onCheckedChange={(checked) => setIsRightImage(!!checked)}
                  />
                </div>
              </div>
              {isRightImage ? (
                <>
                  <Input
                    type="file"
                    accept="image/*"
                    className="border-purple-500 bg-white"
                    onChange={(e) => handleRightImageChange(e.target.files[0])}
                  />
                  {rightPreview && (
                    <img
                      src={rightPreview}
                      alt="Right Preview"
                      className="w-32 h-32 object-cover rounded-md border"
                    />
                  )}
                </>
              ) : (
                <Input
                  className="border-purple-500 bg-white"
                  placeholder="e.g., Yellow"
                  value={rightItem}
                  onChange={(e) => setRightItem(e.target.value)}
                />
              )}
            </div>
          </div>
          <Button
            className="w-full bg-violet-500 hover:bg-violet-500/80"
            onClick={addMatchingPair}
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
                    {pair.leftItem.type === "text"
                      ? pair.leftItem.content
                      : "Image uploaded"}
                  </div>
                  <p className="text-gray-500">matches with</p>
                  <div className="bg-blue-300 p-1 py-2 w-1/3 text-center text-white rounded">
                    {pair.rightItem.type === "text"
                      ? pair.rightItem.content
                      : "Image uploaded"}
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
                {adding ? "Adding todo" : "Add todo"}
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
