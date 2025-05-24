import { Card, CardHeader } from "@/components/ui/card";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// components
import AddMatching from "@/components/todo/add-matching";
import AddDragAndDrop from "@/components/todo/add-drag-and-drop";
import AddIdentification from "@/components/todo/add-identification";

function AddTodoPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activity = searchParams.get("q");

  // navigate back to activites if no query found
  useEffect(() => {
    if (!activity) {
      return navigate("/todo");
    }
  }, [activity]);

  return (
    <>
      <Card className="w-full max-w-4xl mt-5 bg-sky-100 mx-auto">
        <CardHeader>
          <h1 className="text-xl text-blue-500 font-semibold capitalize">
            Add {activity === "dnd" ? "Drag and Drop" : activity} Todo
          </h1>
        </CardHeader>
        {activity === "matching" ? (
          <AddMatching />
        ) : activity === "dnd" ? (
          <AddDragAndDrop />
        ) : activity === "identification" ? (
          <AddIdentification />
        ) : (
          <h1>Activity not found</h1>
        )}
      </Card>
    </>
  );
}

export default AddTodoPage;
