import React, { useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../CSS/Weekly.css'
import { Col, Container, Row} from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import FloatingAppointment from './FloatingAppointment';
import DailyContextMenu from './DailyContextMenu';
import { addSelectedCell, resetSelectedCells, removeLastSelectedCell } from '../Redux/AppointmentSlice';


function DayCell(props) {
    const { dailyAppointments, selectedCells } = useSelector( (state) => state.appointmentReducer);
    const dispatch = useDispatch();
    const gridRefs = useRef([]);
    let dailySchedule = [];
    const [mouseIsDown, setMouseIsDown] = useState(false);
    const [createMenuIsOpen, setMenuIsOpen] = useState(false);
    const [X, setX] = useState(0);
    const [Y, setY] = useState(0);
    const [startId, setStartId] = useState(0);

    const handleMenuEvent = () => {
        setMenuIsOpen(!createMenuIsOpen);
    }

    const clearSelections = () => {
        // This function will remove the colored cells so that new selections can be made
        for (let cell in selectedCells) {
            gridRefs.current[selectedCells[cell]].style.backgroundColor = 'white';
        }
        dispatch(resetSelectedCells());
    }

    const mouseStart = (event) => {
        clearSelections();
        if (createMenuIsOpen) {
            handleMenuEvent();
        }
        event.target.style.backgroundColor = '#e6ffe6';
        setMouseIsDown(true);
        setStartId(event.target.id);
        dispatch(addSelectedCell(event.target.id));
    }

    const mouseEnd = (event) => {
        event.target.style.backgroundColor = '#ffe6e6';
        setMouseIsDown(false);
        // Bring up the context menu asking to creat an appointment in this slot
        setX(event.clientX + window.pageXOffset);
        setY(event.clientY + window.pageYOffset);
        dispatch(addSelectedCell(event.target.id));
        handleMenuEvent();
    }

    const mouseSelected = (event) => {
        if (mouseIsDown) {
            if (parseInt(event.target.id) < selectedCells[selectedCells.length - 1]) {
                // The cursor was moved back to a previous cell, remove the highlighting from the cell below
                gridRefs.current[selectedCells[selectedCells.length - 1]].style.backgroundColor = 'white';
                dispatch(removeLastSelectedCell());
            } else {
                event.target.style.backgroundColor = '#f0f0f0';
                dispatch(addSelectedCell(event.target.id));
            }
        }
    }

    const preventDrag = (event) => {
        event.preventDefault();
    }
    
    // Change 48 for dynamic time mapping. When the user sets options for less hours on the scheduler
    // Make the grid in the background, assigning IDs to each column to use for position of appointment layer
    for (let hour = 0; hour < 48; hour++) {
        let hourlySchedule = {
            reference: hour,
            key: "hour" + hour.toString(),
        }
        dailySchedule.push(hourlySchedule);
    }

    return (
        <Container className='p-0 m-0'>
            {
            dailySchedule.map((hour, i) => {
                
                return (
                    <Row key={"row" + i.toString()}> {
                        <Col key={hour.key} 
                            id={hour.reference}
                            ref={ (element) => gridRefs.current[hour.reference] = element} 
                            className='col-height addBorders schedule-cell' 
                            onMouseDown={ mouseStart } 
                            onMouseUp={ mouseEnd } 
                            onMouseOver={ mouseSelected }
                            onDragStart={ preventDrag }
                            >
                            <p className='half-time'></p>
                        </Col>
                    }</Row>
                )
                
            })} {
            dailyAppointments.map( (appointment, i) => {
                return (
                <FloatingAppointment key={i} data={appointment} references={gridRefs} daily={true} />
                )
            })
            }
            { createMenuIsOpen ? <DailyContextMenu cx={ X } cy={ Y } closeMenu={ handleMenuEvent } clearSelections={ clearSelections } /> : null }
        </Container>
        
    )
}

export default DayCell;