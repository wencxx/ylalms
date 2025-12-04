import { Search, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ArchivedStudentsPage() {
  const [students, setStudents] = useState([]);
  const [fetching, setFetching] = useState(true);

  const getArchivedStudents = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_ENDPOINT}api/auth/get-archived-users`,
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

  const unarchiveUser = async (id) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_ENDPOINT}api/auth/unarchive/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          validateStatus: (status) => status < 500,
        }
      );

      if (res.status === 200) {
        toast.success("Student unarchived successfully.");
        setStudents((prev) => prev.filter((student) => student._id !== id));
      } else {
        toast.error(res.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to unarchive student.");
    }
  };

  const [showUnarchiveByYearDialog, setShowUnarchiveByYearDialog] =
    useState(false);
  const [unarchiveYear, setUnarchiveYear] = useState("");

  const unarchiveBySchoolYear = async () => {
    if (!unarchiveYear) {
      toast.error("Please enter a school year.");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_ENDPOINT}api/auth/unarchive-by-year`,
        { schoolYear: unarchiveYear },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          validateStatus: (status) => status < 500,
        }
      );

      if (res.status === 200) {
        toast.success("Students unarchived successfully.");
        getArchivedStudents(); // Refresh list
        setUnarchiveYear("");
      } else {
        toast.error(res.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to unarchive students.");
    } finally {
      setShowUnarchiveByYearDialog(false);
    }
  };

  useEffect(() => {
    getArchivedStudents();
  }, []);

  //fitler students
  const [filter, setFilter] = useState("");
  const [schoolYearFilter, setSchoolYearFilter] = useState("");

  const filteredStudents = () => {
    let filtered = students;

    if (filter) {
      filtered = filtered.filter((student) => {
        const fullname = [
          student.firstName,
          student.middleName,
          student.lastName,
        ].join(" ");
        return fullname.toLowerCase().includes(filter.toLowerCase());
      });
    }

    if (schoolYearFilter) {
      filtered = filtered.filter((student) =>
        student.schoolYear?.includes(schoolYearFilter)
      );
    }

    return filtered;
  };

  return (
    <>
      <div className="bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-4 mb-2">
          <Link to="/students">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-600">
            Archived Students
          </h1>
        </div>
        <p className="text-gray-500">View past students and their records.</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div className="relative w-full md:w-auto flex-1 lg:max-w-sm">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            placeholder="Find a student..."
            className="pl-10 bg-white border-2 border-gray-200 focus:border-gray-400 rounded-full"
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-full md:w-auto lg:max-w-xs">
            <Input
              placeholder="Filter by School Year..."
              className="bg-white border-2 border-gray-200 focus:border-gray-400 rounded-full"
              onChange={(e) => setSchoolYearFilter(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className="border-gray-300 text-gray-700"
            onClick={() => setShowUnarchiveByYearDialog(true)}
          >
            Unarchive by Year
          </Button>
        </div>
      </div>

      {!fetching ? (
        filteredStudents().length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-xl">
              <thead>
                <tr className="bg-gray-100 text-gray-900">
                  <th className="py-3 px-4 text-left">Avatar</th>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Gender</th>
                  <th className="py-3 px-4 text-left">School Year</th>
                  <th className="py-3 px-4 text-left">Progress</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents().map((student) => (
                  <tr
                    key={student._id}
                    className="border-t border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-2 px-4">
                      <img
                        src={
                          student.gender === "Male" ? "/boy.png" : "/girl.png"
                        }
                        alt={student.name}
                        className="rounded-full border-4 border-gray-200"
                        width={50}
                        height={50}
                      />
                    </td>
                    <td className="py-2 px-4">
                      <Link
                        to={`/profile/${student._id}`}
                        className="font-bold text-gray-900"
                      >
                        {[
                          student.firstName,
                          student.middleName,
                          student.lastName,
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      </Link>
                    </td>
                    <td className="py-2 px-4 text-gray-600">
                      {student.gender}
                    </td>
                    <td className="py-2 px-4 text-gray-600">
                      {student.schoolYear || "N/A"}
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {student.percentage
                            ? Math.round(student.percentage)
                            : "0"}
                          %
                        </span>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                          <div
                            className="h-2.5 rounded-full bg-gray-500"
                            style={{
                              width: `${
                                student.percentage ? student.percentage : 0
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex gap-2">
                        <Link to={`/answers/${student._id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-700"
                          >
                            View Results
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-green-600"
                          onClick={() => unarchiveUser(student._id)}
                        >
                          Unarchive
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-neutral-500">
            No archived students found
          </p>
        )
      ) : (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-60 rounded-xl w-full" />
          <Skeleton className="h-60 rounded-xl w-full" />
          <Skeleton className="h-60 rounded-xl w-full" />
        </div>
      )}

      <AlertDialog
        open={showUnarchiveByYearDialog}
        onOpenChange={setShowUnarchiveByYearDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unarchive Students by Year</AlertDialogTitle>
            <AlertDialogDescription>
              Enter the school year to unarchive all students from that year.
            </AlertDialogDescription>
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-700">
                School Year
              </label>
              <Input
                placeholder="e.g. 2023-2024"
                value={unarchiveYear}
                onChange={(e) => setUnarchiveYear(e.target.value)}
                className="mt-1"
              />
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-green-600 hover:bg-green-700"
              onClick={() => unarchiveBySchoolYear()}
            >
              Unarchive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
