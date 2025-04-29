import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LayoutPage from '@/components/layout/layout'
import LoginPage from '@/pages/login'
import HomePage from '@/pages/home'
import ActivitiesPage from '@/pages/activities'
import AddQuizPage from '@/pages/add-activity'


function App() {
  return ( 
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />}  />
          <Route path="/" element={<LayoutPage />}>
            <Route index element={<HomePage />} />
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="/add-activity" element={<AddQuizPage />} />
          </Route>
        </Routes>
      </Router>
    </>
   );
}

export default App;