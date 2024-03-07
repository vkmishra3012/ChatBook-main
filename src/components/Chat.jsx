import React, { useState, useEffect } from "react";
import { Container, Button, Form, Image } from "react-bootstrap";
import { auth, messagesRef, usersRef } from "../config/firebase";
import {
  addDoc,
  query,
  where,
  serverTimestamp,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import Message from "./Message";
import { Link } from "react-router-dom";

const Chat = (props) => {
  const { id } = props; // id of the user you are chatting with
  const [user, setUser] = useState({}); // user you are chatting with
  const [message, setMessage] = useState([]); // messages from firestore
  const [text, setText] = useState(""); // message to send

  // Get user with id
  const getUser = async () => {
    try {
      const q = query(usersRef, where("id", "==", id));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const user = querySnapshot.docs[0].data();
        setUser(user);
      });
    } catch (err) {
      console.error(err.message);
    }
  };

  // Get user with id
  useEffect(() => {
    getUser();
  }, [id]);

  // Send message to firestore
  const sendMessage = async (e) => {
    e.preventDefault();
    const docRef = await addDoc(messagesRef, {
      user1: auth.currentUser.uid,
      user2: id,
      chat: {
        text: text,
        createdAt: serverTimestamp(),
        sender: auth.currentUser.uid,
      },
    });
    setText("");
  };

  // Get messages from firestore
  useEffect(() => {
    // either from user1 or from user2
    const q = query(
      messagesRef,
      where("user1", "in", [id, auth.currentUser.uid]),
      where("user2", "in", [id, auth.currentUser.uid]),
      orderBy("chat.createdAt", "asc")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages = [];
      querySnapshot.forEach((doc) => {
        messages.push(doc.data().chat);
      });
      setMessage(messages);
      // scroll to bottom
      const chat = document.getElementById("chat");
      chat.scrollTop = chat.scrollHeight;
    });
    return () => {
      unsubscribe();
    };
  }, [id]);

  return (
    <>
      <Container>
        <Container className="d-flex justify-content-center align-items-center">
          <Link to={`/profile/${user.username}`}>
            <Image
              src={user.photoURL}
              roundedCircle
              width={40}
              height={40}
              className="mt-2 mb-n2"
            />
          </Link>
          <h1 className="mx-auto mt-1 mb-n2"> {user.username} </h1>
        </Container>

        <hr />

        <Container
          id="chat"
          style={{
            height: "calc(100vh - 200px)",
            overflowY: "scroll",
            scrollBehavior: "smooth",
            background: "#f5f5f5",
          }}>
          {message.map((msg) => {
            return (
              <Message
                key={msg.id}
                place={msg.sender === auth.currentUser.uid ? "right" : "left"}
                message={msg.text}
              />
            );
          })}
        </Container>
      </Container>

      <Container>
        <Form className="d-flex justify-content-center align-items-center mt-1">
          <Form.Group className="w-100">
            <Form.Control
              type="text"
              placeholder="Enter your message"
              className="w-100 border border-primary rounded-pill px-3 py-2"
              autoComplete="Off"
              value={text}
              name="text"
              id="text"
              onChange={(e) => {
                setText(e.target.value);
              }}
            />
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            name="send"
            id="send"
            onClick={sendMessage}
            className="ml-1">
            <i className="bi bi-caret-right"></i>
          </Button>
        </Form>
      </Container>
    </>
  );
};

export default Chat;
