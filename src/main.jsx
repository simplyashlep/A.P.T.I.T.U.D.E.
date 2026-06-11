import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./App.css";

// Global error handlers to surface runtime errors into the app root
window.addEventListener('error', (ev) => {
  try {
    const root = document.getElementById('root');
    const msg = ev && (ev.error && (ev.error.stack || ev.error.message) || ev.message) || String(ev);
    if (root) root.innerText = `Runtime error:\n${msg}`;
    // still log to console
    console.error(ev.error || ev.message || ev);
  } catch (e) {
    console.error('Error while reporting error', e);
  }
});

window.addEventListener('unhandledrejection', (ev) => {
  try {
    const root = document.getElementById('root');
    const reason = ev && (ev.reason && (ev.reason.stack || ev.reason.message) || String(ev.reason)) || 'Unhandled rejection';
    if (root) root.innerText = `Unhandled rejection:\n${reason}`;
    console.error('Unhandled rejection', ev.reason);
  } catch (e) {
    console.error('Error while reporting rejection', e);
  }
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
