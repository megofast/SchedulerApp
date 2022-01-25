import React, {useEffect, useState} from 'react';
import {Variables} from '../Data/Variables';
import { useDispatch, useSelector } from "react-redux";
import { Form, Modal, Button } from 'react-bootstrap';
//import 'bootstrap/dist/css/bootstrap.min.css';
import { getClientList } from '../Redux/ClientSlice';
import axios from 'axios';

const NewClient = (props) => {
    
    const { token } = useSelector( (state) => state.loginReducer);
    const dispatch = useDispatch();
    
    const [data, setData] = useState({
        firstName: props.target.firstName,
        lastName: props.target.lastName,
        phone: props.target.phone,
        email: props.target.email,
    });
    
    useEffect( () => {
        setData({
            firstName: props.target.firstName,
            lastName: props.target.lastName,
            phone: props.target.phone,
            email: props.target.email,
        });
    }, [props.target]);

    const updateData = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        
        setData(values => ({
            ...values,
            [name]: value
        }))
    }
    
    const cancelClick = () => {
        props.handleCreateModalOpen();
        props.closeEdit();
    }

    const createClick = () => {
        if (props.target.firstName === "") {
            // Create a new record
            const appointmentData = JSON.stringify({
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
                email: data.email,
            });

            axios.post(Variables.API_URL + "client", appointmentData, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                // Success
                dispatch(getClientList());
                
                props.handleCreateModalOpen();
                alert(response.data);
            })
            .catch(error => {
                // Failed
                alert("Failed to create a new client.");
                console.log(error);
            });
        } else {
            // Update, use put instead of post
            const appointmentData = JSON.stringify({
                clientID: props.target.clientID,
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
                email: data.email,
            });
    
            axios.put(Variables.API_URL + "client", appointmentData, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                // Success
                dispatch(getClientList());
                
                props.handleCreateModalOpen();
                alert(response.data);
            })
            .catch(error => {
                // Failed
                alert("Failed to Edit the client.");
                console.log(error);
            });
        }
    } 

    return (
        <>
        <Modal show={props.createModalOpen} onHide={props.handleCreateModalOpen}>
            <Modal.Header closeButton>
               <Modal.Title>Add New Client</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form>
                  <Form.Group className="mb-3" controlId="formFirstName">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control name="firstName" type="string" placeholder="First Name" value={data.firstName} onChange={updateData}/>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formLastName">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control name="lastName" type="string" placeholder="Last Name" value={data.lastName} onChange={updateData}/>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formPhone">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control name="phone" type="phone" placeholder="Phone" value={data.phone} onChange={updateData}/>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control name="email" type="email" placeholder="Email" value={data.email} onChange={updateData}/>
                  </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="primary" onClick={createClick}>
                  { props.target.firstName === "" ? "Create" : "Edit" }
               </Button>
               <Button variant="secondary" onClick={cancelClick}>
                  Cancel
               </Button>
            </Modal.Footer>
        </Modal>
        </>
    );
  }
  
  export default NewClient;