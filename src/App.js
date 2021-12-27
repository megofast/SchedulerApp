import React from 'react';
import './App.css';
import {Routes, Route, Navigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Components/Login';
import Calendar from './Components/Calendar';
import Weekly from './Components/Weekly';
import AppointmentsList from './Components/AppointmentsList';
import {fakeAuth} from './Authentication';
import MainLayout from './Components/MainLayout';

function RequireAuthorization( { children } ) {
  if (!fakeAuth.isAuthenticated) {
    return <Navigate to="/Login" />;
  } else {
    return children;
  }
}

function App() {
  return (

          <Routes>
            <Route path='/Login' element={ <Login /> } />
            <Route path='/' element={ <RequireAuthorization> <MainLayout /> </RequireAuthorization> } >
              <Route path='Calendar' element={ <RequireAuthorization> <Calendar /> </RequireAuthorization> } />
              <Route path='/Calendar/Weekly' element={ <RequireAuthorization> <Weekly /> </RequireAuthorization> } />
              <Route path='Appointments' element={ <RequireAuthorization> <AppointmentsList /> </RequireAuthorization> } />
            </Route>
          </Routes>

  );
}

export default App;
