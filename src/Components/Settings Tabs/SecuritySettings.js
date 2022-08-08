import React from 'react';
import { ListGroup, ListGroupItem, Row, Col, Form, InputGroup, FormControl, Button } from 'react-bootstrap';

const SecuritySettings = (props) => {

    return (
        <>
            <h5>Security Settings</h5>
            <ListGroup>
                <ListGroupItem>
                    <Row>
                        <Col sm={7}>
                            <strong className="fs-6">Username</strong>
                            <p className="fs-6">Change username from: { props.employee.username }</p>
                        </Col>
                        <Col sm={5} className="d-flex align-items-center justify-content-end mx-auto">
                            <Form ref={props.usernameData}>
                            <InputGroup className="mb-3">
                                <FormControl type="text" placeholder="New Username" name="username" />
                                <Button variant="outline-primary" id="save-username" onClick={props.changeUsername}>Save</Button>
                            </InputGroup>
                            </Form>
                        </Col>
                    </Row>
                </ListGroupItem>
                <ListGroupItem>
                    <Row>
                        <Col sm={4}>
                            <strong className="fs-6">Password</strong>
                            <p className="fs-6">Change your password.</p>
                        </Col>
                        <Col sm={8} className="d-flex align-items-center justify-content-end">
                            <Form ref={props.currentPasswordData}>
                            <InputGroup className="mb-3">
                                <FormControl type="password" placeholder="Current Password" name="passwordc" />
                            </InputGroup>
                            </Form>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                        <Form ref={props.newPasswordData}>
                            <InputGroup className="mb-3">
                                <FormControl type="password" placeholder="New Password" name="password1" />
                                <FormControl type="password" placeholder="Retype New Password" name="password2" />
                                <Button variant="outline-primary" id="save-password" onClick={props.changePassword}>Save</Button>
                            </InputGroup>
                            </Form>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <p className="fs-6">Password must be at leat 8 characters long.<br />
                            Password must contain at least 1 capital letter.<br />
                            Password must contain at least 1 special character.<br />
                            Passwords must match.</p>
                        </Col>
                    </Row>
                </ListGroupItem>
            </ListGroup>
        </>
    )
}

export default SecuritySettings;