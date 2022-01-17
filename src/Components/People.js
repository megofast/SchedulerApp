import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getEmployeeList } from '../Redux/EmployeeSlice';
import { getClientList } from '../Redux/ClientSlice';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import {Variables} from '../Data/Variables';
import axios from 'axios';
import NewClient from './NewClient';

const People = (props) => {
    const { employees, loading } = useSelector( (state) => state.employeeReducer);
    const { clients } = useSelector( (state) => state.clientReducer);
    const { token } = useSelector( (state) => state.loginReducer);
    const dispatch = useDispatch();

    const [createModalIsOpen, setModalIsOpen] = useState(false);
    const [editTarget, setEditTarget] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
    });

    const handleCreateModalEvent = () => {
        setModalIsOpen(!createModalIsOpen);
    }

    const handleEditClick = (target) => {
        setEditTarget(target);
        handleCreateModalEvent();
    }

    const handleEditClose = () => {
        // send as a prop so when the add/edit window is close the state is reset.
        setEditTarget({
            firstName: "",
            lastName: "",
            phone: "",
            email: "",
        });
    }

    useEffect( () => {
        // Dispatch events to get employees and clients
        dispatch(getEmployeeList());
        dispatch(getClientList());
    }, [dispatch])

    const deleteClick = (id, role) => {
        if(window.confirm('Are you sure you want to delete this appointment?')) {
            axios.delete(Variables.API_URL + "client/" + id, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                // Success
                dispatch(getClientList());
                alert(response.data);
            })
            .catch(error => {
                // Failed
                alert('Failed to delete appointment.');
                console.log(error);
            });

            
        }
    }

    if (loading) {
        return (
            <div><i className="fa fa-spinner fa-spin"></i></div>
        )
    } else {
        return (
            <div>
                <Button variant="primary" onClick={handleCreateModalEvent}>
                    <i className="fas fa-plus"></i>&nbsp;&nbsp;Add New Client
                </Button>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(employees)
                        ? employees.map(employee =>
                            <tr key = {employee.employeeID}>
                                <td>{employee.firstName} {employee.lastName}</td>
                                <td>{employee.phone}</td>
                                <td>{employee.email}</td>
                                <td>Employee</td>
                                <td>None</td>
                            </tr>
                        )
                        : null }
                        {Array.isArray(clients)
                        ? clients.map(client =>
                            <tr key = {client.clientID}>
                                <td>{client.firstName} {client.lastName}</td>
                                <td>{client.phone}</td>
                                <td>{client.email}</td>
                                <td>Client</td>
                                <td>
                                    <button type="button" className="btn mr-1" onClick={ () => handleEditClick(client) }>
                                        <i className="far fa-edit" aria-hidden="true"></i>
                                    </button>
                                    <button type="button" className="btn mr-1" onClick={() => deleteClick(client.clientID)}>
                                        <i className="far fa-trash-alt"></i>
                                    </button>
                                </td>
                            </tr>
                        )
                        : null }
                    </tbody>
                </table>
                <NewClient createModalOpen={createModalIsOpen} handleCreateModalOpen={handleCreateModalEvent} target={editTarget} closeEdit={handleEditClose} />
            </div>
        )
    }
}

  export default People;