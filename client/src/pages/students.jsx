import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddStudent from '@/components/form/add-student-form'

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [fetching, setFetching] = useState(true);

  const getAllStudents = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_ENDPOINT}api/auth/get-all-users`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          validateStatus: (status) => status < 500,
        }
      );

      if (res.status === 200) {
        setStudents(res.data);
      } else {
        setStudents([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    getAllStudents();
  }, []);

  //fitler students
  const [filter, setFilter] = useState("");

  const filteredStudents = () => {
    if (!filter) return students;

    return students.filter((student) => {
      const fullname = [
        student.firstName,
        student.middleName,
        student.lastName,
      ].join(" ");
      return fullname.toLowerCase().includes(filter.toLowerCase());
    });
  };

  // add new student
  const [openDialog, setOpenDialog] = useState(false)

  return (
    <>
      <div className="bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 rounded-xl p-6 mb-8">
        <h1 className="text-3xl font-bold text-orange-400 mb-2">
          My Awesome Students
        </h1>
        <p className="text-red-400">
          See how your students are doing and track their progress!
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div className="relative w-full md:w-auto flex-1 lg:max-w-sm">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            placeholder="Find a student..."
            className="pl-10 bg-white border-2 border-purple-200 focus:border-purple-400 rounded-full"
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button className="bg-green-500 hover:bg-green-600" onClick={() => setOpenDialog(true)}>
            Add Student
          </Button>
          <Button
            variant="outline"
            className="border-purple-300 text-purple-700"
          >
            Export List
          </Button>
        </div>
      </div>

      {!fetching ? (
        filteredStudents().length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents().map((student) => (
              <Card
                key={student._id}
                className="overflow-hidden border-2 border-purple-100 hover:border-purple-300 transition-all duration-300"
              >
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div>
                      <img
                        src={
                          student.gender === "Male" ? "/boy.png" : "/girl.png"
                        }
                        alt={student.name}
                        className="rounded-full border-4 border-purple-200"
                        width={80}
                        height={80}
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-purple-900">
                        {[
                          student.firstName,
                          student.middleName,
                          student.lastName,
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      </h3>
                      <p className="text-purple-600">{student.gender}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span className="font-medium">10%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="h-2.5 rounded-full bg-pink-500"
                        style={{ width: `${10}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-purple-50 flex justify-between">
                  <Button variant="ghost" size="sm" className="text-purple-700">
                    View Details
                  </Button>
                  <Link to={`/students/${student._id}/assignments`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-purple-700"
                    >
                      Activities
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-neutral-500">No students available</p>
        )
      ) : (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-60 rounded-xl w-full" />
          <Skeleton className="h-60 rounded-xl w-full" />
          <Skeleton className="h-60 rounded-xl w-full" />
        </div>
      )}

      {/* dialog for adding students */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add new student</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <AddStudent setStudents={setStudents} setOpenDialog={setOpenDialog} /> 
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
