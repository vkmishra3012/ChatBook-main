import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { auth, usersRef } from "../config/firebase";
import { addDoc, query, where, getDocs } from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Login with Google
  const SignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Check if user exists in firestore
      const q = query(usersRef, where("id", "==", user.uid));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        // If user does not exist, add user to firestore
        await addDoc(usersRef, {
          username: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          id: user.uid,
        });
      }
      navigate("/");
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  // Login with email and password
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        username,
        password
      );
      const user = userCredential.user;
      navigate("/");
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <>
      <Container fluid className="login">
        <Row className="justify-content-md-center">
          {loading ? (
            <Container className="text-center mt-5">
              <Spinner animation="border" variant="primary" />
              <p className="text-center mt-3">Wait a moment...</p>
            </Container>
          ) : (
            <Col xs={12} md={5} className="p-4 login-body">
              <h1 className="text-center text-white">Login</h1>

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
                  <Form.Label> Email </Form.Label>
                  <Form.Control type="email" placeholder="Enter your email" />
                  <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                  </Form.Text>
                </Form.Group>

                <Form.Group
                  className="mb-3"
                  controlId="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}>
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" />
                </Form.Group>

                <Button
                  variant="primary w-50 d-block mx-auto"
                  type="submit"
                  onClick={handleLogin}>
                  Login
                </Button>

                <Button
                  variant="danger mt-1 w-50 d-block mx-auto"
                  onClick={SignInWithGoogle}>
                  Sign In With Google <i className="bi bi-google"></i>
                </Button>
              </Form>
              <p className="text-center mt-3 text-white">
                Don't have an account?
                <Link to="/register" className="text-info mx-1">
                  Sign Up
                </Link>
              </p>
            </Col>
          )}
        </Row>
      </Container>

      {/* Footer */}
    </>
  );
};

export default Login;
