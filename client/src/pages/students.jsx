import { Search } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Sample student data - replace with your actual data source
const students = [
    {
        id: 1,
        name: "Alex Johnson",
        grade: "3rd Grade",
        avatar: "/placeholder.svg?height=80&width=80",
        status: "Active",
        lastActive: "Today",
        progress: 78,
    },
    {
        id: 2,
        name: "Sophia Williams",
        grade: "2nd Grade",
        avatar: "/placeholder.svg?height=80&width=80",
        status: "Active",
        lastActive: "Yesterday",
        progress: 92,
    },
    {
        id: 3,
        name: "Ethan Brown",
        grade: "4th Grade",
        avatar: "/placeholder.svg?height=80&width=80",
        status: "Inactive",
        lastActive: "3 days ago",
        progress: 45,
    },
    {
        id: 4,
        name: "Olivia Davis",
        grade: "1st Grade",
        avatar: "/placeholder.svg?height=80&width=80",
        status: "Active",
        lastActive: "Today",
        progress: 85,
    },
    {
        id: 5,
        name: "Noah Miller",
        grade: "3rd Grade",
        avatar: "/placeholder.svg?height=80&width=80",
        status: "Active",
        lastActive: "Today",
        progress: 67,
    },
    {
        id: 6,
        name: "Emma Wilson",
        grade: "2nd Grade",
        avatar: "/placeholder.svg?height=80&width=80",
        status: "Inactive",
        lastActive: "1 week ago",
        progress: 23,
    },
]

export default function StudentsPage() {
    return (
        <>
            <div className="bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 rounded-xl p-6 mb-8">
                <h1 className="text-3xl font-bold text-purple-800 mb-2">My Awesome Students</h1>
                <p className="text-purple-600">See how your students are doing and track their progress!</p>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                <div className="relative w-full md:w-auto flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                        placeholder="Find a student..."
                        className="pl-10 bg-white border-2 border-purple-200 focus:border-purple-400 rounded-full"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button className="bg-green-500 hover:bg-green-600">Add Student</Button>
                    <Button variant="outline" className="border-purple-300 text-purple-700">
                        Export List
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {students.map((student) => (
                    <Card
                        key={student.id}
                        className="overflow-hidden border-2 border-purple-100 hover:border-purple-300 transition-all duration-300"
                    >
                        <div className={`h-2 ${student.status === "Active" ? "bg-green-400" : "bg-gray-300"}`}></div>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <img
                                        src={student.avatar || "/placeholder.svg"}
                                        alt={student.name}
                                        className="rounded-full border-4 border-purple-200"
                                        width={80}
                                        height={80}
                                    />
                                    <div
                                        className="absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-white"
                                        style={{
                                            backgroundColor: student.status === "Active" ? "#10b981" : "#9ca3af",
                                        }}
                                    ></div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-purple-900">{student.name}</h3>
                                    <p className="text-purple-600">{student.grade}</p>
                                    <p className="text-sm text-gray-500">Last active: {student.lastActive}</p>
                                </div>
                            </div>

                            <div className="mt-4">
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Progress</span>
                                    <span className="font-medium">{student.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className="h-2.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
                                        style={{ width: `${student.progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-purple-50 flex justify-between">
                            <Button variant="ghost" size="sm" className="text-purple-700">
                                View Details
                            </Button>
                            <Link to={`/students/${student.id}/assignments`}>
                                <Button variant="ghost" size="sm" className="text-purple-700">
                                    Assignments
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </>
    )
}
