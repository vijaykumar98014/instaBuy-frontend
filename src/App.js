import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Home from "./pages/Home/Home";
import Inventory from "./pages/Inventory/Inventory";
import Cart from "./pages/Cart/Cart";
import Orders from "./pages/Orders/Orders";

function App() {
  return (
    <BrowserRouter>
      <Routes>
         <Route path="/" element={<Signup />} />
         <Route path="/login" element={<Login/>} />
        <Route path="/home" element={<Home />} />
        <Route path="/inventory" element={<Inventory />} />
       

         <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;