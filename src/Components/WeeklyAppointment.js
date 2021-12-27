import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';

function translateTimeToPositionId(time) {
    let timeMoment = moment(time);
    let hour = timeMoment.hour();
    let minute = timeMoment.minute();
    let day = timeMoment.day();
    let gridHour = (hour * 2);
    if (minute >= 30) {
        gridHour = gridHour + 1;
    }

    return (gridHour * 7 + day);
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

function WeeklyAppointment(props) {
    let position = {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        bottom: 0,
    }

    

    if (props.references.current[translateTimeToPositionId(props.data.startTime)] !== undefined) {
        position.left = props.references.current[translateTimeToPositionId(props.data.startTime)].getBoundingClientRect().left;
        position.top = props.references.current[translateTimeToPositionId(props.data.startTime)].getBoundingClientRect().top + getAdjustedPosition(props.data.startTime) + window.pageYOffset;
        position.width = props.references.current[translateTimeToPositionId(props.data.startTime)].getBoundingClientRect().width;
        position.height = props.references.current[translateTimeToPositionId(props.data.endTime)].getBoundingClientRect().top -
                        props.references.current[translateTimeToPositionId(props.data.startTime)].getBoundingClientRect().top;
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
        position.bottom = props.references.current[translateTimeToPositionId(props.data.endTime)].getBoundingClientRect().top;
    }

    

    useEffect( () => {
        function handleResize() {
            //console.log(document.getElementById('0-0').getBoundingClientRect());
        }

        window.addEventListener('resize', handleResize)
    });

    return (
        <div className='layer' style={{ backgroundColor: props.data.color, 
            borderColor: props.data.color,
            left: position.left,
            top: position.top,
            width: position.width,
            height: position.height
        }} >
            <p className='m-2 text-center'>
                <b>{props.data.title}</b><br />
                {moment(props.data.startTime).format('h:mm a')} - <br />
                {moment(props.data.endTime).format('h:mm a')}
            </p>
        </div>
    )
}

export default WeeklyAppointment;