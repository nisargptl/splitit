import React from "react";
import { Navbar, Container, Button } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react"; // Optional: Auth0 for logout functionality

const AppNavbar: React.FC = () => {
    const { logout } = useAuth0(); // Optional: use this if using Auth0 for authentication

    const handleLogout = () => {
        localStorage.setItem("token", "");
        logout({
            logoutParams: { returnTo: window.location.origin + "/login" },
        });
    };

    return (
        <Navbar bg="dark" variant="dark">
            <Container>
                {/* App Name on the left */}
                <Navbar.Brand href="/">Split-It</Navbar.Brand>

                {/* Logout Button on the right */}
                <Navbar.Collapse className="justify-content-end">
                    <Button variant="outline-light" onClick={handleLogout}>
                        Logout
                    </Button>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;
