import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import { App } from "./App";
import { BrowserRouter } from "react-router-dom";

import { Provider } from "react-redux";
import { store, persister } from "./store";
import { PersistGate } from "redux-persist/integration/react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<BrowserRouter>
			<Provider store={store}>
				<PersistGate loading={null} persistor={persister}>
					<App />
				</PersistGate>
			</Provider>
		</BrowserRouter>
	</React.StrictMode>
);
