import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Row } from 'react-bootstrap';
import { useDispatch } from "react-redux";
import CalendarContextMenu from './CalendarContextMenu';
import moment from 'moment';
import { changeCurrentDay } from '../Redux/AppointmentSlice';


function CalendarDay(props) {
    const dispatch = useDispatch();
    const [createMenuIsOpen, setMenuIsOpen] = useState(false);
    const [X, setX] = useState(0);
    const [Y, setY] = useState(0);
    const [selectedDate, setSelectedDate] = useState(moment());
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

    const dayClicked = (event, info) => {
        // Create a moment object to be used to change the current day
        //setSelectedDate(moment().year(info.year).month(info.month).date(info.number));
        dispatch(changeCurrentDay(moment().year(info.year).month(info.month).date(info.number)));
        setX(event.clientX + window.pageXOffset);
        setY(event.clientY + window.pageYOffset);
        
        handleMenuEvent();
    }

    const eventClicked = (appointment) => {
        console.log(appointment);
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
        
        props.data.forEach((appointment) => {
            let appointmentDate = moment(appointment.appDate);
            if (appointmentDate.isSame(currentDate, 'day') ) {
                dayAppointments.push(appointment);
            }
        })
        
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
                            <span className="badge" key={"Badge" + i.toString()} onClick={ () => eventClicked(appointment) } style={{ backgroundColor: appointment.color }}>{ appointment.title }</span>
                        )})}
                    </Col>
                )
                })
                }</Row>
            )
            
        })}
        { createMenuIsOpen ? <CalendarContextMenu cx={ X } cy={ Y } closeMenu={ handleMenuEvent } /> : null }
        </>
    )
}

export default CalendarDay;