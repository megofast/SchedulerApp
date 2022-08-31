import React, { useEffect, useState } from 'react';
import { Nav, Navbar, Container, Form, NavDropdown, DropdownButton, Dropdown, Badge } from 'react-bootstrap';
import { ToastContainer } from 'react-bootstrap';
//import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Redux/LoginSlice";
import { getEmployeeList } from '../Redux/EmployeeSlice';
import { updateViewingEmployee } from '../Redux/LoginSlice';
import AccountSettings from '../Components/AccountSettings';
import Notifications from '../Components/Notifications';
import AlertComponent from '../Components/AlertComponent';
import moment from 'moment';


const Header = () => {
    const {dailyAppointments} = useSelector( (state) => state.appointmentReducer);
    const { employees } = useSelector( (state) => state.employeeReducer);
    const { loggedInEmployeeID, employee } = useSelector( (state) => state.loginReducer);
    const [currentCalendar, setCurrentCalendar] = useState({name: "My Calendar", id: null});
    const [accountModalIsOpen, setAccountModalIsOpen] = useState(false);
    const [notificationsIsOpen, setNotificationsIsOpen] = useState(false);
    const [notifyAppointments, setNotifyAppointments] = useState([]);
    
    const dispatch = useDispatch();

    // Break apart the employee settings into its parts for easier use
    const notifyDuration = String(employee.settings).slice(0, 2);
    const notifyReminder = (String(employee.settings).slice(3) === 'true');

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

    let checkForNotifiedAppointment = (appointment) => {
        let found = false;
        notifyAppointments.forEach( (app) => {
            if (app.app.appointmentID === appointment.appointmentID) {
                // Return true, the appointment was found
                found = true;
            }
        });
        return found;
    };

    useEffect( () => {
        dispatch(getEmployeeList());

        // Setup a clock to check daily appointment times to notify when an appointment is upcoming
        const updateCurrentTime = () => {
            //setNotifyAppointments([]);
            dailyAppointments.forEach( (appointment) => {
                // check if an appointment falls within the notification window set in the settings
                if (moment().isAfter(moment(appointment.startTime).subtract(notifyDuration, 'minutes')) &&
                     moment().isBefore(moment(appointment.startTime)) ) {
                    // The appointment is within the notification window, check if the appointment is within the list already
                    if (!checkForNotifiedAppointment(appointment)) {
                        if (Boolean(notifyReminder) === true) {
                            // Alert the user to upcoming appointment
                            //alert("upcoming appointment at " + appointment.startTime);
                            //setCurrentAppointment(appointment);
                        }
                        setNotifyAppointments(state => [...state, {notified: true, app: appointment}]);
                    }
                } else {
                    // Remove the appointment from the list since it no longer is within range
                    let goodAppointments = [];
                    notifyAppointments.forEach( (app) => {
                        if (app.app.appointmentID === appointment.appointmentID) {
                            // This appointment is old and needs to be removed, do not add to good appointments list
                            
                        } else {
                            goodAppointments.push(app);
                        }
                    });
                    // After looping through and weeding the bad appointments, reassign the good appointments to the state variable
                    setNotifyAppointments(goodAppointments);
                }
            });
        };

        // search for notifications immediately when header is loaded to avoid delay from interval timer
        updateCurrentTime();

        // Create interval timer to check for new notifications every minute
        let clockID = 0;
        clockID = setInterval(updateCurrentTime, 60000);

        // Create a return function to destroy the interval once the component unmounts
        return () => {
            clearInterval(clockID);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, dailyAppointments]);
    

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
                    <Nav.Link className="mx-2" href="" onClick={ handleNotificationModalOpen }>Notifications <Badge bg="info" >{notifyAppointments.length}</Badge></Nav.Link>
                    <NavDropdown className="mx-2" id="account-dropdown" title="My Account">
                        <NavDropdown.Item disabled>Welcome {employee.firstName} {employee.lastName}</NavDropdown.Item>
                        <Dropdown.Divider></Dropdown.Divider>
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
        <Notifications notifyApps={notifyAppointments} notificationModalOpen={notificationsIsOpen} handleNotificationModalEvent={handleNotificationModalOpen} />
        <ToastContainer style={{zIndex:'5000'}} className="p-3" position='bottom-start'>
            {
                Boolean(notifyReminder) ? notifyAppointments.map((appointment, i) => {
                    return (<AlertComponent key={i} appointment={appointment.app} />)
                })
                : null
            }
        </ToastContainer>
        </>
    );
  }
  
  export default Header;