import "./App.css";
import Navber from "./components/Navber/Navber";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout/Layout.jsx";
import Login from "./components/Login/Login.jsx";
import Register from "./components/Register/Register.jsx";
import NotFound from "./components/NotFound/NotFound.jsx";
import Home from "./components/Home/Home.jsx";
import Profile from "./components/Profile/Profile.jsx";
import ProtectedRoute from "./components/protectedRoute/protectedRoute.jsx";
import ProtectedAuth from "./components/protectedAuth/protectedAuth.jsx";
import PostDetails from "./components/postDetails/postDetails.jsx";

function App() {
  const routes = createBrowserRouter([
    {
      path: "", element: <Layout />, children: [
        { path: "", element: <ProtectedRoute><Home /></ProtectedRoute> },
        { path: "Profile/:id", element: <ProtectedRoute><Profile /></ProtectedRoute> },
        { path: "login", element: <ProtectedAuth><Login /></ProtectedAuth> },
        { path: "register", element: <ProtectedAuth><Register /></ProtectedAuth> },
        { path: "postDetails/:id", element: <ProtectedRoute><PostDetails /></ProtectedRoute> },
        { path: "*", element: < NotFound /> },
      ]
    }
  ])
  return (
    <>
      <RouterProvider router={routes} />
    </>
  );
}

export default App;
