import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  BookOpen,
  Calendar,
  Venus,
  Mars,
  LineChart,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import moment from "moment";
import { useAuth } from "@/components/auth/auth-provider";

function ProfilePage() {
  const { id } = useParams();
  const { currentUser } = useAuth();

  const studentID = id || currentUser._id;

  const [student, setStudentDetails] = useState(null);

  const getUserDetails = async () => {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_ENDPOINT
        }api/auth/get-specific-user/${studentID}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          validateStatus: (status) => status < 500,
        }
      );

      if (res.status === 200) {
        const studentData = {
          ...res.data.user,
          averageScore: res.data.averageScore,
          activities: [...res.data.activities],
          todos: [...res.data.todos],
        };

        setStudentDetails(studentData);
      } else {
        setStudentDetails({});
        toast.error(res.data);
      }
    } catch (error) {
      toast.error(error.response.data || "Failed to get user details");
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  if (!student) return <div>Loading...</div>;

  const attempts = (submittedUsers) => {
    const currentUserAttempts = submittedUsers.find(
      (c) => String(c.id) == studentID
    );

    return `${currentUserAttempts.attempt}/3`;
  };

  return (
    <>
      {/* Rainbow Header */}
      <div className="flex justify-center gap-1 mb-6">
        <div className="w-8 h-2 bg-[#FFEDA9] rounded-full"></div>
        <div className="w-8 h-2 bg-[#AAE9E5] rounded-full"></div>
        <div className="w-8 h-2 bg-[#87C7F1] rounded-full"></div>
        <div className="w-8 h-2 bg-[#EACFFF] rounded-full"></div>
        <div className="w-8 h-2 bg-[#FEB7D3] rounded-full"></div>
      </div>

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded-xl p-6 mb-6 shadow-md">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img
                src={student?.gender === "Male" ? "/boy.png" : "/girl.png"}
                alt={student?.firstName}
                width={128}
                height={128}
                className="object-cover"
              />
            </div>
            <div
              className={`absolute -bottom-1 right-0 rounded-full p-2 shadow-md ${
                student?.gender === "Male" ? "bg-blue-400" : "bg-pink-400"
              }`}
            >
              {student?.gender === "Male" ? (
                <Mars className="h-5 w-5 text-white" />
              ) : (
                <Venus className="h-5 w-5 text-white" />
              )}
            </div>
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
              {[student.firstName, student.middleName, student.lastName]
                .filter(Boolean)
                .join(" ")}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
              <Badge className="bg-blue-500 hover:bg-blue-600">
                {student?.gender}
              </Badge>
              <Badge className="bg-orange-500 hover:bg-orange-600">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>
                    Birthday: {moment(student?.birthday).format("ll")}
                  </span>
                </div>
              </Badge>
            </div>
          </div>

          <div className="flex-grow"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Stats & Subjects */}
        <div className="lg:col-span-3 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-2 border-[#87C7F1] shadow-sm">
              <CardHeader className="pb-2 bg-blue-50">
                <CardTitle className="text-lg text-blue-700 flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Total Activities
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-3xl font-bold text-blue-600">
                  {student.activities?.length}
                </p>
                <p className="text-sm text-gray-500">Activities completed</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-[#FFEDA9] shadow-sm">
              <CardHeader className="pb-2 bg-blue-50">
                <CardTitle className="text-lg text-yellow-500 flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Total Todos
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-3xl font-bold text-yellow-400">
                  {student.todos?.length}
                </p>
                <p className="text-sm text-gray-500">Todos completed</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#AAE9E5] shadow-sm">
              <CardHeader className="pb-2 bg-green-50">
                <CardTitle className="text-lg text-green-700 flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Average Score
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-3xl font-bold text-green-600">
                  {Math.ceil(student.averageScore)}%
                </p>
                <p className="text-sm text-gray-500">Across all quizzes</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="border-2 border-blue-200 shadow-sm">
            <CardHeader className="pb-2 bg-blue-50">
              <CardTitle className="text-xl text-blue-700 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Completed Activities
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {student.activities.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left border">
                    <thead>
                      <tr className="bg-blue-100">
                        <th className="px-4 py-2 font-medium">Activity Name</th>
                        <th className="px-4 py-2 font-medium">Type</th>
                        <th className="px-4 py-2 font-medium">Score</th>
                        <th className="px-4 py-2 font-medium">Attempts</th>
                        <th className="px-4 py-2 font-medium">Date</th>
                        <th className="px-4 py-2 font-medium"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {student.activities.map((activity) => (
                        <tr
                          key={activity._id}
                          className="border-b hover:bg-gray-50 capitalize"
                        >
                          <td className="px-4 py-2">
                            {activity.quizId?.activityName}
                          </td>
                          <td className="px-4 py-2">{activity.quizId?.type}</td>
                          <td className="px-4 py-2">
                            {activity.score}/{activity.items}
                          </td>
                          <td className="px-4 py-2">
                            {attempts(activity.quizId?.submittedUser)}
                          </td>
                          <td className="px-4 py-2">
                            {moment(activity.createdAt).format("lll")}
                          </td>
                          <td className="px-4 py-2 text-violet-600">
                            <Link to={`/result/${activity._id}`}>Review</Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center">No completed activities</p>
              )}
            </CardContent>
          </Card>
          {/* Recent Todo */}
          <Card className="border-2 border-blue-200 shadow-sm">
            <CardHeader className="pb-2 bg-blue-50">
              <CardTitle className="text-xl text-blue-700 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Completed Todo's
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {student.todos.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left border">
                    <thead>
                      <tr className="bg-yellow-100">
                        <th className="px-4 py-2 font-medium">Activity Name</th>
                        <th className="px-4 py-2 font-medium">Type</th>
                        <th className="px-4 py-2 font-medium">Score</th>
                        <th className="px-4 py-2 font-medium">Attempts</th>
                        <th className="px-4 py-2 font-medium">Date</th>
                        <th className="px-4 py-2 font-medium"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {student.todos.map((todo) => (
                        <tr
                          key={todo._id}
                          className="border-b hover:bg-gray-50 capitalize"
                        >
                          <td className="px-4 py-2">
                            {todo.quizId?.activityName}
                          </td>
                          <td className="px-4 py-2">{todo.quizId?.type}</td>
                          <td className="px-4 py-2">
                            {todo.score}/{todo.items}
                          </td>
                          <td className="px-4 py-2">
                            {attempts(todo.quizId?.submittedUser)}
                          </td>
                          <td className="px-4 py-2">
                            {moment(todo.createdAt).format("lll")}
                          </td>
                          <td className="px-4 py-2 text-violet-600">
                            <Link to={`/result/${todo._id}`}>Review</Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center">No completed todo's</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
