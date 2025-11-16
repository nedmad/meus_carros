import { RouterProvider } from "react-router-dom";
import { route } from "./route";
import AuthProvider from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" reverseOrder={false} />;
      <RouterProvider router={route} />
    </AuthProvider>
  );
}

export default App;
