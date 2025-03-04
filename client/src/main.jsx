import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reducers from "./reducers/index.jsx";
import "materialize-css/dist/css/materialize.min.css";
import { thunk } from "redux-thunk";

const store = createStore(reducers, {}, applyMiddleware(thunk));

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
