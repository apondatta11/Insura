import Loading from "@/Components/Loading/Loading";
import InsuranceLoader from "@/Components/Loading/Loading";
import useUserRole from "@/Hooks/useUserRole";
import { Navigate, useLocation } from "react-router";

const MerchantRoute = ({ children }) => {
  const { role, roleLoading } = useUserRole();
  const location = useLocation();

  if (roleLoading) {
    return (
      <Loading
        message="Loading Agent Workspace..."
        subMessage="Preparing customer management and policy tools"
        icon="users"
      ></Loading>
    );
  }

  if (role === "agent" || role === "admin") {
    return children;
  }

  return <Navigate to="/forbidden" state={{ from: location }} replace />;
};

export default MerchantRoute;
