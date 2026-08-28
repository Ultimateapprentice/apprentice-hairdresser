import { Routes, Route, Navigate } from "react-router-dom";

import { AppProvider } from "@/context/AppContext";

import Login from "@/pages/Login";
import Index from "@/pages/Index";
import AssesorDashboard from "@/pages/AssesorDashboard";
import EmployerDashboard from "@/pages/EmployerDashboard";

export default function App() {
    return (
        <AppProvider>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route path="/" element={<Index />} />

                <Route
                    path="/assessor"
                    element={<AssesorDashboard />}
                />

                <Route
                    path="/employer"
                    element={<EmployerDashboard />}
                />

                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />
            </Routes>
        </AppProvider>
    );
}