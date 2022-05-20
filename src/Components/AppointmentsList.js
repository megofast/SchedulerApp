import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getDailyAppointments, getMonthlyAppointments, getWeeklyAppointments, moveCalendarToNextMonth, moveCalendarToPreviousMonth, moveToNextDay, moveToNextWeek, moveToPreviousDay, moveToPreviousWeek } from '../Redux/AppointmentSlice';
//import 'bootstrap/dist/css/bootstrap.min.css';
import {Variables} from '../Data/Variables';
import axios from 'axios';
import moment from 'moment';
import { Col, Row, ListGroup, Form, Button } from 'react-bootstrap';
import ListComponent from './ListComponent';

const AppointmentsList = (props) => {
    // Redux data
    const { monthAppointments, weeklyAppointments, dailyAppointments, loading, currentDay } = useSelector( (state) => state.appointmentReducer);
    const { token } = useSelector( (state) => state.loginReducer);

    // React State variables
    const [active, setActive] = useState('month');  // Maintains which view is active (month, week, day)
    const [header, setHeader] = useState(Variables.MONTHSLONG[currentDay.month()] + " " + currentDay.year());   // Header text
    const [filteredAppointments, setFilteredAppointments] = useState("");   // Filtered appointments list
    const [filterText, setFilterText] = useState("");   // Store the text from the filtered textbox
    const [filterToggle, setFilterToggle] = useState(false);    // The visible/hidden state of the toggle switches
    const [filterOptions, setFilterOptions] = useState({    // Individual toggle states
        title: true,
        clientID: true,
        date: true,
        startTime: true,
        endTime: true,
        notes: true
    });

    // Miscelaneous local variables
    let weeklyDay = moment(currentDay); // So as to not modify the currentDay redux data, modify weekly day instead
    const dispatch = useDispatch(); // Necessary to dispatch redux actions

    useEffect( () => {
        let parameters = {
            month: currentDay.month(),
            year: currentDay.year(),
        };
        dispatch(getMonthlyAppointments(parameters));
        
        parameters = {
            startDate: weeklyDay.day(0).format('YYYY-MM-DD'),
            endDate: weeklyDay.day(6).format('YYYY-MM-DD'),
        }
        dispatch(getWeeklyAppointments(parameters));

        parameters = {
            date: currentDay.format('YYYY-MM-DD')
        };
        dispatch(getDailyAppointments(parameters));

        // Set the headers appropriately on load/redraw
        switch (active) {
            case 'month':
                setHeader(Variables.MONTHSLONG[currentDay.month()] + " " + currentDay.year());
                break;
            case 'week':
                setHeader(weeklyDay.day(0).format('MM/DD/YYYY') +" - " + weeklyDay.day(6).format('MM/DD/YYYY'));
                break;
            case 'day':
                setHeader(currentDay.format('MM/DD/YYYY'));
                break;
            default:
                console.log("Error: Setting the header.");
        }

        if (filterText !== "") {
            // The filter field has content, when a user changes the state of a toggle update the displayed results
            switch (active) {
                case 'month':
                    appointmentSearch(monthAppointments, filterText);
                    break;
                case 'week':
                    appointmentSearch(weeklyAppointments, filterText);
                    break;
                case 'day':
                    appointmentSearch(dailyAppointments, filterText);
                    break;
                default:
                    console.log("Error: Updating the filtered list.");
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, currentDay, filterOptions])

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // This function acts as the callback from the listcomponent when a switch is checked/unchecked
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const changeFilterStates = (event) => {
        setFilterOptions( (values) => ({
            ...values,
            [event.target.id]: event.target.checked
        }));
    };

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // This function toggles the group of filters being displayed or hidden
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const changeFilterToggle = () => {
        setFilterToggle(!filterToggle);
    };

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // This function will search the appointments using the text in the searchterm variable
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const appointmentSearch = (appointments, searchTerm) => {
        let results = [];
        setFilteredAppointments("");

        if (searchTerm !== "") {
            appointments.forEach( (appointment) => {
                if (appointment.title.toString().toUpperCase().includes(searchTerm.toUpperCase()) && filterOptions.title) {
                    results.push(appointment);
                    return;
                }
                if (appointment.clientID.toString().toUpperCase().includes(searchTerm.toUpperCase()) && filterOptions.clientID) {
                    results.push(appointment);
                    return;
                }
                if (moment(appointment.appDate).format("MM/DD/YYYY").toString().includes(searchTerm) && filterOptions.date) {
                    results.push(appointment);
                    return;
                }
                if (moment(appointment.startTime).format("hh:mm a").toString().includes(searchTerm) && filterOptions.startTime) {
                    results.push(appointment);
                    return;
                }
                if (moment(appointment.endTime).format("hh:mm a").toString().includes(searchTerm) && filterOptions.endTime) {
                    results.push(appointment);
                    return;
                }
                if (appointment.notes.toString().toUpperCase().includes(searchTerm.toUpperCase()) && filterOptions.notes) {
                    results.push(appointment);
                    return;
                }
            });
            setFilteredAppointments(results);
        } else {
            // The filter box is empty, delete the active appointments
            setFilteredAppointments("");
        }
    };

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // This function handles the onChange event from the filter textbox. Text is entered/removed searching is instant
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const onChangeFilter = (event) => {
        // As the user types filter the results of the search
        setFilterText(event.target.value);
        switch (active) {
            case 'month':
                appointmentSearch(monthAppointments, event.target.value);
                break;
            case 'week':
                appointmentSearch(weeklyAppointments, event.target.value);
                break;
            case 'day':
                appointmentSearch(dailyAppointments, event.target.value);
                break;
            default:
                console.log("Error: Updating the filtered list from the filter textbox.")
        }
    };

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // This function moves to the previous group of appointments (monthly, weekly, daily)
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const previousAppointments = (period) => {
        // reset the filter text to blank
        setFilterText("");
        setFilteredAppointments("");
        switch (period) {
            case 'month':
                dispatch(moveCalendarToPreviousMonth());
                break;
            case 'week':
                dispatch(moveToPreviousWeek());
                break;
            case 'day':
                dispatch(moveToPreviousDay());
                break;
            default:
                console.log("Error: Failed to move to the previous appointments.")
        }
    };

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // This function moves to the next group of appointments (monthly, weekly, daily)
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const nextAppointments = (period) => {
        // Reset the filter text to blank
        setFilterText("");
        setFilteredAppointments("");
        switch (period) {
            case 'month':
                dispatch(moveCalendarToNextMonth());
                break;
            case 'week':
                dispatch(moveToNextWeek());
                break;
            case 'day':
                dispatch(moveToNextDay());
                break;
            default:
                console.log("Error: Failed to move to the next appointments.")
        }
    };

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // This function handles the changing from monthly, weekly, or daily appointment scopes
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const changeListPeriod = (period) => {
        // This function will handle changing the period of which the list shows appointments for
        let parameters = "";
        switch(period) {
            case 'month':
                parameters = {
                    month: currentDay.month(),
                    year: currentDay.year(),
                };
                dispatch(getMonthlyAppointments(parameters));
                setHeader(Variables.MONTHSLONG[currentDay.month()] + " " + currentDay.year());
                break;
            case 'week':
                parameters = {
                    startDate: weeklyDay.day(0).format('YYYY-MM-DD'),
                    endDate: weeklyDay.day(6).format('YYYY-MM-DD'),
                }
        
                dispatch(getWeeklyAppointments(parameters));
                setHeader(weeklyDay.day(0).format('MM/DD/YYYY') +" - " + weeklyDay.day(6).format('MM/DD/YYYY'));
                break;
            case 'day':
                parameters = {
                    date: currentDay.format('YYYY-MM-DD')
                };
                dispatch(getDailyAppointments(parameters));
                setHeader(currentDay.format('MM/DD/YYYY'));
                break;
            default:
                console.log("Error: Failed to change the period of the appointments.")
        }
    };

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // This function will delete whatever appointment ID was sent as a parameter
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const deleteClick = (id) => {
        if(window.confirm('Are you sure you want to delete this appointment?')) {
            axios.delete(Variables.API_URL + "appointment/" + id, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                // Success
                // Switch through and update data based on the active page
                let parameters = "";
                switch (active) {
                    case 'month':
                        parameters = {
                            month: currentDay.month(),
                            year: currentDay.year(),
                        };
                        dispatch(getMonthlyAppointments(parameters));
                        break;
                    case 'week':
                        parameters = {
                            startDate: weeklyDay.day(0).format('YYYY-MM-DD'),
                            endDate: weeklyDay.day(6).format('YYYY-MM-DD'),
                        }
                
                        dispatch(getWeeklyAppointments(parameters));
                        break;
                    case 'day':
                        parameters = {
                            date: currentDay.format('YYYY-MM-DD')
                        };
                        dispatch(getDailyAppointments(parameters));
                        break;
                    default:
                        console.log("Error: Failed to move to the next appointments.")
                }
                alert(response.data);
            })
            .catch(error => {
                // Failed
                alert('Failed to delete appointment.');
                console.log(error);
            });

            
        }
    };

    if (loading) {
        return (
            <div><i className="fa fa-spinner fa-spin"></i></div>
        )
    } else {
        return (
            <div>
                <Row>
                    <Col className="text-left">
                        <Button variant="secondary" className="m-1" onClick={() => previousAppointments(active)}>
                            <i className="fas fa-chevron-left fa-fw me-3"></i><span>Previous</span>
                        </Button>
                        <Button variant="secondary" className="m-1" onClick={() => nextAppointments(active)}>
                            <i className="fas fa-chevron-right fa-fw me-3"></i><span>Next</span>
                        </Button>
                    </Col>
                    <Col className="text-left">
                        <div className=" input_wrapper">
                        <i className="fas fa-filter input_icon"></i>
                            <Form.Control type="search" placeholder="Filter" onChange={ onChangeFilter } value={ filterText }/>
                        </div>
                        <i className={ filterToggle ? "fas fa-sliders-h icon_following_input mx-3 icon_button icon_button_selected" : "fas fa-sliders-h icon_following_input mx-3 icon_button" } onClick={changeFilterToggle}></i>
                    </Col>
                    <Col className="pb-2 text-center"><h3>{header}</h3></Col>
                    <Col>
                        <ListGroup horizontal activeKey={active} onSelect={(selectedKey) => setActive(selectedKey)}>
                            <ListGroup.Item action eventKey='day' variant="secondary" onClick={() => changeListPeriod('day')}>Day</ListGroup.Item>
                            <ListGroup.Item action eventKey='week' variant="secondary" onClick={() => changeListPeriod('week')}>Week</ListGroup.Item>
                            <ListGroup.Item action eventKey='month' variant="secondary" onClick={() => changeListPeriod ('month')}>Month</ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        { Array.isArray(filteredAppointments) ?
                            <ListComponent appointments={filteredAppointments} 
                                            handleDelete={deleteClick}
                                            showFilterToggle={filterToggle} 
                                            handleFilterStates={changeFilterStates}
                                            filterState={filterOptions} />
                            : 
                            {
                                'month': <ListComponent appointments={monthAppointments} 
                                                        handleDelete={deleteClick} 
                                                        showFilterToggle={filterToggle} 
                                                        handleFilterStates={changeFilterStates}
                                                        filterState={filterOptions} />,
                                'week': <ListComponent appointments={weeklyAppointments} 
                                                        handleDelete={deleteClick} 
                                                        showFilterToggle={filterToggle} 
                                                        handleFilterStates={changeFilterStates}
                                                        filterState={filterOptions} />,
                                'day': <ListComponent appointments={dailyAppointments} 
                                                        handleDelete={deleteClick} 
                                                        showFilterToggle={filterToggle} 
                                                        handleFilterStates={changeFilterStates}
                                                        filterState={filterOptions} />
                            }[active]
                        }
                    </Col>
                </Row>
            </div>
        )
    }
}

  export default AppointmentsList;