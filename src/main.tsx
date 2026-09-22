import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource-variable/manrope";
import "@fontsource/dm-mono/latin-400.css";
import "@fontsource/instrument-serif/latin-400-italic.css";
import App from "./App";
import "./styles.css";
import "./readability.css";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
