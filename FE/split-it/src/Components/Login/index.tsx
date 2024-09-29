import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const { loginWithRedirect, isAuthenticated, user } = useAuth0();

    const navigate = useNavigate();

    useEffect(() => {
        console.log(user)
        if (localStorage.getItem("token")) {
            navigate("/dashboard"); // Redirect to the home page if authenticated
        }
    }, []);

    return (
        <Container className="text-center mt-5">
            <h1>Welcome to Split-It</h1>
            <p>Please login or sign up to continue.</p>
            <Button
                variant="primary"
                className="mx-2"
                onClick={() => loginWithRedirect()}
            >
                Log In/Sign Up
            </Button>
        </Container>
    );
};

export default Login;
