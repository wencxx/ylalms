import DashboardCard from "@/components/dashboard/card";
import Chart from "@/components/dashboard/chart";
import { BookOpen, GraduationCap, Users } from "lucide-react";

const cardData = [
    {
        title: "Total Students",
        value: "+500",
        description: "+500 from last month",
        icon: <GraduationCap />,
    },
    {
        title: "Total Activities",
        value: "+20",
        description: "+5 from last month",
        icon: <BookOpen />,
    },
    {
        title: "Total Basta",
        value: "+10",
        description: "+2 from last month",
        icon: <Users />,
    }
]

function HomPage() {

    return (
        <>
            <div className="space-y-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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