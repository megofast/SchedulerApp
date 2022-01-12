import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Variables} from '../Data/Variables';
import { ListGroup } from 'react-bootstrap';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { changeCurrentDay } from '../Redux/AppointmentSlice';
import NewEvent from '../Components/NewEvent';
import moment from 'moment';


function CalendarContextMenu(props) {
    const { currentDay } = useSelector( (state) => state.appointmentReducer);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [createModalIsOpen, setModalIsOpen] = useState(false);
    const currDate = moment(currentDay);        // Create temporary date to keep state mutation from occuring by using currentDate
    const [date, setDate] = useState(currDate.format('YYYY-MM-DD'));

    const handleCreateModalEvent = () => {
        setModalIsOpen(!createModalIsOpen);
        if (createModalIsOpen) {
            props.closeMenu();
        }
    }

    const handleCancel = () => {
        props.closeMenu();
    }

    const handleAdd = () => {
        handleCreateModalEvent();
    }

    const handleViewDay = () => {
        dispatch(changeCurrentDay(moment(date)));
        navigate('/Calendar/Day');
    }

    return (
        <>
        <div className='layer border shadow' style={{ backgroundColor: 'white', 
            left: (props.cx > (window.innerWidth - 150)) ? props.cx - 150 : props.cx,
            top: (props.cy > (window.innerheight - 120)) ? props.cy - 120 : props.cy,
            width: '150px',
            height: '120px'
        }} >
            <ListGroup variant="flush">
                <ListGroup.Item action onClick={ () => handleAdd() }>Add New Event</ListGroup.Item>
                <ListGroup.Item action onClick={ () => handleViewDay() }>View Day</ListGroup.Item>
                <ListGroup.Item action onClick={ () => handleCancel() }>Cancel Selection</ListGroup.Item>
            </ListGroup>
        </div>
        <NewEvent createModalOpen={createModalIsOpen} handleCreateModalOpen={handleCreateModalEvent} start='' end='' date={ date }/>
        </>
    )
}

export default CalendarContextMenu;