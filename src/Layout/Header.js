import React, { useEffect, useState } from 'react';
import { Nav, Navbar, Container, Form, NavDropdown, DropdownButton, Dropdown, Badge } from 'react-bootstrap';
//import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Redux/LoginSlice";
import { getEmployeeList } from '../Redux/EmployeeSlice';
import { updateViewingEmployee } from '../Redux/LoginSlice';
import AccountSettings from '../Components/AccountSettings';
import Notifications from '../Components/Notifications';

const Header = () => {
    const { employees } = useSelector( (state) => state.employeeReducer);
    const { loggedInEmployeeID } = useSelector( (state) => state.loginReducer);
    const [currentCalendar, setCurrentCalendar] = useState({name: "My Calendar", id: null});
    const [accountModalIsOpen, setAccountModalIsOpen] = useState(false);
    const [notificationsIsOpen, setNotificationsIsOpen] = useState(false);
    const dispatch = useDispatch();

    const handleNotificationModalOpen = () => {
        setNotificationsIsOpen(!notificationsIsOpen);
    }

    const handleAccountModalOpen = () => {
        setAccountModalIsOpen(!accountModalIsOpen);
    }

    const handleLogout = () => {
        dispatch(logout());
    };

    const handleCalendarViewChange = (e) => {
        setCurrentCalendar({name: e.target.innerText, id: e.target.id});
        dispatch(updateViewingEmployee(parseInt(e.target.id)));

        // After the person changes the viewing callendar, update the data to show the new calendars data
        
    };

    useEffect( () => {
        dispatch(getEmployeeList());
    }, [dispatch]);
    
    return (
        <>
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
                    <Nav.Link className="mx-2" href="" onClick={ handleNotificationModalOpen }>Notifications <Badge bg="info" >0</Badge></Nav.Link>
                    <NavDropdown className="mx-2" id="account-dropdown" title="My Account">
                        <NavDropdown.Item href="" onClick={ handleAccountModalOpen }>Settings</NavDropdown.Item>
                        <NavDropdown.Item href="" onClick={ () => handleLogout() }>Logout</NavDropdown.Item>
                    </NavDropdown>
                    <Navbar.Text className="text-secondary">
                        Viewing as: 
                    </Navbar.Text>
                    <DropdownButton className="mx-2" id="view-dropdown" title={ currentCalendar.name } variant="info">
                        <Dropdown.Item href="" id={ loggedInEmployeeID } onClick={ (e) => handleCalendarViewChange(e) }>My Calendar</Dropdown.Item>
                        <Dropdown.Divider></Dropdown.Divider>
                        {
                            employees !== undefined ?
                                employees.map((employee, i) => {
                                    return (<Dropdown.Item key={i} href="" id={ employee.employeeID } onClick={ (e) => handleCalendarViewChange(e) }>{employee.firstName + " " + employee.lastName }</Dropdown.Item>)
                                })
                            : <i className="fa fa-spinner fa-spin"></i>
                        }
                    </DropdownButton>
                </Nav>
            </Container>
        </Navbar>
        <AccountSettings accountModalOpen={accountModalIsOpen} handleAccountModalEvent={handleAccountModalOpen} />
        <Notifications notificationModalOpen={notificationsIsOpen} handleNotificationModalEvent={handleNotificationModalOpen} />
        </>
    );
  }
  
  export default Header;