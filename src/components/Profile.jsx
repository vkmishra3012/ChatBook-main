import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { auth, usersRef } from "../config/firebase";
import { onSnapshot, where, query } from "firebase/firestore";
import { Container, Row, Col, Card, Image, Spinner } from "react-bootstrap";

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState({});

  const getUser = async () => {
    try {
      if (id === undefined) {
        // get current user
        const user = auth.currentUser;
        setUser(user);
      } else {
        // get user by id
        const q = query(usersRef, where("username", "==", id));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const user = querySnapshot.docs[0].data();
          setUser(user);
        });
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <Container className="mt-5">
        <Row>
          <Col md={6}>
            <Card className="text-center">
              <Card.Header>
                <Image
                  src={user.photoURL}
                  roundedCircle
                  alt="profile picture"
                  width={100}
                  height={100}
                />
              </Card.Header>
              <Card.Body>
                <Card.Title>{user.username}</Card.Title>
                <Card.Text>{user.email}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Profile;
