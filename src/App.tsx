import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import Landing from './pages/Landing';
import SelectSlot from './pages/SelectSlot';
import Checkout from './pages/Checkout';
import CustomCheckout from './pages/CustomCheckout';
import AdminDashboard from './pages/admin/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/espacios" element={<SelectSlot />} />
          <Route path="/checkout/:size" element={<Checkout />} />
          <Route path="/pago/:linkId" element={<CustomCheckout />} />
        </Route>
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
