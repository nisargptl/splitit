import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import { Auth0Provider } from "@auth0/auth0-react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <Auth0Provider
            domain="dev-2kxnqmzpaoclydf0.us.auth0.com"
            clientId="vLHmzXhJ3vxufVehREnqjhEzqQZCyjeO"
            authorizationParams={{
                redirect_uri: window.location.origin + "/dashboard",
            }}
        >
            <App />
        </Auth0Provider>
    </React.StrictMode>
);
