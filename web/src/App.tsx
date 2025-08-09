import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import OrdersPage from "./pages/OrdersPage";
import RequireRole from "./components/RequireRole";
import ChooseCar from "./pages/ChooseCar";
import Queue from "./pages/Queue";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/*Site manager */}
        <Route element={<RequireRole role="SITE_MANAGER" />}>
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/new" element={<PlaceOrder />} />
        </Route>

        {/*driver*/}
        <Route element={<RequireRole role="DRIVER" />}>
          <Route path="/choose-car" element={<ChooseCar />} />
          <Route path="/queue" element={<Queue />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}
