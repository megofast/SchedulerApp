import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import {Variables} from '../Data/Variables';
import moment from 'moment';
import '../CSS/MiniWeeklySummary.css';


function translateTimeToPositionId(time) {
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
    // Offset +1 to accomodate for position 0 being the label.
    return gridHour + 1;
}

const MiniWeeklySummary = (props) => {
    let weekDays = [];
    for (let x = 0; x < 7; x++) {
        weekDays.push([]);
    }

    for (let day = 0; day < 7; day++) {
        for (let timeSlot = 0; timeSlot < Variables.TIMES.length + 1; timeSlot++) {
            let slotInfo = {
                dayOfWeekNum: day,
                timeSlot: timeSlot,
                booked: false,
                color: '000000'
            }
            props.appointments.forEach( (appointment) => {
                if (day === moment(appointment.startTime).day() && timeSlot >= translateTimeToPositionId(appointment.startTime) && timeSlot < translateTimeToPositionId(appointment.endTime))  {
                    slotInfo.booked = true;
                    slotInfo.color = appointment.color;
                }
            });
            weekDays[day].push(slotInfo);
        }
    }

    return (
        <Card className="border shadow">
            <Card.Header as="h6"><div className="text-xs font-weight-bold text-uppercase mb-1">
                        Week at a Glance</div></Card.Header>
            <Card.Body>
                <Container>
                    <Row> {
                        Variables.TIMESSHORT.map((time, i) => {
                            if (i === 0) {
                                return <Col lg={1} key={i} className="border bg-white"></Col>
                            } else {
                                return <Col key={i} className="border bg-white smallLabels">{time}</Col>
                            }
                        })
                    }
                    </Row>
                    {
                        weekDays.map((day, di) => {
                            return (
                                <Row key={di}>{
                                day.map((timeSlot, i) => {
                                    // If this is the first column of the row label the row with the day
                                    if ( i === 0) {
                                        return (
                                        <Col lg={1} key={i} className="border bg-white smallLabels">{ Variables.WEEKDAYSSHORT[di] }</Col>
                                        );
                                    }
                                    else {
                                        
                                        if (timeSlot.booked) {
                                            return (
                                                <Col key={i} className="border" style={{ backgroundColor: timeSlot.color }}></Col>
                                            )
                                        } else {
                                            return (
                                                <Col key={i} className="border bg-white"></Col>
                                            )
                                        }
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

export default MiniWeeklySummary;