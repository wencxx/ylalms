import DashboardCard from "@/components/dashboard/card";
import Chart from "@/components/dashboard/chart";
import axios from "axios";
import { BookOpen, GraduationCap, Mars, Users, Venus } from "lucide-react";
import { useEffect, useState } from "react";

function HomPage() {
  const [counts, setCounts] = useState({
    totalUser: 0,
    totalMale: 0,
    totalFemale: 0,
    totalActivities: 0,
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

      setCounts(res.data)
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
      title: "Total Male Students",
      value: counts.totalMale,
      icon: <Mars />,
    },
    {
      title: "Total Female Students",
      value: counts.totalFemale,
      icon: <Venus />,
    },
    {
      title: "Total Activities",
      value: counts.totalActivities,
      icon: <BookOpen />,
    },
  ];
  return (
    <>
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cardData.map((card, index) => (
            <DashboardCard key={index} {...card} />
          ))}
        </div>
        <div>
          <Chart />
        </div>
      </div>
    </>
  );
}

export default HomPage;
