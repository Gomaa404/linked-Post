import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "@/components/Layout/Layout.jsx";
import AuthLayout from "@/components/Layout/AuthLayout.jsx";
import Home from "@/components/Home/Home.jsx";
import Explore from "@/components/Explore/Explore.jsx";
import Bookmarks from "@/components/Bookmarks/Bookmarks.jsx";
import Notifications from "@/components/Notifications/Notifications.jsx";
import Profile from "@/components/Profile/Profile.jsx";
import PostDetails from "@/components/postDetails/postDetails.jsx";
import Login from "@/components/Login/Login.jsx";
import Register from "@/components/Register/Register.jsx";
import NotFound from "@/components/NotFound/NotFound.jsx";
import ProtectedRoute from "@/components/protectedRoute/protectedRoute.jsx";
import ProtectedAuth from "@/components/protectedAuth/protectedAuth.jsx";

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: "login", element: <ProtectedAuth><Login /></ProtectedAuth> },
      { path: "register", element: <ProtectedAuth><Register /></ProtectedAuth> },
    ],
  },
  {
    path: "",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: "explore", element: <Explore /> },
      { path: "bookmarks", element: <Bookmarks /> },
      { path: "notifications", element: <Notifications /> },
      { path: "profile/:id", element: <Profile /> },
      { path: "postDetails/:id", element: <PostDetails /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
