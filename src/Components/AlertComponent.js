import React, { useState } from 'react';
import Toast from 'react-bootstrap/Toast';

import moment from 'moment';


const AlertComponent = (props) => {
    const [showMe, setShowMe] = useState(true);

    const toggleShow = () => {
        setShowMe(!showMe);
    }

    return (
        
            <Toast bg="light" show={showMe} onClose={toggleShow}>
                <Toast.Header>
                    <strong className="me-auto">Upcoming Appointment</strong>
                </Toast.Header>
                <Toast.Body>
                    <p>Title: {props.appointment.title}</p>
                    <p>Client: {props.appointment.clientID}</p>
                    <p>Start Time: {moment(props.appointment.startTime).format("hh:mm a")}</p>
                </Toast.Body>
            </Toast>
        
    )
}

export default AlertComponent;