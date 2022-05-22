import React, {useState, useEffect} from 'react';
import {Variables} from '../Data/Variables';
import { useDispatch, useSelector } from "react-redux";
import { Form, Modal, Button, InputGroup, DropdownButton, Dropdown, Row, Col } from 'react-bootstrap';
//import 'bootstrap/dist/css/bootstrap.min.css';
import { getMonthlyAppointments, getWeeklyAppointments, getDailyAppointments } from '../Redux/AppointmentSlice'
import moment from 'moment';
import axios from 'axios';
import '../CSS/NewEvent.css';
import { getClientList } from '../Redux/ClientSlice';
import NewClient from './NewClient';
import DailyHeatMap from './DailyHeatMap';

let checkForConflictingAppointments = (startTime, endTime, appointments) => {
    let foundConflict = false;
    
    appointments.forEach( (appointment) => {
        if (startTime.isBetween(appointment.startTime, appointment.endTime, 'minute', '[]') || 
            endTime.isBetween(appointment.startTime, appointment.endTime, 'minute', '[]')) {
            if (startTime.isSame(appointment.startTime, 'minute') || endTime.isSame(appointment.startTime, 'minute') ||
                startTime.isSame(appointment.endTime, 'minute') || endTime.isSame(appointment.endTime, 'minute')) {
                // Do not return there was a conflict, these are the endpoints and should be excluded.
            } else {
                foundConflict = true;
            }
        } 
    });
    
    return foundConflict;
}

