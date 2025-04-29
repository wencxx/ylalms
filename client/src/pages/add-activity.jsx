import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

function AddQuizPage() {
  const [searchParams] = useSearchParams();
  const activity = searchParams.get("q");

  const [leftItem, setLeftItem] = useState('');
  const [rightItem, setRightItem] = useState('');

  const [pairs, setPairs] = useState([]);

  const addMatchingPair = () => {
    if(!leftItem || !rightItem) return

    const data = {
      id: pairs.length + 1,
      leftItem,
      rightItem,
    };

    setPairs((prev) => [...prev, data]);
    setLeftItem('')
    setRightItem('')
  };

  const removePair = (indexToRemove) => {
    setPairs((prevPairs) => prevPairs.filter((_, index) => index !== indexToRemove));
  };

  return (
    <>
      <Card className="w-full max-w-4xl mt-5 bg-sky-100 mx-auto">
        <CardHeader>
          <h1 className="text-xl text-blue-500 font-semibold capitalize">
            Add {activity} Activity
          </h1>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-2">
            <Label className="text-md">Activity Name</Label>
            <Input
              className="border-purple-500 bg-white"
              placeholder="Enter activity name"
            />
          </div>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="space-y-2 w-1/2">
                <Label className="text-md">Left Item</Label>
                <Input
                  className="border-purple-500 bg-white"
                  placeholder="e.g., Yellow"
                  value={leftItem}
                  onChange={(e) => setLeftItem(e.target.value)}
                />
              </div>
              <div className="space-y-2 w-1/2">
                <Label className="text-md">Right Item</Label>
                <Input
                  className="border-purple-500 bg-white"
                  value={rightItem}
                  placeholder="e.g., Banana"
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
                <Button className="w-full mt-2">Add Activity</Button>
              </div>
            ) : (
              <p className="text-center text-gray-500">
                No matching pairs added yet. Add your first pair above!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default AddQuizPage;
