import React from 'react';
import {Outlet} from 'react-router-dom';
//import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Col, Row } from 'react-bootstrap';
import Header from '../Layout/Header';
import Sidebar from '../Layout/Sidebar';
import Footer from '../Layout/Footer';

function MainLayout(props) {
  return (
      
    
    <Container fluid className="mx-0 px-0">
      <Row>
        <Col><Header /></Col>
      </Row>
      <Row>
        <Col md="auto"><Sidebar /></Col>
        <Col className="content">
          < Outlet />
        </Col>
      </Row>
      <Row>
        <Col><Footer /></Col>
      </Row>
    </Container>
  
      
  );
}

export default MainLayout;