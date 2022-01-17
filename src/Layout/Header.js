import React from 'react';
import { Nav, Navbar, Container, Form, FormControl } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch } from "react-redux";
import { logout } from "../Redux/LoginSlice";

const Header = () => {
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <Navbar fixed="top" bg="white" variant="light" className="shadow mx-0 px-0">
            <Container fluid>
                <Navbar.Brand href="#home">Scheduler</Navbar.Brand>
                <Form className="d-flex me-auto">
                    <FormControl
                    type="search"
                    placeholder="Search"
                    className="me-2"
                    aria-label="Search"
                    />
                    <span className="input-group-text bg-white border-0"><i className="fas fa-search"></i></span>
                </Form>
                <Nav className="justify-content-end">
                    <Nav.Link href="">Notifications</Nav.Link>
                    <Nav.Link href="">Account</Nav.Link>
                    <Nav.Link href="" onClick={ () => handleLogout() }>Logout</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    );
  }
  
  export default Header;