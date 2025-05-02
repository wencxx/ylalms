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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

function ActivitiesPage() {
  const navigate = useNavigate();

  // get all activities
  const [activities, setActivities] = useState([])
  const [fetching, setFetching] = useState(false)

  const getActivities = async () => {
    try {
      setFetching(true)
      const res = await axios.get(`${import.meta.env.VITE_ENDPOINT}api/activity/get`, {
        validateStatus: status => status < 500
      })

      if(res.status === 200){
        setActivities(res.data)
      }else{
        setActivities([])
      }
    } catch (error) {
      toast.error('Server error', {
        description: 'Failed fetching activities, please try again later.',
        descriptionClassName: '!text-neutral-500',
      })
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    getActivities()
  }, [])


  // add quiz modal and blahblah
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
        {!fetching ? (
          activities.length ? (
            activities.map((activity, index) => (
              <ActivityCard key={index} activity={activity} />
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500">No activities to show</p>
          )
        ) : (
          <Skeleton className="h-60 rounded-xl" />
        )}
      </div>
    </>
  );
}

export default ActivitiesPage;
