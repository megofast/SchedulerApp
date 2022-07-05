import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Container, Modal } from 'react-bootstrap';
import moment from 'moment';

const AccountSettings = (props) => {
    let currentTime = moment();

    return (
        <>
        <Modal show={props.accountModalOpen} onHide={props.handleAccountModalEvent}>
            <Modal.Header closeButton>
               <Modal.Title>Account Settings</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <h5>Notification Settings</h5>
                    <hr />
                    <h5>Security Settings</h5>
                </Container>
            </Modal.Body>
        </Modal>
        </>
    )
}

export default AccountSettings;