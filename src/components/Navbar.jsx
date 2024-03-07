import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Container, Nav, Navbar, Button } from "react-bootstrap";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";

const NavbarComponent = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <>
      <Navbar bg="primary" variant="dark">
        <Container fluid>
          <Link to="/">
            <Navbar.Brand className="ml-4">ChatBook</Navbar.Brand>
          </Link>
          <Nav>
            <Link to="/profile">
              <Button variant="success">
                <i className="bi bi-person-circle"> </i> Profile
              </Button>
            </Link>
            <Button variant="danger ml-1 mr-2" onClick={logout}>
              <i className="bi bi-box-arrow-right"> </i> Logout
            </Button>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default NavbarComponent;
