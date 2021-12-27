import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getAppointments } from '../Redux/AppointmentSlice';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Variables} from '../Data/Variables';

const AppointmentsList = (props) => {
    const { appointments, loading } = useSelector( (state) => state.appointmentReducer);
    const dispatch = useDispatch();

    useEffect( () => {
        dispatch(getAppointments());
    }, [dispatch])

    const deleteClick = (id) => {
        if(window.confirm('Are you sure you want to delete this appointment?')) {
            fetch(Variables.API_URL + 'appointment/' + id, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then((result) => {
                dispatch(getAppointments());
                alert(result);
            }, (error) => {
                alert('Failed to delete appointment.');
            });
        }
    }

    if (loading) {
        return (
            <div>loading...</div>
        )
    } else {
        return (
            <div>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>appointmentID</th>
                            <th>title</th>
                            <th>employeeID</th>
                            <th>clientID</th>
                            <th>appDate</th>
                            <th>startTime</th>
                            <th>endTime</th>
                            <th>notes</th>
                            <th>color</th>
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map(appoint =>
                            <tr key = {appoint.appointmentID}>
                                <td>{appoint.appointmentID}</td>
                                <td>{appoint.title}</td>
                                <td>{appoint.employeeID}</td>
                                <td>{appoint.clientID}</td>
                                <td>{appoint.appDate}</td>
                                <td>{appoint.startTime}</td>
                                <td>{appoint.endTime}</td>
                                <td>{appoint.notes}</td>
                                <td>{appoint.color}</td>
                                <td>
                                    <button type="button" className="btn mr-1" data-bs-toggle="modal" data-bs-target="#modalOptions">
                                        <i className="far fa-edit" aria-hidden="true"></i>
                                    </button>
                                    <button type="button" className="btn mr-1" onClick={() => deleteClick(appoint.appointmentID)}>
                                        <i className="far fa-trash-alt"></i>
                                    </button>
                                </td>
                            </tr>
                            )}
                    </tbody>
                </table>
            </div>
        )
    }
}

  export default AppointmentsList;