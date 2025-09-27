import {
    createBrowserRouter,
} from "react-router";
import HomeLayout from "@/Layouts/HomeLayout/HomeLayout";
import Root from "@/Components/Root/Root";
import AuthLayout from "@/Layouts/AuthLayout/AuthLayout";
import Login from "@/Pages/Auth/Login/Login";
import Register from "@/Pages/Auth/Register/Register";
import ForgotPassword from "@/Pages/Auth/ForgotPassword/ForgotPassword";
import PrivateRoute from "@/Routes/PrivateRoute";
import DashboardLayout from "@/Layouts/DashboardLayout/DashboardLayout";
import ErrorPage from "@/Pages/ErrorPage/ErrorPage";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: Root,
        children: [
            {
                index: true,
                Component: HomeLayout,
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
            }
        ]
    },
    {
        path: '/dashboard',
        element: <PrivateRoute>
            <DashboardLayout></DashboardLayout>
        </PrivateRoute>,
        children: [
            // admin only routes

        ]
    },
    {
        path: "*",
        element: <ErrorPage></ErrorPage>
    },
]);