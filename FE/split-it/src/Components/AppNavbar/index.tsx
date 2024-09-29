import React from "react";
import { Navbar, Container, Button } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react"; // Optional: Auth0 for logout functionality

interface AppNavbarProps {
    isLoggedIn: boolean;
}

const AppNavbar: React.FC<AppNavbarProps> = ({ isLoggedIn }) => {
    const { logout } = useAuth0(); // Optional: use this if using Auth0 for authentication

    const handleLogout = () => {
        localStorage.setItem("token", "");
        logout({
            logoutParams: { returnTo: window.location.origin + "/login" },
        });
    };

    return (
        <Navbar bg="dark" variant="dark">
            <Container style={{width: '100%', margin: 0, maxWidth: '100%', padding: "5px 20px"}}>
                {/* App Name on the left */}
                <Navbar.Brand href="/">Split-It</Navbar.Brand>

                {isLoggedIn && (
                    <Navbar.Collapse className="justify-content-end">
                        <Button variant="outline-light" onClick={handleLogout}>
                            Logout
                        </Button>
                    </Navbar.Collapse>
                )}
            </Container>
        </Navbar>
    );
};

export default AppNavbar;
