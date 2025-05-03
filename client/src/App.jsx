import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LayoutPage from "@/components/layout/layout";
import LoginPage from "@/pages/login";
import HomePage from "@/pages/home";
import StudentsPage from "@/pages/students";
import ActivitiesPage from "@/pages/activities";
import AddQuizPage from "@/pages/add-activity";
import TakeQuizPage from "@/pages/take-quiz";

function App() {

  const router = createBrowserRouter([
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/",
      element: <LayoutPage />,
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
          path: "activities",
          element: <ActivitiesPage />,
        },
        {
          path: "add-activity",
          element: <AddQuizPage />,
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
