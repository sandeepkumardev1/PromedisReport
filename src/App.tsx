import { useSelector } from "react-redux";
import "./App.css";
import Login from "./pages/Login";
import { Navigate, Route, Routes } from "react-router-dom";
import Reports from "./pages/Reports";

function App() {
  const userData = useSelector((state:any) => state.auth?.userData);

  return (
    <Routes>
       <Route
          path="/"
          element={userData ? <Navigate to="/reports"/> : <Login />}
        />  
        <Route
          path="/reports"
          element={
            userData ? <Reports /> : <Navigate to="/" />
          }
        />
    </Routes>
  );
}

export default App;
