import { createBrowserRouter } from "react-router";
import HomeLayout from "@/Layouts/HomeLayout/HomeLayout";
import Root from "@/Components/Root/Root";
import AuthLayout from "@/Layouts/AuthLayout/AuthLayout";
import Login from "@/Pages/Auth/Login/Login";
import Register from "@/Pages/Auth/Register/Register";
import ForgotPassword from "@/Pages/Auth/ForgotPassword/ForgotPassword";
import PrivateRoute from "@/Routes/PrivateRoute";
import DashboardLayout from "@/Layouts/DashboardLayout/DashboardLayout";
import ErrorPage from "@/Pages/ErrorPage/ErrorPage";
import DashboardHome from "@/Pages/DashboardHome/DashboardHome";
import MerchantRoute from "@/Routes/MerchantRoute";
import ManagePolicies from "@/Pages/Dashboard/Admin/ManagePolicies/ManagePolicies";
import AllPolicies from "@/Pages/Public/AllPolicies";
import PolicyDetails from "@/Pages/Public/PolicyDetails/PolicyDetails";
import Quotes from "@/Pages/Private/Quotes/Quotes";
import ApplicationForm from "@/Pages/Private/ApplicationForm/ApplicationForm";
import ManageUsers from "@/Pages/Dashboard/Admin/ManageUsers/ManageUsers";
import ManageApplications from "@/Pages/Dashboard/Admin/ManageApplications/ManageApplications";
import MyPolicies from "@/Pages/Dashboard/Customer/MyPolicies/MyPolicies";
import AssignedCustomers from "@/Pages/Dashboard/Merchant/AssignedCustomers/AssignedCustomers";
import { StripeProvider } from "@/Components/Stripe/StripeProvider";
import PaymentStatus from "@/Pages/Dashboard/Customer/PaymentStatus/PaymentStatus";
import PaymentPage from "@/Pages/Dashboard/Customer/PaymentPage/PaymentPage";
import PaymentSuccess from "@/Pages/Dashboard/Customer/PaymentPage/PaymentSuccess";
import ManageTransactions from "@/Pages/Dashboard/Admin/ManageTransactions/ManageTransactions";
import ClaimRequest from "@/Pages/Dashboard/Customer/ClaimRequest/ClaimRequest";



export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        index: true,
        Component: HomeLayout,
      },
      {
        path: "/policies",
        element: <AllPolicies></AllPolicies>,
      },
      {
        path: "/policies/:id",
        element: <PolicyDetails></PolicyDetails>,
      },
      {
        path: "/quotes/:id",
        element: (
          <PrivateRoute>
            <Quotes></Quotes>
          </PrivateRoute>
        ),
      },
      {
        path: "/apply/:id",
        element: (
          <PrivateRoute>
            <ApplicationForm></ApplicationForm>
          </PrivateRoute>
        ),
      },
      {
        path: "merchant/policies",
        element: <ManagePolicies />,
      },
      {
        path: "/dashboard/manage-users",
        element: <ManageUsers />,
      },
      {
        path: "/dashboard/manage-applications",
        element: <ManageApplications />,
      },
      {
        path: "/dashboard/my-policies",
        element: <MyPolicies></MyPolicies>,
      },
      {
        path: "/dashboard/assigned-customers",
        element: <AssignedCustomers></AssignedCustomers>,
      },
      {
        path: "/dashboard/payment-status",
        element: <PaymentStatus></PaymentStatus>,
      },

      {
        path: "/dashboard/payment",
        element: (
          <PrivateRoute>
            <StripeProvider>
              <PaymentPage />
            </StripeProvider>
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/payment-success",
        element: <PaymentSuccess></PaymentSuccess>,
      },
      {
         path:"/dashboard/manage-transactions",
         element:<ManageTransactions></ManageTransactions>
      },
      {
         path:"/dashboard/claim-reuest",
         element:<ClaimRequest></ClaimRequest>
      },
    ],
  },
  {
    path: "/auth",
    Component: AuthLayout,
    children: [
      {
        path: "/auth/login",
        Component: Login,
      },
      {
        path: "/auth/register",
        Component: Register,
      },
      {
        path: "/auth/forgot-password",
        Component: ForgotPassword,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      //   <PrivateRoute>
      <DashboardLayout></DashboardLayout>
      //   </PrivateRoute>
    ),
    children: [
      // Dashboard Home - Accessible to all authenticated users
      {
        index: true,
        element: <DashboardHome />,
      },

      // Merchant Routes (Manage Policies)
      {
        path: "merchant/policies",
        element: (
          //   <MerchantRoute>  //pore enable koris
          <ManagePolicies />
          //   </MerchantRoute>
        ),
      },
      // admin only routes
    ],
  },
  {
    path: "*",
    element: <ErrorPage></ErrorPage>,
  },
]);
