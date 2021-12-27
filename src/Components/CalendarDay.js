import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Row, Popover} from 'react-bootstrap';
import moment from 'moment';


const context_menu = (
    <Popover id = 'options-menu'>
        <Popover.Header>Header</Popover.Header>
        <Popover.Body>This is the body of the menu</Popover.Body>
    </Popover>
);

function CalendarDay(props) {
    let firstDayOfMonth = moment(props.day);
    firstDayOfMonth.date(1);
    let weekdayOfFirstDay = firstDayOfMonth.day();
    let currentDays = [];
    for (let x = 0; x < 6; x++) {
        currentDays.push([]);
    }

    const dayClicked = (event) => {
        console.log(event);
    }

    const eventClicked = (event) => {
        console.log("event");
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
          date: firstDayOfMonth,
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
        
        currentDays.map((row, i) => {
            
            return (
                <Row key={"row" + i.toString()}> {
                row.map((day) => {
                
                return (
                    
                    <Col key={day.key} name={day.key} className={"border calendar-day" + (day.currentMonth ? " current" : "") + (day.selected ? " selected" : "") + (day.isToday ? " today" : "")}
                            onClick={dayClicked}>
                        <p>{day.number}</p>
                        {day.appointments.map((appointment, i) => {
                            return (
                            <span className="badge" key={"Badge" + i.toString()} onClick={() => eventClicked()} style={{ backgroundColor: appointment.color }}>{ appointment.title }</span>
                        )})}
                    </Col>
                )
                })
                }</Row>
            )
            
        })
    )
}

export default CalendarDay;