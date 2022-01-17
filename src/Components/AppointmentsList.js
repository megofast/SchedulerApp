import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getMonthlyAppointments } from '../Redux/AppointmentSlice';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Variables} from '../Data/Variables';
import axios from 'axios';
import moment from 'moment';

const AppointmentsList = (props) => {
    const { monthAppointments, loading, currentDay } = useSelector( (state) => state.appointmentReducer);
    const { token } = useSelector( (state) => state.loginReducer);
    const dispatch = useDispatch();

    useEffect( () => {
        let parameters = {
            month: currentDay.month(),
            year: currentDay.year(),
        };
        dispatch(getMonthlyAppointments(parameters));
    }, [dispatch, currentDay])

    const deleteClick = (id) => {
        if(window.confirm('Are you sure you want to delete this appointment?')) {
            axios.delete(Variables.API_URL + "appointment/" + id, {
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
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>ClientID</th>
                            <th>Date</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Notes</th>
                            <th>Color</th>
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(monthAppointments)
                        ? monthAppointments.map(appoint =>
                            <tr key = {appoint.appointmentID}>
                                <td>{appoint.title}</td>
                                <td>{appoint.clientID}</td>
                                <td>{moment(appoint.appDate).format("MM/DD/YYYY")}</td>
                                <td>{moment(appoint.startTime).format("hh:mm a")}</td>
                                <td>{moment(appoint.endTime).format("hh:mm a")}</td>
                                <td>{appoint.notes}</td>
                                <td className="border align-middle text-center"><i className="p-2" style={{ backgroundColor: appoint.color }} /></td>
                                <td>
                                    <button type="button" className="btn mr-1" data-bs-toggle="modal" data-bs-target="#modalOptions">
                                        <i className="far fa-edit" aria-hidden="true"></i>
                                    </button>
                                    <button type="button" className="btn mr-1" onClick={() => deleteClick(appoint.appointmentID)}>
                                        <i className="far fa-trash-alt"></i>
                                    </button>
                                </td>
                            </tr>
                        )
                        : null }
                    </tbody>
                </table>
            </div>
        )
    }
}

  export default AppointmentsList;