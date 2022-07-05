import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Modal } from 'react-bootstrap';
import moment from 'moment';
import { getDailyAppointments } from '../Redux/AppointmentSlice';
import { current } from '@reduxjs/toolkit';

const Notifications = (props) => {
    const {dailyAppointments} = useSelector( (state) => state.appointmentReducer);
    const dispatch = useDispatch();
    let currentTime = moment();
    /*
    useEffect( () => {
        // Refresh the dailyAppointments list for the current day
        let parameters = {
            date: currentTime.format('YYYY-MM-DD'),
        }
        dispatch(getDailyAppointments(parameters));
    }, [currentTime, dailyAppointments]);
    */
    return (
        <>
        <Modal show={props.notificationModalOpen} onHide={props.handleNotificationModalEvent}>
            <Modal.Header closeButton>
               <Modal.Title>Notifications</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Hello World!!!
            </Modal.Body>
        </Modal>
        </>
    )
}

export default Notifications;