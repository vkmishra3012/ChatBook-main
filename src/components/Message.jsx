import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Message = (props) => {
  return (
    <>
      <Row>
        <Col>
          <Container
            style={{
              background: props.place === "left" ? "white" : "#0084ff",
              color: props.place === "left" ? "black" : "white",
              borderRadius: "10px",
              padding: "0px",
              margin: "10px",
              width: "fit-content",
              maxWidth: "80%",
              minWidth: "20%",
              float: props.place,
              clear: "both",
            }}>
            <p
              className="message-text"
              style={{
                padding: "10px",
                margin: "0px",
              }}
              align={props.place === "left" ? "left" : "right"}>
              {props.message}
            </p>
          </Container>
        </Col>
      </Row>
    </>
  );
};

export default Message;
