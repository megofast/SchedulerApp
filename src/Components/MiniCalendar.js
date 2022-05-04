import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import {Variables} from '../Data/Variables';
import moment from 'moment';

const MiniCalendar = (props) => {

    // Setup variables for mini-calendar
    // Get first of the current month to find the number of the weekday the first is
    
    let firstOfMonth = moment(props.today);
    let firstDayOfWeek = firstOfMonth.date(1).day();
    
    // Create an array to store the total number of appointments for each day
    let appointmentsPerDay = [];

    // Create an array with the total number of days for the month
    let monthDays = [];
    for (let x = 0; x < 6; x++) {
        monthDays.push([]);
    }

    // Fill the array with 0 appointments for each day of the month
    for (let x = 0; x <= firstOfMonth.daysInMonth(); x++) {
        appointmentsPerDay.push(0);
    }

    // Loop through all the appointments and create an array housing all the daily appointment counts
    props.appointments.forEach( (appointment) => {
        appointmentsPerDay[moment(appointment.appDate).date()] = appointmentsPerDay[moment(appointment.appDate).date()] + 1;
    });

    // Keep track of the week number
    let weekNumber = 0;

    for (let x = 0; x < 42; x++) {
        if (x < firstDayOfWeek) {
            // Empty days at the beginning of the month until the first weekday of the month is reached
            let day = {
                date: 0,
                appointments: 0
            }
            
            if ( x % 7 === 0) {
                weekNumber++;
            }
            monthDays[weekNumber - 1].push(day);
        } else {
            // Leave empty spots before the days start counting because the first day of the month is not sunday.
            if (firstOfMonth.month() !== props.today.month()) {
                // The month has changed, only add blanks until the end of the week
                let y = x;
                while ( y % 7 !== 0) {
                    // Don't increase the week because there is no need for empty weeks
                    let day = {
                        date: 0,
                        appointments: 0
                    }
                    monthDays[weekNumber - 1].push(day);
                    y++;
                }
                break;

            } else {
                let day = {
                    date: firstOfMonth.date(),
                    appointments: appointmentsPerDay[firstOfMonth.date()]
                }
                
                if ( x % 7 === 0) {
                    weekNumber++;
                }
                monthDays[weekNumber - 1].push(day);
            }

            // Advance to the next day, only if the first weekday of the month has been reached
            firstOfMonth.add(1, 'd');
        }
    }

    return (
        <Card className="border shadow">
            <Card.Header as="h6"><div className="text-xs font-weight-bold text-uppercase mb-1">
                        Month at a Glance</div></Card.Header>
            <Card.Body>
                <Container>
                    <Row> {
                        Variables.WEEKDAYSSHORT.map((weekday, i) => {
                            return <Col key={i} className="border bg-white"><p className="text-center fw-bold">{weekday}</p></Col>
                        })
                    }
                    </Row>
                    {
                        monthDays.map((week, wi) => {
                            return (
                                <Row key={wi}>{
                                week.map((day, i) => {
                                    if (day.date === 0) {
                                        return <Col key={i} className="border bg-white"></Col>
                                    } else {
                                        return (
                                            <Col key={i} className="border bg-white">
                                                <div className="fs-6">{day.date}</div>
                                                <div className="fs-5 text-center">{day.appointments === 0 ? " - " : day.appointments}</div>
                                            </Col>
                                        )
                                    }
                                })
                            }</Row>)
                        })
                    }
                </Container>
            </Card.Body>
        </Card>
    );
}

export default MiniCalendar;