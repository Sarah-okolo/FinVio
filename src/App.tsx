import { BrowserRouter, Route, Routes } from "react-router-dom";
import Invoices from "./pages/invoices";
import MainLayout from "./pages/mainLayout";
import ViewInvoice from "./pages/viewInvoice";
import ProfilePage from "./pages/profilePage";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import AuthLayout from "./pages/auth/layout";
import { ProtectedRoute } from "./components/protectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Invoices />} />
            <Route path="/invoice/:id" element={<ViewInvoice />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
