import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

function DashboardCard({ title, value, description, icon }) {
    return (
        <>
            <Card>
                <CardDescription className="px-4 flex justify-between items-center font-semibold">
                    {title}
                    {icon}
                </CardDescription>
                <CardContent>
                    <p className="text-4xl font-bold">{value}</p>   
                    <p className="text-xs text-neutral-600">{description}</p> 
                </CardContent>
            </Card>
        </>
    );
}

export default DashboardCard;