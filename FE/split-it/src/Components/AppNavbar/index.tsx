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
        localStorage.setItem("user_id", "");
        logout({
            logoutParams: { returnTo: window.location.origin + "/login" },
        });
    };

    return (
        <Navbar bg="dark" variant="dark">
            <Container
                style={{
                    width: "100%",
                    margin: 0,
                    maxWidth: "100%",
                    padding: "5px 20px",
                }}
            >
                {/* App Name on the left */}
                <img
                    src="/logo.svg" // Assuming the logo is in the public directory
                    alt="Logo"
                    width="45"
                    height="45"
                    style={{marginTop: 5}}
                    className="d-inline-block align-top"
                />
                <Navbar.Brand
                    href="/"
                    className="kiwi-maru-regular"
                    style={{ fontSize: 34, marginLeft: -12, marginRight: 0 }}
                >
                    mart
                </Navbar.Brand>
                <img
                    src="/logo.svg" // Assuming the logo is in the public directory
                    alt="Logo"
                    width="45"
                    height="45"
                    style={{marginTop: 5}}
                    className="d-inline-block align-top"
                />
                <Navbar.Brand
                    href="/"
                    className="kiwi-maru-regular"
                    style={{ fontSize: 34, marginLeft: -12 }}
                >
                    plit
                </Navbar.Brand>

                {isLoggedIn && (
                    <Navbar.Collapse className="justify-content-end">
                        <Button
                            variant="outline-light"
                            style={{ border: "none" }}
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    </Navbar.Collapse>
                )}
            </Container>
        </Navbar>
    );
};

export default AppNavbar;
