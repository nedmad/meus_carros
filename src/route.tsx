import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/home/Home";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/dashboard/Dashboard";
import New from "./pages/dashboard/new/New";
import Car from "./pages/car/Car";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Protect from "./route/Protect";
import Update from "./pages/dashboard/update/Update";

export const route = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/dashboard",
        element: (
          <Protect>
            <Dashboard />
          </Protect>
        ),
      },
      {
        path: "/dashboard/new",
        element: (
          <Protect>
            <New />
          </Protect>
        ),
      },
      {
        path: "/dashboard/update/:id",
        element: (
          <Protect>
            <Update />
          </Protect>
        ),
      },
      {
        path: "/car/:id",
        element: <Car />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);
