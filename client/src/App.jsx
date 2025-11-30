import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LayoutPage from "@/components/layout/layout";
import ProtectedRoutes from "./components/auth/protected-routes";
import LoginPage from "@/pages/login";
import HomePage from "@/pages/home";
import StudentsPage from "@/pages/students";
import ActivitiesPage from "@/pages/activities";
import TodoPage from "@/pages/todo";
import AddQuizPage from "@/pages/add-activity";
import AddTodoPage from "@/pages/add-todo";
import TakeQuizPage from "@/pages/take-quiz";
import StudentAnswers from "@/pages/student-answers";
import ProfilePage from "@/pages/profile";
import QuizResultPage from "@/pages/quiz-result";
import GradesPage from "./pages/grades";
import ArchivedStudentsPage from "@/pages/archived-students";

function App() {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/",
      element: (
        <ProtectedRoutes allowedRules={["teacher"]}>
          <LayoutPage />
        </ProtectedRoutes>
      ),
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: "students",
          element: <StudentsPage />,
        },
        {
          path: "grades",
          element: <GradesPage />,
        },
        {
          path: "archived-students",
          element: <ArchivedStudentsPage />,
        },
        {
          path: "add-activity",
          element: <AddQuizPage />,
        },
        {
          path: "add-todo",
          element: <AddTodoPage />,
        },
        {
          path: "answers/:id",
          element: <StudentAnswers />,
        },
        {
          path: "profile/:id",
          element: <ProfilePage />,
        },
      ],
    },
    {
      path: "/",
      element: (
        <ProtectedRoutes allowedRules={["student", "teacher"]}>
          <LayoutPage />
        </ProtectedRoutes>
      ),
      children: [
        {
          path: "activities",
          element: <ActivitiesPage />,
        },
        {
          path: "todo",
          element: <TodoPage />,
        },
        {
          path: "quiz/:id",
          element: <TakeQuizPage />,
        },
        {
          path: "result/:resultId",
          element: <QuizResultPage />,
        },
        {
          path: "profile",
          element: <ProfilePage />,
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
