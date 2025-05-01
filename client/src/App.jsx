import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LayoutPage from '@/components/layout/layout'
import LoginPage from '@/pages/login'
import HomePage from '@/pages/home'
import StudentsPage from '@/pages/students'
import ActivitiesPage from '@/pages/activities'
import AddQuizPage from '@/pages/add-activity'
import TakeQuizPage from '@/pages/take-quiz'


function App() {
  return ( 
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />}  />
          <Route path="/" element={<LayoutPage />}>
            <Route index element={<HomePage />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="/add-activity" element={<AddQuizPage />} />
            <Route path="/quiz/:id" element={<TakeQuizPage />} />
          </Route>
        </Routes>
      </Router>
    </>
   );
}

export default App;