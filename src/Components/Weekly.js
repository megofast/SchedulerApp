import React, { useState, useEffect } from 'react';
import {Variables} from '../Data/Variables';
import '../CSS/Weekly.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Container, Row, Button, ListGroup, Badge } from 'react-bootstrap';
import {Link} from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { getWeeklyAppointments, moveToNextWeek, moveToPreviousWeek } from '../Redux/AppointmentSlice';
import WeeklyCell from './WeeklyCell';
import moment from 'moment';


function Weekly(props) {
    const { currentDay, today } = useSelector( (state) => state.appointmentReducer);
    let weeklyDay = moment(currentDay);     // Must use new variable to prevent state mutation without redux action
    const [active, setActive] = useState('week');
    const dispatch = useDispatch();

    useEffect( () => {
        // Get current weeks appointments
        let parameters = {
            startDate: weeklyDay.day(0).format('YYYY-MM-DD'),
            endDate: weeklyDay.day(6).format('YYYY-MM-DD'),
        }

        dispatch(getWeeklyAppointments(parameters));
    }, [dispatch, currentDay])
    
    return (
        <Container>
            <Row>
                <Col className="text-left">
                    <Button variant="secondary" className="m-1" onClick={() => dispatch(moveToPreviousWeek())}>
                        <i className="fas fa-chevron-left fa-fw me-3"></i><span>Previous</span>
                    </Button>
                    <Button variant="secondary" className="m-1" onClick={() => dispatch(moveToNextWeek())}>
                        <i className="fas fa-chevron-right fa-fw me-3"></i><span>Next</span>
                    </Button>
                </Col>
                <Col className="pb-2 text-center"><h3>{weeklyDay.day(0).format('MM/DD/YYYY')} - {weeklyDay.day(6).format('MM/DD/YYYY')}</h3></Col>
                <Col className="text-center">
                    <ListGroup horizontal activeKey={active} onSelect={(selectedKey) => setActive(selectedKey)}>
                        <ListGroup.Item action eventKey='day' variant="secondary" as={Link} to='/Calendar/Day'>Day</ListGroup.Item>
                        <ListGroup.Item action eventKey='week' variant="secondary" as={Link} to='/Calendar/Week' >Week</ListGroup.Item>
                        <ListGroup.Item action eventKey='month' variant="secondary" as={Link} to='/Calendar'>Month</ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row>
            <Row>
                <Col md={1}></Col>
                {
                    Variables.WEEKDAYSLONG.map((weekday, i) => {
                    return (
                    <Col key={i} className="border bg-white">
                        <span className="text-center fw-bold">{weekday}{ weeklyDay.day(i).isSame(today, 'day') ? <Badge bg='primary'>Today</Badge> : null }</span>
                        <br/>{weeklyDay.day(i).format('MM/DD/YYYY')}
                    </Col>)
                })
                }
            </Row>
            <Row>
                <Col md={1} className='border'>
                {Variables.TIMES.map((time, i) => { 
                return (
                    <Row key={i}>
                        <Col className='border-bottom border-start half-time col-height text-center fw-bold'>{time}</Col>
                    </Row>
                )})}
                </Col>
                <Col md={11} className='border'>
                    <WeeklyCell />
                </Col>
                </Row>
        </Container>
    )
}

export default Weekly;