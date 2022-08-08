import React from 'react';
import { ListGroup, ListGroupItem, Row, Col, InputGroup, FormControl, Button } from 'react-bootstrap';

const PersonalSettings = (props) => {
    // Set the current user information to the text boxes
    const updateInformationClicked = (event) => {
        props.updatePersonalInformation();
        // Clear the forms of the entered data

    }

    return (
        <>
            <h5>Personal Information</h5>
            <Row><Col>
            <ListGroup>
                <ListGroupItem>
                    <Row>
                        <Col sm={6}>
                            <strong className="fs-6">Name</strong>
                            <p className="fs-6">Change your first and last name.</p>
                        </Col>
                        <Col sm={6} className="d-flex align-items-center justify-content-end mx-auto">
                            <InputGroup className="mb-3">
                                <FormControl type="text" placeholder={props.currentInfo.firstName} name="firstName" value={props.personalInfo.firstName} onChange={props.updatePersonalInfo} />
                                <FormControl type="text" placeholder={props.currentInfo.lastName} name="lastName" value={props.personalInfo.lastName} onChange={props.updatePersonalInfo} />
                            </InputGroup>
                        </Col>
                    </Row>
                </ListGroupItem>
                <ListGroupItem>
                    <Row>
                        <Col sm={4}>
                            <strong className="fs-6">Phone</strong>
                            <p className="fs-6">Change your phone number.</p>
                        </Col>
                        <Col sm={8} className="d-flex align-items-center justify-content-end">
                            <InputGroup className="mb-3">
                                <FormControl type="phone" placeholder={props.currentInfo.phone} name="phone" value={props.personalInfo.phone} onChange={props.updatePersonalInfo} />
                            </InputGroup>
                        </Col>
                    </Row>
                </ListGroupItem>
                <ListGroupItem>
                    <Row>
                        <Col sm={4}>
                            <strong className="fs-6">Email</strong>
                            <p className="fs-6">Change your email address.</p>
                        </Col>
                        <Col sm={8} className="d-flex align-items-center justify-content-end">
                            <InputGroup className="mb-3">
                                <FormControl type="email" placeholder={props.currentInfo.email} name="email" value={props.personalInfo.email} onChange={props.updatePersonalInfo} />
                            </InputGroup>
                        </Col>
                    </Row>
                </ListGroupItem>
                </ListGroup>
            </Col></Row>
            <Row><Col><hr /></Col></Row>
            <Row><Col className="justify-content-end"><Button variant="outline-primary" id="save-info" onClick={updateInformationClicked} >Update Information</Button></Col></Row>
        </>
    )
}

export default PersonalSettings;