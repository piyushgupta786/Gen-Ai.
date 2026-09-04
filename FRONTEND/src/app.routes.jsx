import { createBrowserRouter } from "react-router-dom";
import Login from "./Features/auth/pages/Login";
import Register from "./Features/auth/pages/Register";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login/>
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  }
])
