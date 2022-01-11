import React, { useState, useEffect } from 'react';
import {Variables} from '../Data/Variables';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Container, Row, Button, ListGroup, Badge } from 'react-bootstrap';
import {Link} from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import DayCell from './DayCell';
import { getDailyAppointments, moveToNextDay, moveToPreviousDay } from '../Redux/AppointmentSlice';
import moment from 'moment';


function Daily(props) {
    const { currentDay, today } = useSelector( (state) => state.appointmentReducer);
    const [active, setActive] = useState('day');
    const dispatch = useDispatch();

    useEffect( () => {
        // Get current weeks appointments
        //if (currentDay.isSame(today, 'week') && !currentDay.isSame(today, 'day')) {
        //    dispatch(changeCurrentDay(moment(today)));
        //}

        let parameters = {
            employeeId: 42,
            date: currentDay.format('YYYY-MM-DD'),
        }

        dispatch(getDailyAppointments(parameters));
    }, [dispatch, currentDay])

    
    
    return (
        <Container>
            <Row>
                <Col className="text-left">
                    <Button variant="secondary" className="m-1" onClick={() => dispatch(moveToPreviousDay())}>
                        <i className="fas fa-chevron-left fa-fw me-3"></i><span>Previous</span>
                    </Button>
                    <Button variant="secondary" className="m-1" onClick={() => dispatch(moveToNextDay())}>
                        <i className="fas fa-chevron-right fa-fw me-3"></i><span>Next</span>
                    </Button>
                </Col>
                <Col className="pb-2 text-center"><h3>{currentDay.format('dddd, MMM Do, YYYY')}{ currentDay.isSame(today, 'day') ? <Badge bg='primary'>Today</Badge> : null }</h3></Col>
                <Col className="text-center">
                    <ListGroup horizontal activeKey={active} onSelect={(selectedKey) => setActive(selectedKey)}>
                        <ListGroup.Item action eventKey='day' variant="secondary" as={Link} to='/Calendar/Day'>Day</ListGroup.Item>
                        <ListGroup.Item action eventKey='week' variant="secondary" as={Link} to='/Calendar/Week' >Week</ListGroup.Item>
                        <ListGroup.Item action eventKey='month' variant="secondary" as={Link} to='/Calendar'>Month</ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row>
            <Row>
                <Col className='border-start border-top border-end'>Hours scheduled summary</Col>
                
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
                    <DayCell />
                </Col>
                </Row>
        </Container>
    )
}

export default Daily;