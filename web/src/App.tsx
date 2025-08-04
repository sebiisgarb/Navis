import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import OrdersPage from "./pages/OrdersPage";
import RequireRole from "./components/RequireRole";



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<RequireRole role="SITE_MANAGER" />}>
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/new" element={<PlaceOrder />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
