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
import PolicyClearance from "@/Pages/Dashboard/Merchant/PolicyClearance/PolicyClearance";
import ManageBlogs from "@/Pages/Dashboard/Shared/ManageBlogs/ManageBlogs";
import Profile from "@/Pages/Dashboard/Shared/ProfilePage/Profile";
import AdminRoute from "@/Routes/AdminRoute";
import CustomerRoute from "@/Routes/CustomerRoute";
import Blog from "@/Pages/Public/Blog/Blog";
import BlogDetails from "@/Pages/Public/Blog/BlogDetails";

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
  path: "/blog",
  element: <Blog />,
},
{
  path: "/blog/:id",
  element: <BlogDetails />,
},
    //   {
    //     path: "merchant/policies",
    //     element: <ManagePolicies />,
    //   },
    //   {
    //     path: "/dashboard/manage-users",
    //     element: <ManageUsers />,
    //   },
    //   {
    //     path: "/dashboard/manage-applications",
    //     element: <ManageApplications />,
    //   },
    //   {
    //     path: "/dashboard/my-policies",
    //     element: <MyPolicies></MyPolicies>,
    //   },
    //   {
    //     path: "/dashboard/assigned-customers",
    //     element: <AssignedCustomers></AssignedCustomers>,
    //   },
    //   {
    //     path: "/dashboard/payment-status",
    //     element: <PaymentStatus></PaymentStatus>,
    //   },

    //   {
    //     path: "/dashboard/payment",
    //     element: (
    //       <PrivateRoute>
    //         <StripeProvider>
    //           <PaymentPage />
    //         </StripeProvider>
    //       </PrivateRoute>
    //     ),
    //   },
    //   {
    //     path: "/dashboard/payment-success",
    //     element: <PaymentSuccess></PaymentSuccess>,
    //   },
    //   {
    //     path: "/dashboard/manage-transactions",
    //     element: <ManageTransactions></ManageTransactions>,
    //   },
    //   {
    //     path: "/dashboard/claim-reuest",
    //     element: <ClaimRequest></ClaimRequest>,
    //   },
    //   {
    //     path: "/dashboard/policy-clearance",
    //     element: <PolicyClearance></PolicyClearance>,
    //   },
    //   {
    //     path: "/dashboard/manage-blogs",
    //     element: <ManageBlogs></ManageBlogs>,
    //   },
    //   {
    //     path: "/dashboard/profile",
    //     element: <Profile></Profile>,
    //   },
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
      <PrivateRoute>
        <DashboardLayout></DashboardLayout>
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Profile></Profile>,
      },
      {
        path: "profile",
        element: <Profile></Profile>,
      },

      // Customer Routes
      {
        path: "my-policies",
        element: (
          <CustomerRoute>
            <MyPolicies></MyPolicies>
          </CustomerRoute>
        ),
      },
      {
        path: "claim-request",
        element: (
          <CustomerRoute>
            <ClaimRequest></ClaimRequest>
          </CustomerRoute>
        ),
      },
      {
        path: "payment-status",
        element: (
          <CustomerRoute>
            <PaymentStatus></PaymentStatus>
          </CustomerRoute>
        ),
      },
      {
        path: "payment",
        element: (
          <StripeProvider>
            <PaymentPage />
          </StripeProvider>
        ),
      },
      {
        path: "payment-success",
        element: (
          <CustomerRoute>
            <PaymentSuccess></PaymentSuccess>
          </CustomerRoute>
        ),
      },

      // Merchant Routes
      {
        path: "assigned-customers",
        element: (
          <MerchantRoute>
            <AssignedCustomers></AssignedCustomers>
          </MerchantRoute>
        ),
      },
      {
        path: "policy-clearance",
        element: (
          <MerchantRoute>
            <PolicyClearance></PolicyClearance>
          </MerchantRoute>
        ),
      },
      {
        path: "manage-blogs",
        element: (
          <MerchantRoute>
            <ManageBlogs></ManageBlogs>
          </MerchantRoute>
        ),
      },

      // admin only routes

      {
        path: "manage-applications",
        element: (
          <AdminRoute>
            <ManageApplications />,
          </AdminRoute>
        ),
      },
      {
        path: "manage-users",
        element: (
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        ),
      },
      {
        path: "manage-policies",
        element: (
          <AdminRoute>
            <ManagePolicies />
          </AdminRoute>
        ),
      },
      {
        path: "manage-transactions",
        element: (
          <AdminRoute>
            <ManageTransactions></ManageTransactions>
          </AdminRoute>
        ),
      },
    //   {
    //     path: "manage-blogs",
    //     element: (
    //       <AdminRoute>
    //         <ManageBlogs></ManageBlogs>
    //       </AdminRoute>
    //     ),
    //   },
    ],
  },
  {
    path: "*",
    element: <ErrorPage></ErrorPage>,
  },
]);

// In Router.jsx - Restructure like this:

//heheh

// export const router = createBrowserRouter([
//   {
//     path: "/",
//     Component: Root,
//     children: [
//       {
//         index: true,
//         Component: HomeLayout,
//       },
//       {
//         path: "/policies",
//         element: <AllPolicies />,
//       },
//       {
//         path: "/policies/:id",
//         element: <PolicyDetails />,
//       },
//       // ... other public routes
//     ],
//   },
//   {
//     path: "/auth",
//     Component: AuthLayout,
//     children: [
//       {
//         path: "login",
//         Component: Login,
//       },
//       {
//         path: "register",
//         Component: Register,
//       },
//       {
//         path: "forgot-password",
//         Component: ForgotPassword,
//       },
//     ],
//   },
//   {
//     path: "/dashboard",
//     element: (
//       <PrivateRoute>
//         <DashboardLayout />
//       </PrivateRoute>
//     ),
//     children: [
//       {
//         index: true,
//         element: <DashboardHome />,
//       },
//       // Admin Routes
//       {
//         path: "manage-applications",
//         element: (
//           <AdminRoute>
//             <ManageApplications />
//           </AdminRoute>
//         ),
//       },
//       {
//         path: "manage-users",
//         element: (
//           <AdminRoute>
//             <ManageUsers />
//           </AdminRoute>
//         ),
//       },
//       // Agent Routes
//       {
//         path: "assigned-customers",
//         element: (
//           <MerchantRoute>
//             <AssignedCustomers />
//           </MerchantRoute>
//         ),
//       },
//       {
//         path: "policy-clearance",
//         element: (
//           <MerchantRoute>
//             <PolicyClearance />
//           </MerchantRoute>
//         ),
//       },
//       // Customer Routes
//       {
//         path: "my-policies",
//         element: <MyPolicies />,
//       },
//       {
//         path: "payment-status",
//         element: <PaymentStatus />,
//       },
//       // Shared Routes (All authenticated users)
//       {
//         path: "profile",
//         element: <Profile />,
//       },
//       {
//         path: "manage-blogs",
//         element: <ManageBlogs />,
//       },
//     ],
//   },
//   // Private routes outside dashboard
//   {
//     path: "/quotes/:id",
//     element: (
//       <PrivateRoute>
//         <Quotes />
//       </PrivateRoute>
//     ),
//   },
//   {
//     path: "/apply/:id",
//     element: (
//       <PrivateRoute>
//         <ApplicationForm />
//       </PrivateRoute>
//     ),
//   },
//   {
//     path: "*",
//     element: <ErrorPage />,
//   },
// ]);
