import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Variables} from '../Data/Variables';
import { ListGroup } from 'react-bootstrap';
import { useSelector } from "react-redux";
import NewEvent from '../Components/NewEvent';
import moment from 'moment';


function translatePositionIdToTime(positionId, end) {
    let day = positionId % 7;
    let gridHour = positionId;
    let hour = 0;
    if (day === 0) {
        gridHour = positionId / 7;
    } else {
        gridHour = gridHour - day;
        gridHour = gridHour / 7;
    }
    if (end) {
        if (gridHour === 47) {
            hour = Variables.TIMES24[0];
        } else {
            hour = Variables.TIMES24[gridHour + 1];
        }
    } else {
        hour = Variables.TIMES24[gridHour];
    }
    return hour;
}

function getDay(positionId) {
    return positionId % 7;
}

function WeeklyContextMenu(props) {
    const { selectedCells, currentDay } = useSelector( (state) => state.appointmentReducer);
    const [createModalIsOpen, setModalIsOpen] = useState(false);
    const currDate = moment(currentDay);        // Create temporary date to keep state mutation from occuring by using currentDate
    const [startTime, setStartTime] = useState(translatePositionIdToTime(selectedCells[0], false));
    const [endTime, setEndTime] = useState(translatePositionIdToTime(selectedCells[selectedCells.length - 1], true));
    const [date, setDate] = useState(currDate.day(getDay(selectedCells[0])).format('YYYY-MM-DD'));

    const handleCreateModalEvent = () => {
        setModalIsOpen(!createModalIsOpen);
        if (createModalIsOpen) {
            props.closeMenu();
        }
    }

    const handleCancel = () => {
        props.closeMenu();
        props.clearSelections();
    }

    const handleAdd = () => {
        handleCreateModalEvent();
        props.clearSelections();
    }

    return (
        <>
        <div className='layer border shadow' style={{ backgroundColor: 'white', 
            left: props.cx,
            top: props.cy,
            width: '150px',
            height: '120px'
        }} >
            <ListGroup variant="flush">
                <ListGroup.Item action onClick={ () => handleAdd() }>Add New Event</ListGroup.Item>
                <ListGroup.Item action>Go To Day View</ListGroup.Item>
                <ListGroup.Item action onClick={ () => handleCancel() }>Cancel Selection</ListGroup.Item>
            </ListGroup>
        </div>
        <NewEvent createModalOpen={createModalIsOpen} handleCreateModalOpen={handleCreateModalEvent} start={ startTime } end={ endTime } date={ date }/>
        </>
    )
}

export default WeeklyContextMenu;