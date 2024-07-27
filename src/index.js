import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Dashboard from "./Dashboard/dashboard";
import DashboardNew from "./Dashboard/dashboardNew";
import reportWebVitals from "./reportWebVitals";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "bootstrap/dist/css/bootstrap.css";
import axios from "axios";

const root = ReactDOM.createRoot(document.getElementById("root"));
// axios.defaults.baseURL = "http://localhost:9500/";
axios.defaults.baseURL = "https://c947-103-204-157-2.ngrok-free.app";
root.render(
  <React.StrictMode>
    <DashboardNew />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
