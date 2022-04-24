import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getDailyAppointments } from '../Redux/AppointmentSlice';
//import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Col, Container, Row } from 'react-bootstrap';
import {Variables} from '../Data/Variables';
import moment from 'moment';

const Dashboard = (props) => {
    const { dailyAppointments, loading, today } = useSelector( (state) => state.appointmentReducer);
    //const { token } = useSelector( (state) => state.loginReducer);
    const dispatch = useDispatch();
    
    const [currentTime, setCurrentTime] = useState(moment().format("hh:mm a"));
    
    useEffect( () => {
        let parameters = {
            date: today.format('YYYY-MM-DD')
        };
        dispatch(getDailyAppointments(parameters));

        // Create the interval to update the clock display
        const updateCurrentTime = () => {
            setCurrentTime(moment().format("hh:mm a"));
        }
        let clockID = 0;
        clockID = setInterval(updateCurrentTime, 6000);

        // Create a return function to destroy the interval once the component unmounts
        return () => {
            clearInterval(clockID);
        }
    }, [dispatch, today])
    

    // Setup variables for mini-calendar
    // Get first of the current month to find the number of the weekday the first is
    
    let firstOfMonth = moment(today);
    let firstDayOfWeek = firstOfMonth.date(1).day();
    
    // Create an array with the total number of days for the month
    let monthDays = [];
    for (let x = 0; x < 6; x++) {
        monthDays.push([]);
    }

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
            if (firstOfMonth.month() !== today.month()) {
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
                    appointments: 0
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
    
    


    if (loading) {
        return (
            <div><i className="fa fa-spinner fa-spin"></i></div>
        )
    } else {
        return (
            <div>

                <Container fluid>
                    <Row>
                        <Col>
                            <Card className="border-primary border-end-0 border-top-0 border-bottom-0 border-5 shadow h-100 py-2">
                                <Card.Body>
                                <Row className="no-gutters align-items-center">
                                    <Col className="mr-2">
                                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                            Next Appointment</div>
                                        <div className="h5 mb-0 font-weight-bold text-gray-800">{dailyAppointments[0] !== undefined ? moment(dailyAppointments[0].startTime).format("hh:mm a") + ' - ' + moment(dailyAppointments[0].endTime).format("hh:mm a") : 'No Appointments Today!'}</div>
                                    </Col>
                                    <Col md="auto">
                                        <i className="fas fa-calendar fa-2x text-gray-300"></i>
                                    </Col>
                                </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col>
                            <Card className="border-success border-end-0 border-top-0 border-bottom-0 border-5 shadow h-100 py-2">
                                <Card.Body>
                                <Row className="no-gutters align-items-center">
                                    <Col className="mr-2">
                                        <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                            Appointments Today</div>
                                        <div className="h5 mb-0 font-weight-bold text-gray-800">{dailyAppointments.length !== undefined ? dailyAppointments.length : 0}</div>
                                    </Col>
                                    <Col md="auto">
                                        <i className="fas fa-calendar fa-2x text-gray-300"></i>
                                    </Col>
                                </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col>
                            <Card className="border-info border-end-0 border-top-0 border-bottom-0 border-5 shadow h-100 py-2">
                                <Card.Body>
                                <Row className="no-gutters align-items-center">
                                    <Col className="mr-2">
                                        <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                                            Current Time</div>
                                        <div className="h5 mb-0 font-weight-bold text-gray-800">{ currentTime }</div>
                                    </Col>
                                    <Col md="auto">
                                        <i className="far fa-clock fa-2x text-gray-300"></i>
                                    </Col>
                                </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="m-2">
                            <Card className="border shadow">
                                <Card.Header as="h6"><div className="text-xs font-weight-bold text-uppercase mb-1">
                                            Today's Appointments</div></Card.Header>
                                <Card.Body>
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>Title</th>
                                                <th>ClientID</th>
                                                <th>Start Time</th>
                                                <th>End Time</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.isArray(dailyAppointments)
                                            ? dailyAppointments.map(appoint =>
                                                <tr key = {appoint.appointmentID}>
                                                    <td>{appoint.title}</td>
                                                    <td>{appoint.clientID}</td>
                                                    <td>{moment(appoint.startTime).format("hh:mm a")}</td>
                                                    <td>{moment(appoint.endTime).format("hh:mm a")}</td>
                                                </tr>
                                            )
                                            : null }
                                        </tbody>
                                    </table>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col className="m-2">
                            <Card className="border shadow">
                                <Card.Header as="h6"><div className="text-xs font-weight-bold text-uppercase mb-1">
                                            Calendar</div></Card.Header>
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
                                                    <Row>{
                                                    week.map((day, i) => {
                                                        if (day.date === 0) {
                                                            return <Col className="border bg-white"></Col>
                                                        } else {
                                                            return (
                                                                <Col className="border bg-white">
                                                                    <div className="fs-6">{day.date}</div>
                                                                    <div className="fs-4 text-center">{day.appointments}</div>
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
                        </Col>
                    </Row>
                </Container>


            </div>
        )
    }
}

  export default Dashboard;