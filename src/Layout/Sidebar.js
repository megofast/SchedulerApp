import React, { useState } from 'react';
import { Nav, ListGroup } from 'react-bootstrap';
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
//import 'bootstrap/dist/css/bootstrap.min.css';
import NewEvent from '../Components/NewEvent';

const Sidebar = () => {
    const { viewingAnotherCalendar } = useSelector( (state) => state.loginReducer);
    const [createModalIsOpen, setModalIsOpen] = useState(false);
    const [active, setActive] = useState('dashboard');

    const handleCreateModalEvent = () => {
        setModalIsOpen(!createModalIsOpen);
    }

    return (
        <div>
        <Nav className="sidebar d-lg-block mx-0 px-0">
            <div className="mx-3 mt-4">
                <ListGroup variant="flush" activeKey={active} onSelect={(selectedKey) => setActive(selectedKey)}>
                    <ListGroup.Item action eventKey='dashboard' as={Link} to='/'><i className="fas fa-home fa-fw me-3"></i>Main Dashboard</ListGroup.Item>
                    <ListGroup.Item action eventKey='calendar' as={Link} to='/Calendar' ><i className="fas fa-calendar fa-fw me-3"></i>Calendar View</ListGroup.Item>
                    <ListGroup.Item action eventKey='appointments' as={Link} to='/Appointments'><i className="fas fa-list fa-fw me-3"></i>List View</ListGroup.Item>
                    {
                        viewingAnotherCalendar
                        ? <ListGroup.Item action disabled eventKey='create'><i className="fas fa-plus-square fa-fw me-3"></i>Add Event</ListGroup.Item>
                        : <ListGroup.Item action eventKey='create' onClick={handleCreateModalEvent}><i className="fas fa-plus-square fa-fw me-3"></i>Add Event</ListGroup.Item>
                    }
                    
                    <ListGroup.Item action eventKey='people' as={Link} to='/People'><i className="fas fa-users fa-fw me-3"></i>People</ListGroup.Item>
                    <ListGroup.Item action eventKey='search'><i className="fas fa-search fa-fw me-3"></i>Search</ListGroup.Item>
                </ListGroup>
            </div>
        </Nav>
        <NewEvent createModalOpen={createModalIsOpen} handleCreateModalOpen={handleCreateModalEvent} start='' end='' date='' />
        </div>
    );
  }
  
  export default Sidebar;