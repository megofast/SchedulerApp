import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Col, Row, Card, Form, FloatingLabel, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import { checkLoginCredentials } from '../Redux/LoginSlice';
import Register from './Register';


function App() {
    const { isAuthenticated, loading, failedAttempt } = useSelector( (state) => state.loginReducer);
    const [registerModalIsOpen, setRegisterModalIsOpen] = useState(false);
    
    const handleRegisterModalEvent = () => {
        setRegisterModalIsOpen(!registerModalIsOpen);
    }
    const [data, setData] = useState({
        username: "",
        password: "",
    });

    let navigate = useNavigate();
    const dispatch = useDispatch();

    const updateData = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setData(values => ({
            ...values,
            [name]: value
        }))
    }

    const loginButtonClicked = () => {        
        let parameters = {
            username: data.username,
            password: data.password,
        };
        
        dispatch(checkLoginCredentials(parameters));
    }

    useEffect( () => {
        // Check if the user is authenticated, if so forward to the main layout
        if (isAuthenticated) {
            navigate("/");
        }
        if (failedAttempt) {
            setData({
                username: "",
                password: ""
            });
            alert("Incorrect Credentials");
        }
    }, [isAuthenticated, navigate, failedAttempt])

    return (
        <>
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
                            <Button variant="primary" className="text-uppercase fw-bold btn-block" onClick={loginButtonClicked}>
                                { loading ? <i className="fa fa-spinner fa-spin"></i> : <i class="fas fa-sign-in-alt">&nbsp;&nbsp;Sign-In</i> }
                                
                            </Button>
                            <hr className="my-4"></hr>
                            <Button variant="primary" className="text-uppercase fw-bold btn-block" onClick={handleRegisterModalEvent}><i className="fas fa-user-plus"></i>&nbsp;&nbsp;Register</Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
            <Col></Col>
        </Row>
        </Container>
        <Register registerModalOpen={registerModalIsOpen} handleRegisterModalOpen={handleRegisterModalEvent} />
        </>
    );
}

export default App;