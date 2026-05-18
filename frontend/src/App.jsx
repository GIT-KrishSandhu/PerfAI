import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddEmployee from "./pages/AddEmployee";
import EmployeeList from "./pages/EmployeeList";
import AIRecommendations from "./pages/AIRecommendations";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={
          <PrivateRoute><Navbar /><Dashboard /></PrivateRoute>
        } />
        <Route path="/add-employee" element={
          <PrivateRoute><Navbar /><AddEmployee /></PrivateRoute>
        } />
        <Route path="/employees" element={
          <PrivateRoute><Navbar /><EmployeeList /></PrivateRoute>
        } />
        <Route path="/ai-recommendations" element={
          <PrivateRoute><Navbar /><AIRecommendations /></PrivateRoute>
        } />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;