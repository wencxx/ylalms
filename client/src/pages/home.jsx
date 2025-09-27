import DashboardCard from "@/components/dashboard/card";
import Chart from "@/components/dashboard/chart";
import axios from "axios";
import { BookOpen, GraduationCap, Mars } from "lucide-react";
import { useEffect, useState } from "react";

function HomPage() {
  const [counts, setCounts] = useState({
    totalUser: 0,
    totalMale: 0,
    totalFemale: 0,
    totalActivities: 0,
    totalTodo: 0,
    chartData: {},
  });

  const fetchCount = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_ENDPOINT}api/activity/count-dashboard`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCounts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCount();
  }, []);

  const cardData = [
    {
      title: "Total Students",
      value: counts.totalUser,
      icon: <GraduationCap />,
    },
    {
      title: "Total Activities",
      value: counts.totalActivities,
      icon: <BookOpen />,
    },
    {
      title: "Total Todo's",
      value: counts.totalTodo,
      icon: <BookOpen />,
    },
  ];
  return (
    <>
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cardData.map((card, index) => (
            <DashboardCard key={index} {...card} />
          ))}
        </div>
        <div className="space-y-4">
          <Chart chartData={counts.chartData.todo} type="todo" />
          <Chart chartData={counts.chartData.activity} type="activities" />
        </div>
      </div>
    </>
  );
}

export default HomPage;
