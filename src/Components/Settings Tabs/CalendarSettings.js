import React from 'react';
import { ListGroup, ListGroupItem, Row, Col, Form } from 'react-bootstrap';

const SecuritySettings = (props) => {
    
    return (
        <>
            <h5>Notification Settings</h5>
            <ListGroup>
                <ListGroupItem>
                    <Row>
                        <Col sm={10}>
                            <strong className="fs-6">Notification Reminder Duration</strong>
                            <p className="fs-6">Changes the duration an appointment reminder is notified.</p>
                        </Col>
                        <Col sm={2} className="d-flex align-items-center justify-content-end mx-auto">
                            <Form>
                                <Form.Select defaultValue={props.notifyDuration} onChange={props.updateNotifyDuration}>
                                    <option value="15">15 Min</option>
                                    <option value="30">30 Min</option>
                                    <option value="45">45 Min</option>
                                    <option value="60">60 Min</option>
                                </Form.Select>
                            </Form>
                        </Col>
                    </Row>
                </ListGroupItem>
                <ListGroupItem>
                    <Row>
                        <Col sm={10}>
                            <strong className="fs-6">Show Popup Reminder</strong>
                            <p className="fs-6">Determines whether a popup will appear on screen reminding of an upcoming appointment.</p>
                        </Col>
                        <Col sm={2} className="d-flex align-items-center justify-content-end">
                                <Form.Check type="switch" id="notificationPopupSwitch" defaultChecked={props.notifyReminder} onChange={props.updateNotifyReminder}/>
                        </Col>
                    </Row>
                </ListGroupItem>
            </ListGroup>
        </>
    )
}

export default SecuritySettings;