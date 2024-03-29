import React, {useState, useEffect} from 'react';
import {Variables} from '../Data/Variables';
import { useDispatch, useSelector } from "react-redux";
import { Form, Modal, Button } from 'react-bootstrap';
//import 'bootstrap/dist/css/bootstrap.min.css';
import { getMonthlyAppointments, getWeeklyAppointments, getDailyAppointments } from '../Redux/AppointmentSlice'
import moment from 'moment';
import axios from 'axios';

const EditEvent = (props) => {
    const { currentDay } = useSelector( (state) => state.appointmentReducer);
    const { token, employeeID} = useSelector( (state) => state.loginReducer);
    let currDay = moment(currentDay);
    const dispatch = useDispatch();
    
    const [data, setData] = useState({
        title: props.data.title,
        appointmentID: props.data.appointmentID,
        employeeID: employeeID,
        clientID: props.data.clientID,
        appDate: moment(props.data.appDate).format('YYYY-MM-DD'),
        startTime: moment(props.data.startTime).format('HH:mm'),
        endTime: moment(props.data.endTime).format('HH:mm'),
        notes: props.data.notes,
        color: props.data.color,
        fixedStart: moment(props.data.appDate).format('YYYY-MM-DD') + ' ' + moment(props.data.startTime).format('HH:mm'),
        fixedEnd: moment(props.data.appDate).format('YYYY-MM-DD') + ' ' + moment(props.data.endTime).format('HH:mm'),
    });

    useEffect( () => {
        setData({
            title: props.data.title,
            appointmentID: props.data.appointmentID,
            employeeID: employeeID,
            clientID: props.data.clientID,
            appDate: moment(props.data.appDate).format('YYYY-MM-DD'),
            startTime: moment(props.data.startTime).format('HH:mm'),
            endTime: moment(props.data.endTime).format('HH:mm'),
            notes: props.data.notes,
            color: props.data.color,
            fixedStart: moment(props.data.appDate).format('YYYY-MM-DD') + ' ' + moment(props.data.startTime).format('HH:mm'),
            fixedEnd: moment(props.data.appDate).format('YYYY-MM-DD') + ' ' + moment(props.data.endTime).format('HH:mm'),
        });
    }, [props.data, employeeID]);
    
    const updateData = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        
        setData(values => ({
            ...values,
            [name]: value
        }));
        
        if (event.target.name === 'appDate' || event.target.name === 'startTime' || event.target.name === 'endTime') {
            let newDateTime = data.appDate + ' ' + event.target.value;
            if (event.target.name === 'appDate') {
                setData(values => ({
                    ...values,
                    fixedStart: event.target.value + ' ' + data.startTime,
                    fixedEnd: event.target.value + ' ' + data.endTime
                }));
            } else {
                if (event.target.name === 'startTime') {
                    setData(values => ({
                        ...values,
                        fixedStart: newDateTime
                    }));
                } else {
                    setData(values => ({
                        ...values,
                        fixedEnd: newDateTime
                    }));
                }
            }
        }
    }
    
    const createClick = () => {
        
        const appointmentData = JSON.stringify({
            appointmentID: data.appointmentID,
            employeeID: data.employeeID,
            clientID: data.clientID,
            appDate: data.appDate,
            startTime: data.fixedStart,
            endTime: data.fixedEnd,
            notes: data.notes,
            title: data.title,
            color: data.color
        });
        
        axios.put(Variables.API_URL + "appointment", appointmentData, {
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

            props.handleEditClose();
            alert(response.data);
        })
        .catch(error => {
            // Failed
            console.log(error);
        });
    } 

    return (
        <>
        <Modal show={props.createModalOpen} onHide={props.handleCreateModalOpen}>
            <Modal.Header closeButton>
               <Modal.Title>Edit Event</Modal.Title>
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
                      <Form.Control name="startTime" type="time" placeholder="Start Time" value={data.startTime} onChange={updateData}/>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formEndTime">
                      <Form.Label>End Time</Form.Label>
                      <Form.Control name="endTime" type="time" placeholder="End Time" value={data.endTime} onChange={updateData}/>
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
                  Edit
               </Button>
               <Button variant="secondary" onClick={props.handleEditClose}>
                  Cancel
               </Button>
            </Modal.Footer>
        </Modal>
        </>
    );
  }
  
  export default EditEvent;