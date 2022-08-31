import React, {useState, useRef} from 'react';
import { useDispatch, useSelector } from "react-redux";
import {Variables} from '../Data/Variables';
import { Container, Modal, Tabs, Tab } from 'react-bootstrap';
import CalendarSettings from '../Components/Settings Tabs/CalendarSettings';
import SecuritySettings from '../Components/Settings Tabs/SecuritySettings';
import PersonalSettings from '../Components/Settings Tabs/PersonalSettings';
import { getCurrentEmployeeInfo } from '../Redux/LoginSlice';
import axios from 'axios';

const AccountSettings = (props) => {
    const { employee, token } = useSelector( (state) => state.loginReducer );
    const dispatch = useDispatch();
    const currentPasswordData = useRef();
    const newPasswordData = useRef();
    const usernameData = useRef();
    
    // Break apart the employee settings into its parts for easier use
    let notifyDuration = String(employee.settings).slice(0, 2);
    let notifyReminder = (String(employee.settings).slice(3) === 'true');

    const [personalInfo, setPersonalInfo] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: ""
    });
    
    // Update the settings when the switch status is changed

    const updateNotifyReminder = (event) => {
        notifyReminder = event.target.checked;
        updateUserSettings(notifyDuration, notifyReminder);
    };

    const updateNotifyDuration = (event) => {
        notifyDuration = event.target.value;
        updateUserSettings(notifyDuration, notifyReminder);
    };

    const updateUserSettings = (duration, notify) => {
        const newSettings = duration + "|" + notify;
        
        axios.put(Variables.API_URL + `employee/singleField/${employee.employeeID}/1/${newSettings}`, null, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            // Success
            alert(response.data);
            // Once the information is successfully updated, update the info in the Redux store
            dispatch(getCurrentEmployeeInfo(employee.employeeID));
        })
        .catch(error => {
            // Failed
            console.log(error);
        });
    }

    const updatePersonalInfo = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        
        setPersonalInfo(values => ({
            ...values,
            [name]: value
        }));

        // If a personal info field is blank, assign it back to the original
        if (personalInfo.firstName === "" && name !== "firstName") {
            console.log("first");
            setPersonalInfo(values => ({
                ...values,
                firstName: employee.firstName
            }));
        }
        if (personalInfo.lastName === "" && name !== "lastName") {
            setPersonalInfo(values => ({
                ...values,
                lastName: employee.lastName
            }));
        }
        if (personalInfo.phone === "" && name !== "phone") {
            setPersonalInfo(values => ({
                ...values,
                phone: employee.phone
            }));
        }
        if (personalInfo.email === "" && name !== "email") {
            setPersonalInfo(values => ({
                ...values,
                email: employee.email
            }));
        }
    }

    const changePassword = (event) => {
        const {password1, password2} = newPasswordData.current;
        const {passwordc} = currentPasswordData.current;
        // Check if the passwords are equal to eachother before allowing the change to proceed
        if (password1.value === password2.value) {
            // Passwords are equal, continue
            axios.put(Variables.API_URL + `employee/${employee.employeeID}/${passwordc.value}/${password1.value}`, null, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                // Success
                alert(response.data);
            })
            .catch(error => {
                // Failed
                console.log(error);
            });
        } else {
            // Passwords are different, alert the user
            alert("Passwords do not match, please try again.");
        }
    }

    const changeUsername = (event) => {
        const {username} = usernameData.current;
        axios.put(Variables.API_URL + `employee/singleField/${employee.employeeID}/0/${username.value}`, null, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            // Success
            alert(response.data);
            // Once the username is successfully updated, update the username in the Redux store
            dispatch(getCurrentEmployeeInfo(employee.employeeID));

            // Reset the username field
            username.value = "";
        })
        .catch(error => {
            // Failed
            console.log(error);
        });
    }

    const updatePersonalInformation = (event) => {
        axios.put(Variables.API_URL + `employee/${employee.employeeID}/${personalInfo.firstName}/${personalInfo.lastName}/${personalInfo.phone}/${personalInfo.email}`, null, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            // Success
            alert(response.data);
            // Once the information is successfully updated, update the info in the Redux store
            dispatch(getCurrentEmployeeInfo(employee.employeeID));

            // Reset the user information fields
            setPersonalInfo({
                firstName: "",
                lastName: "",
                phone: "",
                email: ""
            });
        })
        .catch(error => {
            // Failed
            console.log(error);
        });
    }

    return (
        <>
        <Modal show={props.accountModalOpen} onHide={props.handleAccountModalEvent} size="lg">
            <Modal.Header closeButton>
               <Modal.Title>Account Settings</Modal.Title>
               
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Tabs defaultActiveKey="calendarSettings" id="settingsTabs" className="mb-3" fill>
                        <Tab eventKey="calendarSettings" title="Calendar Settings">
                            <CalendarSettings notifyDuration={notifyDuration} notifyReminder={notifyReminder} updateNotifyDuration={updateNotifyDuration} updateNotifyReminder={updateNotifyReminder} />
                        </Tab>
                        <Tab eventKey="securitySettings" title="Security Settings">
                            <SecuritySettings employee={employee} usernameData={usernameData} currentPasswordData={currentPasswordData} newPasswordData={newPasswordData} changeUsername={changeUsername} changePassword={changePassword} />
                        </Tab>
                        <Tab eventKey="personalSettings" title="Personal Information">
                            <PersonalSettings currentInfo={employee} personalInfo={personalInfo} updatePersonalInfo={updatePersonalInfo} updatePersonalInformation={updatePersonalInformation} />
                        </Tab>
                    </Tabs>
                </Container>
            </Modal.Body>
        </Modal>
        </>
    )
}

export default AccountSettings;