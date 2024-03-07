import React from "react";
import { Link } from "react-router-dom";
import { Image, ListGroup } from "react-bootstrap";

const User = (props) => {
  const { user } = props;

  return (
    <>
      <ListGroup variant="flush">
        <ListGroup.Item action variant="light" className="text-dark">
          <Image
            src={user.photoURL}
            roundedCircle
            width={40}
            height={40}
            className="mx-2"
          />
          {user.username}
        </ListGroup.Item>
      </ListGroup>
    </>
  );
};

export default User;






