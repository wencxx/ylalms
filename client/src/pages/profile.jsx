import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  BookOpen,
  Brain,
  Calendar,
  ChevronRight,
  Venus,
  Mars,
  GraduationCap,
  LineChart,
  Medal,
  Rocket,
  Trophy,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
          badges: [
            {
              id: 1,
              name: "Math Master",
              icon: "🔢",
              color: "bg-blue-500",
              earned: "May 10, 2025",
            },
            {
              id: 2,
              name: "Science Explorer",
              icon: "🔬",
              color: "bg-green-500",
              earned: "April 28, 2025",
            },
            {
              id: 3,
              name: "Reading Star",
              icon: "📚",
              color: "bg-red-500",
              earned: "May 5, 2025",
            },
            {
              id: 4,
              name: "Perfect Score",
              icon: "🏆",
              color: "bg-yellow-500",
              earned: "May 2, 2025",
            },
            {
              id: 5,
              name: "7-Day Streak",
              icon: "🔥",
              color: "bg-orange-500",
              earned: "Today",
            },
          ],
          recentActivity: [...res.data.answers],
          subjects: [
            {
              id: 1,
              name: "Math",
              progress: 85,
              color: "bg-blue-500",
              icon: "🔢",
            },
            {
              id: 2,
              name: "Science",
              progress: 78,
              color: "bg-green-500",
              icon: "🔬",
            },
            {
              id: 3,
              name: "Reading",
              progress: 92,
              color: "bg-red-500",
              icon: "📚",
            },
            {
              id: 4,
              name: "Spelling",
              progress: 75,
              color: "bg-purple-500",
              icon: "🐝",
            },
            {
              id: 5,
              name: "Geography",
              progress: 68,
              color: "bg-yellow-500",
              icon: "🌍",
            },
          ],
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

  return (
    <>
      {/* Rainbow Header */}
      <div className="flex justify-center gap-1 mb-6">
        <div className="w-8 h-2 bg-red-500 rounded-full"></div>
        <div className="w-8 h-2 bg-orange-500 rounded-full"></div>
        <div className="w-8 h-2 bg-yellow-500 rounded-full"></div>
        <div className="w-8 h-2 bg-green-500 rounded-full"></div>
        <div className="w-8 h-2 bg-blue-500 rounded-full"></div>
        <div className="w-8 h-2 bg-indigo-500 rounded-full"></div>
        <div className="w-8 h-2 bg-pink-500 rounded-full"></div>
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

          <div className="flex flex-col gap-2 mt-4 md:mt-0">
            <Button className="bg-green-500 hover:bg-green-600">
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Stats & Subjects */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-2 border-blue-200 shadow-sm">
              <CardHeader className="pb-2 bg-blue-50">
                <CardTitle className="text-lg text-blue-700 flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Total Quizzes
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-3xl font-bold text-blue-600">
                  {student.recentActivity?.length}
                </p>
                <p className="text-sm text-gray-500">Quizzes completed</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 shadow-sm">
              <CardHeader className="pb-2 bg-green-50">
                <CardTitle className="text-lg text-green-700 flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Average Score
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-3xl font-bold text-green-600">{Math.ceil(student.averageScore)}%</p>
                <p className="text-sm text-gray-500">Across all quizzes</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-200 shadow-sm">
              <CardHeader className="pb-2 bg-orange-50">
                <CardTitle className="text-lg text-orange-700 flex items-center gap-2">
                  <Rocket className="h-5 w-5" />
                  Learning Streak
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-3xl font-bold text-orange-600">2 days</p>
                <p className="text-sm text-gray-500">Keep it going!</p>
              </CardContent>
            </Card>
          </div>

          {/* Subjects Progress */}
          {/* <Card className="border-2 border-purple-200 shadow-sm">
            <CardHeader className="pb-2 bg-purple-50">
              <CardTitle className="text-xl text-purple-700 flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Subject Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {student.subjects.map((subject) => (
                  <div key={subject.id} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{subject.icon}</span>
                        <span className="font-medium">{subject.name}</span>
                      </div>
                      <span className="text-sm font-medium">
                        {subject.progress}%
                      </span>
                    </div>
                    <Progress
                      value={subject.progress}
                      className={`h-2 ${subject.color}`}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card> */}

          {/* Recent Activity */}
          <Card className="border-2 border-blue-200 shadow-sm">
            <CardHeader className="pb-2 bg-blue-50">
              <CardTitle className="text-xl text-blue-700 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {student.recentActivity.map((activity) => (
                  <div
                    key={activity._id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                        activity.quizId?.type === "activity"
                          ? "bg-green-100"
                          : "bg-yellow-100"
                      }`}
                    >
                      🦁
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <p className="font-medium">
                          {activity.quizId?.activityName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {moment(activity.createdAt).format("lll")}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600">
                        Completed with score: {activity.score}/{activity.items}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link to="/student-activity">
                  <Button
                    variant="outline"
                    className="border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    View All Activity
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Achievements & Friends */}
        <div className="space-y-6">
          {/* Achievements/Badges */}
          <Card className="border-2 border-yellow-200 shadow-sm">
            <CardHeader className="pb-2 bg-yellow-50">
              <CardTitle className="text-xl text-yellow-700 flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-3">
                {student.badges.map((badge) => (
                  <div
                    key={badge.id}
                    className="flex flex-col items-center p-3 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div
                      className={`w-12 h-12 rounded-full ${badge.color} flex items-center justify-center mb-2`}
                    >
                      <span className="text-2xl">{badge.icon}</span>
                    </div>
                    <p className="text-sm font-medium text-center">
                      {badge.name}
                    </p>
                    <p className="text-xs text-gray-500">{badge.earned}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link to="/student-achievements">
                  <Button
                    variant="outline"
                    className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                  >
                    View All Badges
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Quizzes */}
          <Card className="border-2 border-red-200 shadow-sm">
            <CardHeader className="pb-2 bg-red-50">
              <CardTitle className="text-xl text-red-700 flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Learning Path
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <Tabs defaultValue="upcoming">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="recommended">Recommended</TabsTrigger>
                </TabsList>
                <TabsContent value="upcoming">
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg border border-blue-100 bg-blue-50">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🔢</span>
                        <span className="font-medium">Division Quiz</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Tomorrow at 3:00 PM
                      </p>
                    </div>
                    <div className="p-3 rounded-lg border border-green-100 bg-green-50">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🌱</span>
                        <span className="font-medium">Plant Life Cycles</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Wednesday at 2:00 PM
                      </p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="recommended">
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg border border-purple-100 bg-purple-50">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🦋</span>
                        <span className="font-medium">
                          Insect Classification
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Based on your interests
                      </p>
                    </div>
                    <div className="p-3 rounded-lg border border-yellow-100 bg-yellow-50">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🌍</span>
                        <span className="font-medium">World Geography</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Improve your geography skills
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <div className="mt-4 text-center">
                <Link to="/student-learning-path">
                  <Button
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-50"
                  >
                    View Full Schedule
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
