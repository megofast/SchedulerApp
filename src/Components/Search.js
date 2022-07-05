import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getSearchResults, setSearchString } from '../Redux/AppointmentSlice';
import moment from 'moment';
import { Col, Row, Button, Form, InputGroup, DropdownButton, Dropdown, Collapse } from 'react-bootstrap';

const Search = (props) => {
    const { searchResults, searchString } = useSelector( (state) => state.appointmentReducer);
    const { clients } = useSelector( (state) => state.clientReducer);
    const { employees } = useSelector( (state) => state.employeeReducer);
    const { loggedInEmployeeID } = useSelector( (state) => state.loginReducer);
    const dispatch = useDispatch();
    const [searchOpen, setSearchOpen] = useState(true);

    const updateEmployeeID = (event) => {
        setData(values => ({
            ...values,
            employeeID: event.target.id
        }))
    };

    const updateClientID = (event) => {
        setData(values => ({
            ...values,
            clientID: event.target.id
        }))
    };

    const onSearch = (event) => {
        setSearchOpen(!searchOpen);
        // Modify any fields of data that are blank to be * for easy comparison in the backend
        let parameters = {
            startDate: data.startDate === "" ? "*" : data.startDate,
            endDate: data.endDate === "" ? "*" : data.endDate,
            startTime: data.startTime === "" ? "*" : data.startTime,
            endTime: data.endTime === "" ? "*" : data.endTime,
            clientID: data.clientID === "" ? "*" : data.clientID,
            employeeID: data.employeeID === "" ? "*" : data.employeeID,
            title: data.title === "" ? "*" : data.title
        }

        // Set the search string for a summary of search results
        dispatch(setSearchString(parameters));

        // Send the data as parameters to redux
        dispatch(getSearchResults(parameters));
    };

    const [data, setData] = useState({
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        clientID: "",
        employeeID: "",
        title: ""
    });

    const updateData = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        
        setData(values => ({
            ...values,
            [name]: value
        }))
    };

    return (
        <>
                <Row><Col md={10}>
                    <Collapse in={searchOpen}>
                        <Row className="no-gutters align-items-center">
                            <Col className="mr-2">
                                <Row><Col className="m-2">
                                        <Form.Label>Start Date</Form.Label>
                                        <Form.Control name="startDate" type="date" placeholder="Start Date" value={data.startDate} onChange={updateData}/>
                                </Col></Row><Row><Col className="m-2">
                                    <Form.Label>End Date</Form.Label>
                                    <Form.Control name="endDate" type="date" placeholder="End Date" value={data.endDate} onChange={updateData}/>
                                </Col></Row>
                            </Col>
                            <Col className="mr-2">
                                <Row><Col className="m-2">
                                    <Form.Label>Start Time</Form.Label>
                                    <Form.Control name="startTime" type="time" placeholder="Start Time" value={data.startTime} onChange={updateData}/>
                                </Col></Row><Row><Col className="m-2">
                                    <Form.Label>End Time</Form.Label>
                                    <Form.Control name="endTime" type="time" placeholder="End Time" value={data.endTime} onChange={updateData}/>
                                </Col></Row>
                            </Col>
                            <Col className="mr-2">
                                <Row><Col className="m-2">
                                    <InputGroup>
                                        <Form.Control name="employeeID" type="text" placeholder="Employee ID" value={data.employeeID} onChange={updateData}/>

                                        <DropdownButton className="mx-2" id="view-dropdown" title={"Select Employee"} variant="secondary">
                                            <Dropdown.Item href="" id={ loggedInEmployeeID } onClick={updateEmployeeID}>Myself</Dropdown.Item>
                                            <Dropdown.Divider></Dropdown.Divider>
                                            {
                                                employees !== undefined ?
                                                    employees.map((employee, i) => {
                                                        return (<Dropdown.Item key={i} href="" id={ employee.employeeID } onClick={updateEmployeeID}>{employee.firstName + " " + employee.lastName }</Dropdown.Item>)
                                                    })
                                                : <i className="fa fa-spinner fa-spin"></i>
                                            }
                                        </DropdownButton>
                                    </InputGroup>
                                </Col></Row><Row><Col className="m-2">
                                    <InputGroup >
                                        <Form.Control name="clientID" type="text" placeholder="Client ID" value={data.clientID} onChange={updateData}/>

                                        <DropdownButton variant="secondary" title="Select Client" id="select-client-dropdown" align="end">
                                            {
                                                Array.isArray(clients) ?
                                                clients.map( client => 
                                                    <Dropdown.Item key={client.clientID} href="#" id={client.clientID} onClick={updateClientID}>{client.firstName} {client.lastName}</Dropdown.Item>
                                                )
                                                : null
                                            }
                                        </DropdownButton>
                                    </InputGroup>
                                </Col></Row><Row><Col className="m-2">

                                            <Form.Control name="title" type="text" placeholder="Title" value={data.title} onChange={updateData}/>
                                </Col></Row>
                            </Col>
                        </Row>
                    </Collapse>
                    <Row><Col>{searchString}</Col></Row>
                </Col><Col md={2} className="d-flex flex-column">
                    <Button variant="info" className=" m-2 mt-auto" onClick={onSearch}>Search</Button>
                </Col></Row>

            <div>
                <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Title </th>
                        <th>ClientID</th>
                        <th>Date</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Notes</th>
                        <th>Color</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(searchResults)
                    ? searchResults.map(appoint =>
                        <tr key = {appoint.appointmentID}>
                            <td>{appoint.title}</td>
                            <td>{appoint.clientID}</td>
                            <td>{moment(appoint.appDate).format("MM/DD/YYYY")}</td>
                            <td>{moment(appoint.startTime).format("hh:mm a")}</td>
                            <td>{moment(appoint.endTime).format("hh:mm a")}</td>
                            <td>{appoint.notes}</td>
                            <td className="border align-middle text-center"><i className="p-2" style={{ backgroundColor: appoint.color }} /></td>
                            <td>
                                <button type="button" className="btn mr-1" data-bs-toggle="modal" data-bs-target="#modalOptions">
                                    <i className="far fa-edit" aria-hidden="true"></i>
                                </button>
                                <button type="button" className="btn mr-1" onClick={() => props.handleDelete(appoint.appointmentID)}>
                                    <i className="far fa-trash-alt"></i>
                                </button>
                            </td>
                        </tr>
                    )
                    : null }
                </tbody>
            </table>
            </div>
        </>
    )
}

export default Search;