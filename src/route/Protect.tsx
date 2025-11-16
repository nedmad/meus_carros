import { useContext, type ReactNode } from "react";
import { ContextAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function Protect({ children }: { children: ReactNode }) {
  const { signed, loading } = useContext(ContextAuth);

  if (loading) {
    return <>....</>;
  }
  if (!signed) {
    return <Navigate to={"/login"} />;
  }

  return children;
}
