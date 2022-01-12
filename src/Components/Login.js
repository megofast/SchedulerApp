import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Col, Row, Card, Form, FloatingLabel, Button } from 'react-bootstrap';
import {userAuth} from '../Authentication';


function App() {
    const [data, setData] = useState({
        username: "",
        password: "",
    });

    let navigate = useNavigate();

    const updateData = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setData(values => ({
            ...values,
            [name]: value
        }))
    }

    const loginButtonClicked = () => {
        console.log(data);
        if (data.username === 'test') {
            userAuth.authenticate();
            navigate("/");
        }
    }

    return (
      <Container fluid className="mx-0 px-0">
        <Row>
            <Col></Col>
            <Col>
                <Card border="light" className="rounded-3 shadow text-center my-5">
                    <Card.Body className="p-4 p-sm-5">
                        <Card.Title className="mb-5 fw-light fs-5">Sign In</Card.Title>
                        <Form>
                            <Form.Group className="mb-3" controlId="loginForm.username">
                                <FloatingLabel controlId="floatingUsernameLabel" label="Username" className="mb-3">
                                    <Form.Control type="text" name="username" value={data.username} onChange={updateData} />
                                </FloatingLabel>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="loginForm.password">
                                <FloatingLabel controlId="floatingPasswordLabel" label="Password" className="mb-3">
                                    <Form.Control type="password" name="password" value={data.password} onChange={updateData} />
                                </FloatingLabel>
                            </Form.Group>
                            <div className="d-grid gap-2">
                            <Button variant="primary" className="text-uppercase fw-bold btn-block" onClick={loginButtonClicked}>Sign In</Button>
                            <hr className="my-4"></hr>
                            <Button variant="primary" className="text-uppercase fw-bold btn-block">Register</Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
            <Col></Col>
        </Row>
      </Container>
    );
}

export default App;