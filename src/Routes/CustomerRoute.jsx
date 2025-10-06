import Loading from "@/Components/Loading/Loading";
import useUserRole from "@/Hooks/useUserRole";
import { Navigate, useLocation } from "react-router";

const CustomerRoute = ({ children }) => {
  const { role, roleLoading } = useUserRole();
  const location = useLocation();

  if (roleLoading) {
    return (
      <Loading
        message="Securing Your Customer Portal..."
        subMessage="Verifying your access to personal insurance features"
        icon="userCheck"
      ></Loading>
    );
  }
  if (role === "customer") {
    return children;
  }
  return <Navigate to="/forbidden" state={{ from: location }} replace />;
};

export default CustomerRoute;
