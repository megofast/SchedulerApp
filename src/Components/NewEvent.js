import React, {useState} from 'react';
import {Variables} from '../Data/Variables';
import { useDispatch, useSelector } from "react-redux";
import { Form, Modal, Button } from 'react-bootstrap';
//import 'bootstrap/dist/css/bootstrap.min.css';
import { getMonthlyAppointments, getWeeklyAppointments, getDailyAppointments } from '../Redux/AppointmentSlice'
import moment from 'moment';
import axios from 'axios';
import '../CSS/NewEvent.css';


const NewEvent = (props) => {
    const { currentDay } = useSelector( (state) => state.appointmentReducer);
    const { token, loggedInEmployeeID} = useSelector( (state) => state.loginReducer);
    let currDay = moment(currentDay);       // To prevent changing of the stored state
    const dispatch = useDispatch();
    
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
    
    const updateData = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        
        setData(values => ({
            ...values,
            [name]: value
        }))

        // Fix an error that if the date is set after the time the time is not created properly
        if (event.target.name === 'appDate') {
            let newStartTime = event.target.value + ' ' + data.startTime;
            setData(values => ({
                ...values,
                fixedStart: newStartTime
            }))
            let newEndTime = event.target.value + ' ' + data.endTime;
            setData(values => ({
                ...values,
                fixedEnd: newEndTime
            }))
        }

        if (event.target.name === 'startTime' || event.target.name === 'endTime') {
            let newDateTime = data.appDate + ' ' + event.target.value;
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
        }
    }
    
    const createClick = () => {
        let start = moment(data.appDate + ' 08:00');
        let end = moment(data.appDate + ' 21:30');
        let startTime = moment(data.fixedStart);
        let endTime = moment(data.fixedEnd);

        if (startTime.isBetween(start, end, 'HH:mm' ) && endTime.isBetween(start, end, 'HH:mm' )) {
            console.log("create");
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
                // Success
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

                props.handleCreateModalOpen();
                alert(response.data);
            })
            .catch(error => {
                // Failed
                console.log(error);
            });
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
                  <Form.Group className="mb-3" controlId="formTitle">
                      <Form.Label>Title</Form.Label>
                      <Form.Control name="title" type="string" placeholder="title" value={data.title} onChange={updateData}/>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formClientID">
                      <Form.Label>clientID</Form.Label>
                      <Form.Control name="clientID" type="number" placeholder="ClientID" value={data.clientID} onChange={updateData}/>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formAppDate">
                      <Form.Label>Appointment Date</Form.Label>
                      <Form.Control name="appDate" type="date" placeholder="Appointment Date" value={data.appDate} onChange={updateData}/>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formStartTime">
                      <Form.Label>Start Time</Form.Label>
                      <Form.Control name="startTime" type="time" placeholder="Start Time" value={data.startTime} min={ Variables.TIMES24[0] } max={ Variables.TIMES24[Variables.TIMES24.length - 1] } onChange={updateData}/>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formEndTime">
                      <Form.Label>End Time</Form.Label>
                      <Form.Control name="endTime" type="time" placeholder="End Time" value={data.endTime} min={ Variables.TIMES24[0] } max={ Variables.TIMES24[Variables.TIMES24.length - 1] } onChange={updateData}/>
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
        </>
    );
  }
  
  export default NewEvent;