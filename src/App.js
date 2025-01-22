import React from "react";
import RoutesApp from "./routes/routes";
import { BrowserRouter } from "react-router-dom";
import { ToastProvider } from "./components/toast";

function App() {
  return (
    <BrowserRouter>
      <RoutesApp />
      <ToastProvider />
    </BrowserRouter>
  );
}

export default App;
