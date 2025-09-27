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

function AddIdentification() {
  const [activityName, setActivityName] = useState("");
  const [activityDescription, setActivityDescription] = useState("");
  const [dueDate, setDueDate] = useState(null);

  const navigate = useNavigate()

  const [items, setItems] = useState([
    {
      question: "",
      image: null,
      choices: ["", "", "", ""],
      correctAnswer: 0,
    },
  ]);

  const handleItemChange = (idx, field, value) => {
    const updated = [...items];
    updated[idx][field] = value;
    setItems(updated);
  };

  const handleChoiceChange = (itemIdx, choiceIdx, value) => {
    const updated = [...items];
    updated[itemIdx].choices[choiceIdx] = value;
    setItems(updated);
  };

  const handleImageChange = (idx, file) => {
    const updated = [...items];
    updated[idx].image = file;
    setItems(updated);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        question: "",
        image: null,
        choices: ["", "", "", ""],
        correctAnswer: 0,
      },
    ]);
  };

  const removeItem = (idx) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const [adding, setAdding] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("activityName", activityName);
    formData.append("dueDate", dueDate);
    formData.append("type", "todo");
    formData.append("activityDescription", activityDescription);
    formData.append("activityType", "identification");

    items.forEach((item, index) => {
      formData.append(`items[${index}][question]`, item.question);
      formData.append(`items[${index}][correctAnswer]`, item.correctAnswer);

      item.choices.forEach((choice, cIdx) => {
        formData.append(`items[${index}][choices][${cIdx}]`, choice);
      });

      if (item.image) {
        formData.append(`items[${index}][image]`, item.image);
      }
    });

    try {
      setAdding(true);
      await axios.post(
        `${import.meta.env.VITE_ENDPOINT}api/activity/add`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setActivityDescription("");
      setActivityName("");
      setItems([
        {
          question: "",
          image: null,
          choices: ["", "", "", ""],
          correctAnswer: 0,
        },
      ]);
      toast.success("Activity todo successfully!");
      navigate("/todo");
    } catch (err) {
      toast.error("Failed to add activity");
    } finally {
      setAdding(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div className="space-y-8">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="border p-4 rounded-md space-y-4 bg-white border-purple-500"
            >
              <div className="flex justify-between items-center">
                <Label className="text-md">Item {idx + 1}</Label>
                {items.length > 1 && (
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeItem(idx)}
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>
              <div className="space-y-2">
                <Label>Question</Label>
                <Input
                  placeholder="Enter question"
                  value={item.question}
                  onChange={(e) =>
                    handleItemChange(idx, "question", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Image (optional)</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(idx, e.target.files[0])}
                />
                {item.image && (
                  <img
                    src={URL.createObjectURL(item.image)}
                    alt="Preview"
                    className="w-32 h-32 object-cover mt-2"
                  />
                )}
              </div>
              <div className="space-y-2">
                <Label>Choices</Label>
                {item.choices.map((choice, cIdx) => (
                  <div key={cIdx} className="flex items-center gap-2">
                    <Input
                      placeholder={`Choice ${cIdx + 1}`}
                      value={choice}
                      onChange={(e) =>
                        handleChoiceChange(idx, cIdx, e.target.value)
                      }
                    />
                    <input
                      type="radio"
                      name={`correct-${idx}`}
                      checked={item.correctAnswer === cIdx}
                      onChange={() =>
                        handleItemChange(idx, "correctAnswer", cIdx)
                      }
                    />
                    <span className="text-xs">Correct</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            className="flex items-center gap-2 bg-rose-300"
            onClick={addItem}
          >
            <Plus size={16} /> Add Item
          </Button>
          <Button
            type="submit"
            className={`w-full mt-2 ${adding && "animate-pulse"}`}
          >
            {adding ? "Adding activity" : "Add activity"}
          </Button>
        </div>
      </CardContent>
    </form>
  );
}

export default AddIdentification;
