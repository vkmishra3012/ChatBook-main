import React from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const Error = () => {
  return (
    <>
      <Container className="text-center mt-5">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>
          The page you are looking for might have been removed had its name
          changed or is temporarily unavailable.
        </p>
        <Link to="/" className="btn btn-primary">
          Home
        </Link>
      </Container>
    </>
  );
};

export default Error;
