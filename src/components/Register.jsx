import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { auth, usersRef } from "../config/firebase";
import { addDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Register with Google
  const RegisterWithGoogle = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      await addDoc(usersRef, {
        username: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        id: user.uid,
      });
      navigate("/");
    } catch (error) {
      console.error(error.message);
      setError(error.message);
      setLoading(false);
    }
  };

  // Register with email and password
  const handleRegister = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await addDoc(usersRef, {
        username: username,
        email: user.email,
        photoURL: "https://picsum.photos/600/?random",
        id: user.uid,
      });
      navigate("/");
    } catch (error) {
      console.error(error.message);
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <>
      <Container fluid className="register">
        <Row className="justify-content-md-center">
          {loading ? (
            <Container className="text-center mt-5">
              <Spinner animation="border" variant="primary" />
              <p className="text-center text-white mt-3">Wait a moment...</p>
            </Container>
          ) : (
            <Col xs={12} md={6} className="login-body">
              <h1 className="text-center text-white">Register</h1>

              {error && (
                <Container
                  className="alert alert-danger text-center"
                  role="alert">
                  {error.substring(22, error.length - 2).toUpperCase()}
                </Container>
              )}

              <Form>
                <Form.Group
                  className="mb-3"
                  controlId="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}>
                  <Form.Label> Username </Form.Label>
                  <Form.Control type="text" placeholder="Enter username" />
                </Form.Group>

                <Form.Group
                  className="mb-3"
                  controlId="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}>
                  <Form.Label> Email address </Form.Label>
                  <Form.Control type="email" placeholder="Enter email" />
                </Form.Group>

                <Form.Group
                  className="mb-3"
                  controlId="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}>
                  <Form.Label> Password </Form.Label>
                  <Form.Control type="password" placeholder="Password" />
                </Form.Group>

                <Form.Group
                  className="mb-3"
                  controlId="cpassword"
                  value={cpassword}
                  onChange={(e) => setCpassword(e.target.value)}>
                  <Form.Label> Confirm Password </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm Password"
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  onClick={handleRegister}
                  className="w-50 d-block mx-auto">
                  Register
                </Button>

                <Button
                  variant="danger"
                  className="mt-1 w-50 d-block mx-auto"
                  onClick={RegisterWithGoogle}>
                  Register With Google <i className="bi bi-google"></i>
                </Button>
              </Form>

              <p className="text-center mt-3 text-white">
                Already have an account?
                <Link to="/login" className="text-info mx-1">
                  Sign In
                </Link>
              </p>
            </Col>
          )}
        </Row>
      </Container>
    </>
  );
};

export default Register;
