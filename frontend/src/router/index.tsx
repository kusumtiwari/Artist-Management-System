import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import DashboardPage from "../pages/dashboard";
import ProtectedRoute from "./protected-route";
import GuestRoute from "./guest-route";
import ArtistMusicPage from "../pages/music";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/artist/:id/songs"
          element={
            <ProtectedRoute>
              <ArtistMusicPage/>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
