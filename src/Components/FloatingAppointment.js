import React, { useEffect, useState } from 'react';
//import 'bootstrap/dist/css/bootstrap.min.css';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import { getWeeklyAppointments, getDailyAppointments } from '../Redux/AppointmentSlice';
import {Variables} from '../Data/Variables';
import moment from 'moment';
import axios from 'axios';
import EditEvent from '../Components/EditEvent';
import { fixContrastColor } from '../Data/contrastData';


function translateTimeToPositionId(time, daily) {
    let timeMoment = moment(time);
    let hour = timeMoment.hour();
    let minute = timeMoment.minute();
    let day = timeMoment.day();
    // Adjust hour based on the modified start time of the timeline, since midnight was 0, 8am would be -8 hours.
    hour = hour - Variables.STARTTIMEINT;
    let gridHour = (hour * 2);
    if (minute >= 30) {
        gridHour = gridHour + 1;
    }
    if (daily) {
        return gridHour;
    } else {
        return (gridHour * 7 + day);
    }
}

// This function will adjust the floating layer up or down depending on the exact minutes
// Each column is 45px tall, 30 minutes per column, thus 1.5 x minutes = pixels.
function getAdjustedPosition(time) {
    let timeMoment = moment(time);
    let adjustedPixels = 0;

    if (timeMoment.minute() === 0 || timeMoment.minute() === 30) {
        adjustedPixels = 0;
    } else {
        if (timeMoment.minute() > 30) {
            adjustedPixels = (timeMoment.minute() - 30) * 1.5;
        } else {
            adjustedPixels = timeMoment.minute() * 1.5;
        }
    }

    return adjustedPixels;
}

function FloatingAppointment(props) {
    const { currentDay } = useSelector( (state) => state.appointmentReducer);
    const { token } = useSelector( (state) => state.loginReducer);
    const [appSummaryShow, setAppSummaryShow] = useState(false);
    const dispatch = useDispatch();
    let position = {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        bottom: 0,
    }

    // All Data for the edit button
    const [editModalIsOpen, setEditModalIsOpen] = useState(false);
    
    const [editTarget, setEditTarget] = useState({
        employeeID: "",
        clientID: "",
        appDate: "",
        startTime: "",
        endTime: "",
        notes: "",
        title: "",
        color: ""
    });

    const handleEditClick = (data) => {
        setEditTarget(data);
        
        setEditModalIsOpen(!editModalIsOpen);
    }

    const handleEditClose = () => {
        // send as a prop so when the add/edit window is close the state is reset.
        setEditModalIsOpen(!editModalIsOpen);
        setEditTarget({
            employeeID: "",
            clientID: "",
            appDate: "",
            startTime: "",
            endTime: "",
            notes: "",
            title: "",
            color: ""
        });
    }

    if (props.references.current[translateTimeToPositionId(props.data.startTime, props.daily)] !== undefined) {
        position.left = props.references.current[translateTimeToPositionId(props.data.startTime, props.daily)].getBoundingClientRect().left + window.pageXOffset;
        position.top = props.references.current[translateTimeToPositionId(props.data.startTime, props.daily)].getBoundingClientRect().top + getAdjustedPosition(props.data.startTime) + window.pageYOffset;
        position.width = props.references.current[translateTimeToPositionId(props.data.startTime, props.daily)].getBoundingClientRect().width;
        position.height = props.references.current[translateTimeToPositionId(props.data.endTime, props.daily)].getBoundingClientRect().top -
                        props.references.current[translateTimeToPositionId(props.data.startTime, props.daily)].getBoundingClientRect().top;
        if (getAdjustedPosition(props.data.startTime) > 0) {
            // Handle the height of the appointment box based on the adjusted start position and the end time
            let time = moment(props.data.endTime);
            if (time.minute() !== 0 || time.minute() !== 30) {
                // Subtract the size added from the adjusted start time and then add the adjusted size based on the end time
                position.height = position.height - getAdjustedPosition(props.data.startTime);
                position.height = position.height + getAdjustedPosition(time);
            }
        } else {
            // If the end time is greater than the time slot allotted then it must be added in proportion in size
            let time = moment(props.data.endTime);
            if (time.minute() !== 0 || time.minute() !== 30 ) {
                // The minutes are not at a grid point, make an adjustment to the height
                position.height = position.height + getAdjustedPosition(time);
            } 
        }
        position.bottom = props.references.current[translateTimeToPositionId(props.data.endTime, props.daily)].getBoundingClientRect().top;
    }

    useEffect( () => {
        function handleResize() {
            //console.log(document.getElementById('0-0').getBoundingClientRect());
        }

        window.addEventListener('resize', handleResize)
    });

    const appClicked = (event) => {
        setAppSummaryShow(!appSummaryShow);
    }

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
                dispatch(getWeeklyAppointments(parameters));

                parameters = {
                    date: currentDay.format('YYYY-MM-DD'),
                }
                dispatch(getDailyAppointments(parameters));
                alert(response.data);
            })
            .catch(error => {
                // Failed
                alert('Failed to delete appointment.');
                console.log(error);
            });

            
        }
    }

    const appointmentPopover = (appointment) => {
        return (
            <Popover id="popover-appointment">
                <Popover.Header as="h3">{appointment.title}</Popover.Header>
                <Popover.Body>
                {moment(appointment.startTime).format('h:mm a')} - {moment(appointment.endTime).format('h:mm a')} <br />
                    Client: {appointment.clientID} <br />
                    Notes: {appointment.notes} <br />
                    <button type="button" className="btn mr-1" onClick={ () => handleEditClick(appointment) }>
                        <i className="far fa-edit" aria-hidden="true"></i>
                    </button>
                    <button type="button" className="btn mr-1" onClick={() => deleteClick(appointment.appointmentID)}>
                        <i className="far fa-trash-alt"></i>
                    </button>
                </Popover.Body>
            </Popover>
        )
    }

    return (
        <>
        <OverlayTrigger rootClose='true' trigger="click" placement="auto" onExited={ appClicked } overlay={appointmentPopover(props.data)}>
        <div className='layer cursor-pointer' style={{ backgroundColor: props.data.color, color: fixContrastColor(props.data.color),
            borderColor: props.data.color,
            left: position.left,
            top: position.top,
            width: position.width,
            height: position.height
        }} >
            { 
            props.daily ?
                <p className='m-2 text-center'>
                    <b>{props.data.title}</b><br />
                    {moment(props.data.startTime).format('h:mm a')} - {moment(props.data.endTime).format('h:mm a')} <br />
                    Client: {props.data.clientID} <br />
                    Notes: {props.data.notes}
                </p>
            : 
            <p className='m-2 text-center'>
                <b>{props.data.title}</b><br />
                {moment(props.data.startTime).format('h:mm a')} - <br />
                {moment(props.data.endTime).format('h:mm a')}
            </p>
            }
        </div>
        </OverlayTrigger>
        <EditEvent createModalOpen={editModalIsOpen} handleCreateModalOpen={handleEditClick} data={editTarget} handleEditClose={handleEditClose} />
        </>
    )
}

export default FloatingAppointment;