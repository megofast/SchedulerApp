import React from 'react';
import { Modal, Row, Col, ListGroup, ListGroupItem } from 'react-bootstrap';
import moment from 'moment';

const Notifications = (props) => {
    
    
    return (
        <>
        <Modal show={props.notificationModalOpen} onHide={props.handleNotificationModalEvent}>
            <Modal.Header closeButton>
               <Modal.Title>Notifications</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ListGroup>
                {
                    props.notifyApps.map( (appointment, i) => {
                        return (
                        <ListGroupItem key={i}>
                            <Row>
                                <Col sm={7}>
                                    <strong className="fs-6">{appointment.app.title}</strong>
                                    <p className="fs-6">With client {appointment.app.clientID}</p>
                                </Col>
                                <Col sm={5} className="d-flex align-items-center justify-content-end mx-auto">
                                <p className="fs-6">{moment(appointment.app.startTime).format('hh:mm a')} --- {moment(appointment.app.endTime).format('hh:mm a')}</p>
                                </Col>
                            </Row>
                        </ListGroupItem>
                    )})
                }
                </ListGroup>
            </Modal.Body>
        </Modal>
        </>
    )
}

export default Notifications;