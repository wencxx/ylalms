import { Award, BookOpen, CheckCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { useEffect, useState } from "react";
import moment from "moment";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentAnswers() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [quizResults, setQuizResults] = useState([]);

  const fetchAnswers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_ENDPOINT}api/activity/get-answers/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          validateStatus: (status) => status < 500,
        }
      );

      if (res.status === 200) {
        setQuizResults(res.data);
      }
    } catch (error) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnswers();
  }, []);

  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-sky-600 mb-2">
          Student Quiz Results
        </h1>
        <div className="flex justify-center gap-1 mb-2">
          <div className="w-8 h-2 bg-red-500 rounded-full"></div>
          <div className="w-8 h-2 bg-orange-500 rounded-full"></div>
          <div className="w-8 h-2 bg-yellow-500 rounded-full"></div>
          <div className="w-8 h-2 bg-green-500 rounded-full"></div>
          <div className="w-8 h-2 bg-blue-500 rounded-full"></div>
          <div className="w-8 h-2 bg-indigo-500 rounded-full"></div>
          <div className="w-8 h-2 bg-pink-500 rounded-full"></div>
        </div>
        {/* <p className="text-gray-600">
          Great job on your quizzes! Here are your results.
        </p> */}
      </div>
      {loading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 w-full">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-96 w-full rounded-xl" />
          ))}
        </div>
      ) : quizResults.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizResults.map((quizResults) => (
            <Card
              key={quizResults._id}
              className="overflow-hidden border-2 border-blue-200 hover:shadow-lg transition-shadow"
            >
              <CardHeader className="bg-gradient-to-r from-blue-100 to-cyan-100 pt-2">
                <div className="flex justify-between items-center">
                  <p className="text-xl font-bold text-blue-700 flex items-center gap-2 capitalize">
                    {quizResults.quizId.type} -{" "}
                    {quizResults.quizId?.activityName}
                  </p>
                  <div className="bg-yellow-100 rounded-full p-2 flex items-center justify-center">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-400" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
                    <BookOpen className="h-5 w-5 text-blue-500 mb-1" />
                    <p className="text-sm text-gray-500 capitalize">
                      {quizResults.quizId.type} Type
                    </p>
                    <p className="font-medium text-blue-700 capitalize">
                      {quizResults.quizId.activityType}
                    </p>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500 mb-1" />
                    <p className="text-sm text-gray-500">Questions</p>
                    <p className="font-medium text-green-700">
                      {quizResults.items} items
                    </p>
                  </div>
                </div>

                <div className="mt-4 bg-blue-50 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Score</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {quizResults.score}/{quizResults.items}
                    </p>
                  </div>
                  <div className="relative h-16 w-16">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Award className="h-10 w-10 text-yellow-500" />
                    </div>
                    <svg
                      className="h-16 w-16 transform -rotate-90"
                      viewBox="0 0 100 100"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="10"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke={
                          quizResults.score / quizResults.items >= 0.75
                            ? "#10b981"
                            : quizResults.score / quizResults.items >= 0.5
                            ? "#f59e0b"
                            : "#ef4444"
                        }
                        strokeWidth="10"
                        strokeDasharray={`${
                          (quizResults.score / quizResults.items) * 251.2
                        } 251.2`}
                      />
                    </svg>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-4 text-center">
                  Completed on {moment(quizResults.createdAt).format("lll")}
                </p>
                <p className="text-xs text-center text-violet-600 mt-2">
                  <Link to={`/result/${quizResults._id}`}>View Details</Link>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div>
          <p className="text-center w-full">No answers found</p>
        </div>
      )}
    </>
  );
}
