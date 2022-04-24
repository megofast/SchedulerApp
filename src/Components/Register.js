import React, {useState} from 'react';
import {Variables} from '../Data/Variables';
import '../CSS/InputFields.css';
import { Form, Modal, Button } from 'react-bootstrap';
//import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const Register = (props) => {
    
    const [data, setData] = useState({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
    });

    const updateData = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        
        setData(values => ({
            ...values,
            [name]: value
        }))
    }
    
    const cancelClick = () => {
        props.handleRegisterModalOpen();
    }

    const createClick = () => {
            // Create a new record
            const appointmentData = JSON.stringify({
                username: data.username,
                password: data.password,
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
                email: data.email,
            });

            axios.post(Variables.API_URL + "employee", appointmentData, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            })
            .then(response => {
                // Success
                
                props.handleRegisterModalOpen();
                alert(response.data);
            })
            .catch(error => {
                // Failed
                alert("Failed to create a new user account.");
                console.log(error);
            });
    } 

    return (
        <>
        <Modal show={props.registerModalOpen} onHide={props.handleRegisterModalOpen}>
            <Modal.Header closeButton>
               <Modal.Title><i className="fas fa-user-plus"></i>&nbsp;&nbsp;Register New User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form>
                <div className="mb-3 input_wrapper">
                    <i className="fas fa-user input_icon"></i>
                    <Form.Control name="username" type="string" placeholder="Username" value={data.username} onChange={updateData}/>
                </div>
                  <div className="mb-3 input_wrapper">
                    <i className="fas fa-key input_icon"></i>
                        <Form.Control name="password" type="password" placeholder="Password" value={data.password} onChange={updateData}/>
                  </div>
                  <div className="mb-3 input_wrapper">
                        <i className="far fa-address-card input_icon"></i>
                        <Form.Control name="firstName" type="string" placeholder="First Name" value={data.firstName} onChange={updateData}/>
                  </div>
                  <div className="mb-3 input_wrapper">
                        <i className="far fa-address-card input_icon"></i>
                        <Form.Control name="lastName" type="string" placeholder="Last Name" value={data.lastName} onChange={updateData}/>
                  </div>
                  <div className="mb-3 input_wrapper">
                        <i className="fas fa-phone input_icon"></i>
                        <Form.Control name="phone" type="phone" placeholder="Phone" value={data.phone} onChange={updateData}/>
                  </div>
                  <div className="mb-3 input_wrapper">
                        <i className="fas fa-envelope input_icon"></i>
                        <Form.Control name="email" type="email" placeholder="Email" value={data.email} onChange={updateData}/>
                  </div>
              </Form>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="primary" onClick={createClick}>
                  Register
               </Button>
               <Button variant="secondary" onClick={cancelClick}>
                  Cancel
               </Button>
            </Modal.Footer>
        </Modal>
        </>
    );
  }
  
  export default Register;