import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Row, Col, Container } from "react-bootstrap";
import { auth, usersRef } from "../config/firebase";
import { onSnapshot } from "firebase/firestore";

import NavbarComponent from "./Navbar";
import User from "./User";
import Chat from "./Chat";

const Home = () => {
  if (!auth.currentUser) {
    window.location.replace("/login");
  }

  const { id } = useParams();
  const [users, setUsers] = useState([]); // all users except the current user
  const [search, setSearch] = useState(""); // search bar

  // get all users except the current user
  useEffect(() => {
    const unsubscribe = onSnapshot(usersRef, (querySnapshot) => {
      let users = [];
      querySnapshot.forEach((doc) => {
        if (doc.data().email !== auth.currentUser.email) {
          users.push({ id: doc.id, ...doc.data() });
        }
      });
      setUsers(users);
    });

    return unsubscribe;
  }, []);

  // filter users based on search bar
  useEffect(() => {
    const unsubscribe = onSnapshot(usersRef, (querySnapshot) => {
      let users = [];
      querySnapshot.forEach((doc) => {
        if (
          doc.data().email !== auth.currentUser.email &&
          doc.data().email.includes(search)
        ) {
          users.push({ id: doc.id, ...doc.data() });
        }
      });
      setUsers(users);
    });
    return unsubscribe;
  }, [search]);

  return (
    <>
      <NavbarComponent />

      <Container fluid className="mt-2">
        <Row>
          <Col
            xs={12}
            sm={4}
            lg={3}
            style={{
              height: "calc(100vh - 65px)",
              overflowY: "scroll",
              overflowX: "hidden",
            }}>
            {/* Search Bar */}
            <Container>
              <input
                type="text"
                className="form-control border border-2 border-primary rounded-pill px-3 text-center"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Container>
            {users.length === 0 ? (
              <div className="text-center mt-5">
                <i className="bi bi-emoji-frown"> No users found </i>
              </div>
            ) : (
              users.map((user) => (
                <Link
                  to={`/${user.id}`}
                  key={user.id}
                  id={user.id}
                  className="text-decoration-none"
                  onClick={() => setSearch("")}>
                  <User user={user} />
                </Link>
              ))
            )}
          </Col>
          <Col
            xs={12}
            sm={8}
            lg={9}
            style={{
              height: "calc(100vh - 65px)",
              overflowY: "scroll",
              overflowX: "hidden",
            }}>
            {id ? (
              <Chat id={id} />
            ) : (
              <div className="text-center mt-5">
                <i className="bi bi-chat-text"> Select a user to chat </i>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;
