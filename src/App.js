import React from 'react';
import './App.css';
import {Routes, Route, Navigate} from 'react-router-dom';
import './CSS/bootstrap.min.css';
import Login from './Components/Login';
import Calendar from './Components/Calendar';
import Weekly from './Components/Weekly';
import Daily from './Components/Daily';
import AppointmentsList from './Components/AppointmentsList';
import MainLayout from './Components/MainLayout';
import People from './Components/People';
import Dashboard from './Components/Dashboard';
import { useSelector } from "react-redux";

function RequireAuthorization( { children } ) {
  const { isAuthenticated } = useSelector( (state) => state.loginReducer);
  if (!isAuthenticated) {
    return <Navigate to="/Login" />;
  } else {
    return children;
  }
}

function App() {
  return (
        <>

          <Routes>
            <Route path='/Login' element={ <Login /> } />
            <Route path='/' element={ <RequireAuthorization> <MainLayout /> </RequireAuthorization> } >
              <Route index element={ <RequireAuthorization> <Dashboard /> </RequireAuthorization> } />
              <Route path='Calendar' element={ <RequireAuthorization> <Calendar /> </RequireAuthorization> } />
              <Route path='/Calendar/Week' element={ <RequireAuthorization> <Weekly /> </RequireAuthorization> } />
              <Route path='/Calendar/Day' element={ <RequireAuthorization> <Daily /> </RequireAuthorization> } />
              <Route path='Appointments' element={ <RequireAuthorization> <AppointmentsList /> </RequireAuthorization> } />
              <Route path='People' element={ <RequireAuthorization> <People /> </RequireAuthorization> } />
            </Route>
          </Routes>
        </>
  );
}

export default App;
