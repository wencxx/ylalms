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

function App() {
  
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/",
      element: (
        <ProtectedRoutes allowedRules={['teacher']}>
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
        }
      ],
    },
    {
      path: "/",
      element: (
        <ProtectedRoutes allowedRules={['student', 'teacher']}>
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
