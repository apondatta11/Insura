import Loading from "@/Components/Loading/Loading";
import useUserRole from "@/Hooks/useUserRole";
import { Navigate, useLocation } from "react-router";

const AdminRoute = ({ children }) => {
  const { role, roleLoading } = useUserRole();
  const location = useLocation();

  if (roleLoading) {
    console.log("🔄 Showing custom loading message");
    return (
      <Loading
        message="Accessing Admin Dashboard..."
        subMessage="Loading administrative tools and system controls"
        icon="shield"
      ></Loading>
    );
  }

  if (role === "admin") {
    return children;
  }

  return <Navigate to="/forbidden" state={{ from: location }} replace />;
};

export default AdminRoute;