const NewEvent = (props) => {
    const { currentDay, dailyAppointments } = useSelector( (state) => state.appointmentReducer);
    const { token, loggedInEmployeeID} = useSelector( (state) => state.loginReducer);
    const { clients } = useSelector( (state) => state.clientReducer);
    let currDay = moment(currentDay);       // To prevent changing of the stored state
    const dispatch = useDispatch();
    
    const [clientFirstName, setClientFirstName] = useState("First Name");
    const [clientLastName, setClientLastName] = useState("Last Name");
    const [validationMessages, setValidationMessages] = useState("");
    
    const [createModalIsOpen, setModalIsOpen] = useState(false);
    const handleCreateModalEvent = (ID) => {
        setModalIsOpen(!createModalIsOpen);
        if (ID !== 0 && ID !== undefined) {
            setClientFirstName(ID.firstName);
            setClientLastName(ID.lastName);
            setData(values => ({
                ...values,
                clientID: ID.ID
            }));
        }
    }

    const editTarget = {
        clientID: "",
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
    };

    useEffect( () => {
        // Load the client names
        dispatch(getClientList());
        if (data.appDate !== "") {
            let parameters = {
                date: moment(data.appDate).format('YYYY-MM-DD'),
            }
            console.log(parameters);
            dispatch(getDailyAppointments(parameters));
        }
    }, [dispatch]);
    
    const [data, setData] = useState({
        title: "",
        appointmentID: "",
        employeeID: loggedInEmployeeID,
        clientID: "",
        appDate: props.date,
        startTime: props.start,
        endTime: props.end,
        notes: "",
        color: "#ffffff",
        fixedStart: props.date + ' ' + props.start,
        fixedEnd: props.date + ' ' + props.end,
    });
    
    const updateClient = (event) => {
        // This will handle updating the client name and number when the user selects a new name from the list
        for (let x in clients) {
            if (clients[x].clientID.toString() === event.target.id) {
                // The client with the inputted ID was found, update the name
                setClientFirstName(clients[x].firstName);
                setClientLastName(clients[x].lastName);
            }
        }
        
        setData(values => ({
            ...values,
            clientID: event.target.id
        }));
    }

    const updateData = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        
        setData(values => ({
            ...values,
            [name]: value
        }))

        // If the user types in a client ID, update the name field to show the name of the corresponding client
        if (event.target.name === 'clientID') {
            // The data will be updated above, must update the client name
            for (let x in clients) {
                if (clients[x].clientID.toString() === event.target.value) {
                    // The client with the inputted ID was found, update the name
                    setClientFirstName(clients[x].firstName);
                    setClientLastName(clients[x].lastName);
                }
            }
        }

        // Fix an error that if the date is set after the time the time is not created properly
        if (event.target.name === 'appDate') {
            let newStartTime = event.target.value + 'T' + data.startTime;
            setData(values => ({
                ...values,
                fixedStart: newStartTime
            }))
            let newEndTime = event.target.value + 'T' + data.endTime;
            setData(values => ({
                ...values,
                fixedEnd: newEndTime
            }))

            // The date has been changed, get the appointments for that day so when the user creates a new appointment overlaps can be detected
            let parameters = {
                date: moment(event.target.value).format('YYYY-MM-DD'),
            }
            dispatch(getDailyAppointments(parameters));
        }

        if (event.target.name === 'startTime' || event.target.name === 'endTime') {
            let newDateTime = data.appDate + 'T' + event.target.value;
            if (event.target.name === 'startTime') {
                
                setData(values => ({
                    ...values,
                    fixedStart: newDateTime
                }))
            } else {
                setData(values => ({
                    ...values,
                    fixedEnd: newDateTime
                }))
            }

            // Create warning text at the bottom of the screen if there is an out of bounds time
            const start = moment(data.appDate + "T" + Variables.TIMES24[0]);    // If modifying time range, this must be updated.
            const end = moment(data.appDate + "T" + Variables.TIMES24[Variables.TIMES24.length - 1]);

            // Check if the time is between the range of acceptable times. 8-9:30
            if (!moment(newDateTime).isBetween(start, end, 'minute', '[]' )) {
                // New time is out of acceptable range, alert the user
                setValidationMessages(`The appointment must fall between ${Variables.TIMES[0]} and ${Variables.TIMES[Variables.TIMES.length - 1]}`);
            } else if (checkForConflictingAppointments(data.fixedStart.length > 11 && event.target.name !== 'startTime' ? moment(data.fixedStart) : moment(newDateTime), 
                                                        data.fixedEnd.length > 11 && event.target.name !== 'endTime' ? moment(data.fixedEnd) : moment(newDateTime), 
                                                        dailyAppointments)) {
                setValidationMessages("There is a conflicting appointment, cannot create appointment during this time.");
            } else if (data.fixedStart.length > 11 && event.target.name === 'endTime') {
                if (moment(newDateTime).isBefore(data.fixedStart)) {
                    setValidationMessages("Cannot schedule an end time before the start time.");
                } else {
                    setValidationMessages("");
                }
            } else {
                setValidationMessages("");
            }

        }
    }
    
    const createClick = () => {
        const start = moment(data.appDate + " " + Variables.TIMES24[0]);    // If modifying time range, this must be updated.
        const end = moment(data.appDate + " " + Variables.TIMES24[Variables.TIMES24.length - 1]);
        let startTime = moment(data.fixedStart);
        let endTime = moment(data.fixedEnd);

        // First check if the new appointment falls within the scheduling window defined
        if (startTime.isBetween(start, end, 'minute' ) && endTime.isBetween(start, end, 'minute' )) {
            // The appointment is within the window, check if there are any conflicting appointments
             if (checkForConflictingAppointments(startTime, endTime, dailyAppointments)) {
                console.log("Conflicts detected");
             } else {
                 console.log("Make the appointment!");
             }
            
            const appointmentData = JSON.stringify({
                employeeID: data.employeeID,
                clientID: data.clientID,
                appDate: data.appDate,
                startTime: data.fixedStart,
                endTime: data.fixedEnd,
                notes: data.notes,
                title: data.title,
                color: data.color
            });
            
            axios.post(Variables.API_URL + "appointment", appointmentData, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                // Success, update all the data
                let parameters = {
                    month: currentDay.month(),
                    year: currentDay.year(),
                };
                dispatch(getMonthlyAppointments(parameters));

                parameters = {
                    startDate: currDay.day(0).format('YYYY-MM-DD'),     // Use currDay to prevent modifying CurrentDay state
                    endDate: currDay.day(6).format('YYYY-MM-DD'),
                }
                dispatch(getWeeklyAppointments(parameters));

                parameters = {
                    date: currentDay.format('YYYY-MM-DD'),
                }
                dispatch(getDailyAppointments(parameters));

                // Success, clear the data from the form
                setData({
                    title: "",
                    appointmentID: "",
                    employeeID: loggedInEmployeeID,
                    clientID: "",
                    appDate: "",
                    startTime: "",
                    endTime: "",
                    notes: "",
                    color: "#ffffff",
                    fixedStart: "",
                    fixedEnd: "",
                });

                // Success, close the popup window
                props.handleCreateModalOpen();
                alert(response.data);
            })
            .catch(error => {
                // Failed
                console.log(error);
            });
        } else {
            setValidationMessages(`The appointment must fall between ${Variables.TIMES[0]} and ${Variables.TIMES[Variables.TIMES.length - 1]}`);
        }
    } 
    
    return (
        <>
        <Modal show={props.createModalOpen} onHide={props.handleCreateModalOpen}>
            <Modal.Header closeButton>
               <Modal.Title>Add New Event</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form>
                  <Form.Control className="mb-3" name="title" type="string" placeholder="Title" value={data.title} onChange={updateData}/>
                  <InputGroup className="mb-3">
                        <Form.Control aria-label="Client ID" name="clientID" type="number" placeholder="Client ID" value={data.clientID} onChange={updateData} />

                        <DropdownButton variant="primary" title="Select Client" id="select-client-dropdown" align="end">
                            {
                                Array.isArray(clients) ?
                                clients.map( client => 
                                    <Dropdown.Item key={client.clientID} href="#" id={client.clientID} onClick={updateClient}>{client.firstName} {client.lastName}</Dropdown.Item>
                                )
                                : null
                            }
                            <Dropdown.Divider></Dropdown.Divider>
                            <Dropdown.Item href="#" onClick={() => handleCreateModalEvent(0)}>Add New Client</Dropdown.Item>
                        </DropdownButton>
                  </InputGroup>
                  <Row>
                        <Col><Form.Control className="mb-3" plaintext readOnly value={ clientFirstName } /></Col>
                        <Col><Form.Control className="mb-3" plaintext readOnly value={ clientLastName } /></Col>
                  </Row>
                  <Form.Group className="mb-3" controlId="formAppDate">
                      <Form.Label>Appointment Date</Form.Label>
                      <Form.Control name="appDate" type="date" placeholder="Appointment Date" value={data.appDate} onChange={updateData}/>
                  </Form.Group>
                  
                  <DailyHeatMap appointments={dailyAppointments} />

                  <Form.Group className="mb-3" controlId="formStartTime">
                      <Form.Label>Start Time</Form.Label>
                      <Form.Control name="startTime" type="time" placeholder="Start Time" disabled={ data.appDate === "" ? true : false}
                                    value={data.startTime} min={ Variables.TIMES24[0] } 
                                    max={ Variables.TIMES24[Variables.TIMES24.length - 1] } onChange={updateData}
                                    style={{ borderColor: validationMessages !== "" ? '#ff0000' : null }}/>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formEndTime">
                      <Form.Label>End Time</Form.Label>
                      <Form.Control name="endTime" type="time" placeholder="End Time" disabled={ data.appDate === "" ? true : false}
                                    value={data.endTime} min={ Variables.TIMES24[0] } 
                                    max={ Variables.TIMES24[Variables.TIMES24.length - 1] } onChange={updateData}
                                    style={{ borderColor: validationMessages !== "" ? '#ff0000' : null }}/>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formNotes">
                      <Form.Label>Notes</Form.Label>
                      <Form.Control name="notes" type="string" placeholder="Notes" value={data.notes} onChange={updateData}/>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formColor">
                      <Form.Label>Color</Form.Label>
                      <Form.Control name="color" type="color" title="Choose Color" value={data.color} onChange={updateData}/>
                  </Form.Group>
              </Form>
              <span className="validation-text">{ validationMessages }</span>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="primary" onClick={createClick}>
                  Create
               </Button>
               <Button variant="secondary" onClick={props.handleCreateModalOpen}>
                  Cancel
               </Button>
            </Modal.Footer>
        </Modal>
        <NewClient createModalOpen={createModalIsOpen} handleCreateModalOpen={handleCreateModalEvent} target={editTarget} />
        </>
    );
  }
  
  export default NewEvent;