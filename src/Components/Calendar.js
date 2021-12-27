import React, { useState, useEffect } from 'react';
import {Variables} from '../Data/Variables'
import '../CSS/Calendar.css'
import { useDispatch, useSelector } from "react-redux";
import {Link} from 'react-router-dom';
import { Container, Row, Col, Button, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import CalendarDay from './CalendarDay';
import { moveCalendarToNextMonth, moveCalendarToPreviousMonth, getAppointments } from '../Redux/AppointmentSlice'

const Calendar = () => {
    const { monthAppointments, currentDay, today} = useSelector( (state) => state.appointmentReducer);
    const dispatch = useDispatch();
    const [active, setActive] = useState('month');
           
    useEffect( () => {
        dispatch(getAppointments());
        //dispatch(updateWeeklyAppointments(currentDay.toString()));
        
    }, [dispatch, currentDay])

    return (
        <Container fluid>
            <Row>
                <Col className="text-left">
                    <Button variant="secondary" className="m-1" onClick={() => dispatch(moveCalendarToPreviousMonth())}>
                        <i className="fas fa-chevron-left fa-fw me-3"></i><span>Previous</span>
                    </Button>
                    <Button variant="secondary" className="m-1" onClick={() => dispatch(moveCalendarToNextMonth())}>
                        <i className="fas fa-chevron-right fa-fw me-3"></i><span>Next</span>
                    </Button>
                </Col>
                <Col className="pb-2 text-center"><h3>{Variables.MONTHSLONG[currentDay.month()]} {currentDay.year()}</h3></Col>
                <Col className="text-center">
                    <ListGroup horizontal activeKey={active} onSelect={(selectedKey) => setActive(selectedKey)}>
                        <ListGroup.Item action eventKey='day' variant="secondary">Day</ListGroup.Item>
                        <ListGroup.Item action eventKey='week' variant="secondary" as={Link} to='/Calendar/Weekly' >Week</ListGroup.Item>
                        <ListGroup.Item action eventKey='month' variant="secondary" as={Link} to='/Calendar'>Month</ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row>
            <Row>
                {
                    Variables.WEEKDAYSLONG.map((weekday, i) => {
                    return <Col key={i} className="border bg-white"><p className="text-center fw-bold">{weekday}</p></Col>
                })
                }
            </Row>
                <CalendarDay data={ monthAppointments } today={ today } day={ currentDay } />
        </Container>
    );
  }
  
  export default Calendar;