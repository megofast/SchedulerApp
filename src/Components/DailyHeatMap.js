import moment from 'moment';
import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { Variables } from '../Data/Variables';
import { fixContrastColor } from '../Data/contrastData';

function translateTimeToPositionId(time) {
    let timeMoment = moment(time);
    let hour = timeMoment.hour();
    let minute = timeMoment.minute();
    // Adjust hour based on the modified start time of the timeline, since midnight was 0, 8am would be -8 hours.
    hour = hour - Variables.STARTTIMEINT;
    let gridHour = (hour * 2);
    if (minute >= 30) {
        gridHour = gridHour + 1;
    }
    // Offset +1 to accomodate for position 0 being the label.
    return gridHour + 1;
}

const DailyHeatMap = (props) => {
    let appointmentGrid = [];
    for (let timeSlot = 0; timeSlot < Variables.TIMES24.length; timeSlot++) {
        // Loop through all the time slots and build the array to display what slots are open
        let slotInfo = {
            label: Variables.TIMESSHORT[timeSlot],
            occupied: false,
            color: "#ffffff"
        }
        props.appointments.forEach( (appointment) => {
            if (timeSlot >= translateTimeToPositionId(appointment.startTime) && timeSlot < translateTimeToPositionId(appointment.endTime)) {
                    // There is an appointment in this timeslot, mark it as such
                    slotInfo = {
                        label: Variables.TIMESSHORT[timeSlot],
                        occupied: true,
                        color: appointment.color
                    }
            }
        });
        appointmentGrid.push(slotInfo);
    }

    return (
        <Container>

            <Row>
                {
                    appointmentGrid.map( (info, i) => {
                        return(<Col key={i} className="border smallLabels" style={{ backgroundColor: info.color, color: fixContrastColor(info.color) }}>{info.label}</Col>)
                    })
                }
            </Row>
        </Container>
    )
}

export default DailyHeatMap;