import { useAuth } from "./auth-provider";
import { Navigate } from "react-router-dom";

function ProtectedRoutes({ allowedRules, children }) {
  const { isAuth, currentUser } = useAuth();

  if (isAuth && !currentUser) {
    return null;
  }

  if (!isAuth || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Role not allowed
  if (!allowedRules.includes(currentUser.role)) {
    if(currentUser.role === 'student'){
      return <Navigate to="/activities" />;
    }else{
      return <Navigate to="/" />;
    }
  }

  return children;
}

export default ProtectedRoutes;
