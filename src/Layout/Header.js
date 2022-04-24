import React from 'react';
import { Nav, Navbar, Container, Form } from 'react-bootstrap';
//import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch } from "react-redux";
import { logout } from "../Redux/LoginSlice";

const Header = () => {
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <Navbar fixed="top" bg="primary" variant="dark" className="shadow mx-0 px-0">
            <Container fluid>
                <Navbar.Brand href="#home">Scheduler</Navbar.Brand>
                <Form className="d-flex me-auto">

                <div className=" input_wrapper">
                    <i className="fas fa-search input_icon"></i>
                    <Form.Control name="username" type="search" placeholder="Search" className=""/>
                </div>

                    
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