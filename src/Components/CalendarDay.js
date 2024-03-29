import React, { useState } from 'react';
//import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, OverlayTrigger, Row, Popover } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import CalendarContextMenu from './CalendarContextMenu';
import moment from 'moment';
import { changeCurrentDay, getMonthlyAppointments } from '../Redux/AppointmentSlice';
import {Variables} from '../Data/Variables';
import axios from 'axios';
import EditEvent from '../Components/EditEvent';
import { fixContrastColor } from '../Data/contrastData';


function CalendarDay(props) {
    const { currentDay } = useSelector( (state) => state.appointmentReducer);
    const { token } = useSelector( (state) => state.loginReducer);
    const dispatch = useDispatch();
    const [createMenuIsOpen, setMenuIsOpen] = useState(false);
    const [appSummaryShow, setAppSummaryShow] = useState(false);
    const [X, setX] = useState(0);
    const [Y, setY] = useState(0);

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

    const handleMenuEvent = () => {
        setMenuIsOpen(!createMenuIsOpen);
    }

    let firstDayOfMonth = moment(props.day);
    firstDayOfMonth.date(1);
    let weekdayOfFirstDay = firstDayOfMonth.day();
    let currentDays = [];
    for (let x = 0; x < 6; x++) {
        currentDays.push([]);
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

    const appClicked = (event) => {
        setAppSummaryShow(!appSummaryShow);
    }

    const dayClicked = (event, info) => {
        // This conditional block prevents event propogation to the parent
        if (event.target.tagName === 'DIV' && event.target.classList.contains('calendar-day') && appSummaryShow === false) {
            dispatch(changeCurrentDay(moment().year(info.year).month(info.month).date(info.number)));
            setX(event.clientX + window.pageXOffset);
            setY(event.clientY + window.pageYOffset);
            
            handleMenuEvent();
        }
    }

    let rowNumber = 0;
    for (let day = 0; day < 42; day++) {
        if (day === 0 && weekdayOfFirstDay === 0) {
          firstDayOfMonth.subtract(7, 'days');
        } else if (day === 0) {
          firstDayOfMonth.add((day - weekdayOfFirstDay), 'days');
        } else {
          firstDayOfMonth.add(1, 'days');
        }
        
        // Loop through all appointments this month and assign appointments for each day that matches to the day object
        let currentDate = moment(firstDayOfMonth);
        let dayAppointments = [];
        
        // If for some reason the props do not come through this will prevent an exception from occuring
        if (Array.isArray(props.data)) {
            props.data.forEach((appointment) => {
                let appointmentDate = moment(appointment.appDate);
                if (appointmentDate.isSame(currentDate, 'day') ) {
                    dayAppointments.push(appointment);
                }
            })
        }
        
        let calendarDay = {
          currentMonth: (firstDayOfMonth.month() === props.day.month()),
          month: firstDayOfMonth.month(),
          number: firstDayOfMonth.date(),
          selected: (firstDayOfMonth.isSame(props.day, 'day')),
          isToday: (firstDayOfMonth.isSame(props.today, 'day')),
          year: firstDayOfMonth.year(),
          key: "day" + day.toString(),
          appointments: dayAppointments
        }
        
        if ( day % 7 === 0) {
            rowNumber++;
        }
        currentDays[rowNumber - 1].push(calendarDay);
    }

    return (
        <> {
        currentDays.map((row, i) => {
            
            return (
                <Row key={"row" + i.toString()}> {
                row.map((day) => {
                
                return (
                    
                    <Col key={day.key} name={day.key} className={"border calendar-day" + (day.currentMonth ? " current" : "") + (day.selected ? " selected" : "") + (day.isToday ? " today" : "")}
                            onClick={ (e) => {dayClicked(e, day); }}>
                        <p>{day.number}</p>
                        {day.appointments.map((appointment, i) => {
                            return (
                            <OverlayTrigger key={i} rootClose="true" trigger="click" placement="auto" onExited={ appClicked } overlay={appointmentPopover(appointment)}>
                                <span className="badge cursor-pointer" key={"Badge" + i.toString()} onClick={ appClicked } style={{ backgroundColor: appointment.color, color: fixContrastColor(appointment.color) }}>{ appointment.title }</span>
                            </OverlayTrigger>
                        )})}
                    </Col>
                )
                })
                }</Row>
            )
            
        })}
        { createMenuIsOpen ? <CalendarContextMenu cx={ X } cy={ Y } closeMenu={ handleMenuEvent } /> : null }
        <EditEvent createModalOpen={editModalIsOpen} handleCreateModalOpen={handleEditClick} data={editTarget} handleEditClose={handleEditClose} />
        </>
    )
}

export default CalendarDay;