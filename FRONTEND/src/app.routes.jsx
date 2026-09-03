import {createBrowserRouter} from "react-router";
import Login from "./Features/auth/pages/Login";
import Register from "./Features/auth/pages/Register";


export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  }
])
