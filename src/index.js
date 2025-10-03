import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import { SnackbarProvider } from "notistack";

// React 18: use createRoot
import { createRoot } from 'react-dom/client';

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <SnackbarProvider
        maxSnack={2}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <App />
        </Router>
      </SnackbarProvider>
    </Provider>
  </React.StrictMode>
);
