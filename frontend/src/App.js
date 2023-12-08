import './App.css';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout/Layout"
import Home from "./pages/Home/Home"
import About from "./pages/About/About"
import ContractSelection from "./pages/ContractSelection/ContractSelection"
import BaseContract from './pages/BaseContract/BaseContract';

function App() {
  return (
    <>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="contract" element={<ContractSelection />} />
            <Route path="contract/base" element={<BaseContract />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
    
  );
}

export default App;
