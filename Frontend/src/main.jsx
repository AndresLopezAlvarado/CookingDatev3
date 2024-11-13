import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { Provider } from "react-redux";
import { persistor, store } from "./app/store.js";
import { PersistGate } from "redux-persist/integration/react";
import { ChakraProvider } from "@chakra-ui/react";
import "./i18n.js";
import Spinner from "./components/Spinner.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <React.Suspense fallback={<Spinner />}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ChakraProvider>
            <App />
          </ChakraProvider>
        </PersistGate>
      </Provider>
    </React.Suspense>
  </StrictMode>
);
