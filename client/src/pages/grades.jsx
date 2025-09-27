import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function GradesPage() {
  const [students, setStudents] = useState([]);
  const [fetching, setFetching] = useState(true);

  const getAllStudents = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_ENDPOINT}api/auth/total-grades`,
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

  return (
    <>
      <div className="bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 rounded-xl p-6 mb-8">
        <h1 className="text-3xl font-bold text-orange-400 mb-2">
          Student Grades
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
      </div>

      {!fetching ? (
        filteredStudents().length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-purple-200 rounded-xl">
              <thead>
                <tr className="bg-[#EACFFF] text-purple-900">
                  <th className="py-3 px-4 text-left">Avatar</th>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Todo Grade</th>
                  <th className="py-3 px-4 text-left">Acivities Grade</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents().map((student) => (
                  <tr
                    key={student._id}
                    className="border-t border-purple-100 hover:bg-purple-50"
                  >
                    <td className="py-2 px-4">
                      <img
                        src={
                          student.gender === "Male" ? "/boy.png" : "/girl.png"
                        }
                        alt={student.name}
                        className="rounded-full border-4 border-purple-200"
                        width={50}
                        height={50}
                      />
                    </td>
                    <td className="py-2 px-4">
                      <Link
                        to={`/profile/${student._id}`}
                        className="font-bold text-purple-900"
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
                    <td className="py-2 px-4">
                      {student.totalGradeTodo.toFixed(1)}
                    </td>
                    <td className="py-2 px-4">
                      {student.totalGradeActivities.toFixed(1)}
                    </td>
                    <td className="py-2 px-4">
                      <Link to={`/answers/${student._id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-purple-700"
                        >
                          View Results
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
    </>
  );
}
