import React from "react";
import { Toaster } from "sonner";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Zoos from "./pages/Zoos/Zoos";
import Admins from "./pages/Admins/Admins";
import Animals from "./pages/Animals/Animals";
import AddAdmin from "./pages/AddAdmin/AddAdmin";
import Spaces from "./pages/Spaces/Spaces";

const App: React.FC = () => {
  return (
    <div className="App">
      <Toaster position="bottom-left" theme="dark" richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/zoos" element={<Zoos />} />
          <Route path="/zoo/:zooId" element={<Admins />} />
          <Route path="/space/:spaceId/animals" element={<Animals />} />
          <Route path="/admins" element={<AddAdmin />} />
          <Route path="/spaces" element={<Spaces />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
