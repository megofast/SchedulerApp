import React from 'react';
import moment from 'moment';
import { Form } from 'react-bootstrap';

const ListComponent = (props) => {
    
    return (
        <table className="table table-striped">
            <thead>
                <tr>
                    <th>Title {props.showFilterToggle ? <Form.Check className='mx-2' inline checked={props.filterState.title} type='switch' id='title' onChange={props.handleFilterStates} /> : null }</th>
                    <th>ClientID {props.showFilterToggle ? <Form.Check className='mx-2' checked={props.filterState.clientID} inline type='switch' id='clientID' onChange={props.handleFilterStates} /> : null }</th>
                    <th>Date {props.showFilterToggle ? <Form.Check className='mx-2' checked={props.filterState.date} inline type='switch' id='date' onChange={props.handleFilterStates} /> : null }</th>
                    <th>Start Time {props.showFilterToggle ? <Form.Check className='mx-2' checked={props.filterState.startTime} inline type='switch' id='startTime' onChange={props.handleFilterStates} /> : null }</th>
                    <th>End Time {props.showFilterToggle ? <Form.Check className='mx-2' checked={props.filterState.endTime} inline type='switch' id='endTime' onChange={props.handleFilterStates} /> : null }</th>
                    <th>Notes {props.showFilterToggle ? <Form.Check className='mx-2' checked={props.filterState.notes} inline type='switch' id='notes' onChange={props.handleFilterStates} /> : null }</th>
                    <th>Color</th>
                    <th>Options</th>
                </tr>
            </thead>
            <tbody>
                {Array.isArray(props.appointments)
                ? props.appointments.map(appoint =>
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
                            <button type="button" className="btn mr-1" onClick={() => props.handleDelete(appoint.appointmentID)}>
                                <i className="far fa-trash-alt"></i>
                            </button>
                        </td>
                    </tr>
                )
                : null }
            </tbody>
        </table>
    )
}

export default ListComponent;