import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getDailyAppointments, getMonthlyAppointments, getWeeklyAppointments } from '../Redux/AppointmentSlice';
//import 'bootstrap/dist/css/bootstrap.min.css';
import '../CSS/Layout.css';
import { Card, Col, Container, Row } from 'react-bootstrap';
import moment from 'moment';
import MiniCalendar from './MiniCalendar';
import MiniWeeklySummary from './MiniWeeklySummary';

const Dashboard = (props) => {
    const { dailyAppointments, weeklyAppointments, monthAppointments, loading, today, currentDay,  } = useSelector( (state) => state.appointmentReducer);
    let weeklyDay = moment(currentDay);
    const dispatch = useDispatch();
    const [currentTime, setCurrentTime] = useState(moment().format("hh:mm a"));
    let temporaryNextAppoint = "";
    // Get the initial appointment for the next appointment in the day
    /*
    for (let appointment of dailyAppointments) {
        if (moment(appointment.startTime).isAfter()) {
            // Set the next appointment variable, this method only works if the daily appointments are sorted.
            temporaryNextAppoint = appointment;
            //console.log(temporaryNextAppoint);
            break;
        }
    };
    */
    const [nextAppointment, setNextAppointment] = useState(temporaryNextAppoint); 


    useEffect( () => {
        let parameters = {
            date: today.format('YYYY-MM-DD')
        };
        dispatch(getDailyAppointments(parameters));

        parameters = {
            month: currentDay.month(),
            year: currentDay.year(),
        };
        dispatch(getMonthlyAppointments(parameters));

        parameters = {
            startDate: weeklyDay.day(0).format('YYYY-MM-DD'),
            endDate: weeklyDay.day(6).format('YYYY-MM-DD'),
        }

        dispatch(getWeeklyAppointments(parameters));

        // Create the interval to update the clock display and check for the next appointment
        const updateCurrentTime = () => {
            setCurrentTime(moment().format("hh:mm a"));
            
            // When the clock updates, check to see what the next appointment is for the day
            let foundNext = false;
            for (let appointment of dailyAppointments) {
                if (moment(appointment.startTime).isAfter()) {
                    // Set the next appointment variable, this method only works if the daily appointments are sorted.
                    setNextAppointment(appointment);
                    //console.log(appointment);
                    foundNext = true;
                    break;
                }
            };
            // Another appointment was not found, set nextappointment to nothing
            if (!foundNext) {
                setNextAppointment("");
            }
        };

        // Check for updated appointments without having to wait for the timer to trigger
        updateCurrentTime();

        let clockID = 0;
        clockID = setInterval(updateCurrentTime, 60000);

        // Create a return function to destroy the interval once the component unmounts
        return () => {
            clearInterval(clockID);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, today])

    
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
                                        <div className="h5 mb-0 font-weight-bold text-gray-800">{nextAppointment !== "" ? moment(nextAppointment.startTime).format("hh:mm a") + ' - ' + moment(nextAppointment.endTime).format("hh:mm a") : 'No Appointments Today!'}</div>
                                    </Col>
                                    <Col md="auto">
                                        <i className="fas fa-calendar fa-2x text-gray-300"></i>
                                    </Col>
                                </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col>
                            <Card className="border-secondary border-end-0 border-top-0 border-bottom-0 border-5 shadow h-100 py-2">
                                <Card.Body>
                                <Row className="no-gutters align-items-center">
                                    <Col className="mr-2">
                                        <div className="text-xs font-weight-bold text-secondary text-uppercase mb-1">
                                            Appointments Today</div>
                                        <div className="h5 mb-0 font-weight-bold text-gray-800">{dailyAppointments.length !== undefined ? dailyAppointments.length : 0}</div>
                                    </Col>
                                    <Col md="auto">
                                        <i className="fas fa-hashtag fa-2x text-gray-300"></i>
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
                        <Col>
                            <Card className="border-success border-end-0 border-top-0 border-bottom-0 border-5 shadow h-100 py-2">
                                <Card.Body>
                                <Row className="no-gutters align-items-center">
                                    <Col className="mr-2">
                                        <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                            Current Date</div>
                                        <div className="h5 mb-0 font-weight-bold text-gray-800">{ today.format('M / D / YYYY') }</div>
                                    </Col>
                                    <Col md="auto">
                                        <i className="fas fa-calendar fa-2x text-gray-300"></i>
                                    </Col>
                                </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="m-3 p-0">
                            <Card className="border shadow h-100">
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
                        <Col className="m-3 p-0">
                            <MiniCalendar appointments={ monthAppointments } today={ today } />
                        </Col>
                    </Row>
                    <Row>
                        <Col className="m-3 p-0">
                            <MiniWeeklySummary appointments={ weeklyAppointments }/>
                        </Col>
                    </Row>
                </Container>


            </div>
        )
    }
}

  export default Dashboard;