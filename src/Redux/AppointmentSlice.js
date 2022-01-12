import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import {Variables} from '../Data/Variables';
import axios from 'axios';
import moment from 'moment';

export const getAppointments = createAsyncThunk("appointments/getAppointment", async () => {
    return fetch(Variables.API_URL + "appointment").then(res => res.json());
});

export const getMonthlyAppointments = createAsyncThunk(
    "appointments/getMonthlyAppointments", async (parameters, {getState}) => {
    const state = getState();       // Get the state so the login token can be used
    return axios
    .get(Variables.API_URL + `appointment/month/${state.loginReducer.employeeID}/${parameters.month}/${parameters.year}`, {
        headers: {
            Authorization: `Bearer ${state.loginReducer.token}`
        }
    })
    .then((response) => response.data)
    .catch((error) => error)
});

export const getWeeklyAppointments = createAsyncThunk(
    "appointments/getWeeklyAppointments", async (parameters, {getState}) => {
    const state = getState();       // Get the state so the login token can be used
    return axios
    .get(Variables.API_URL + `appointment/week/${state.loginReducer.employeeID}/${parameters.startDate}/${parameters.endDate}`,{
        headers: {
            Authorization: `Bearer ${state.loginReducer.token}`
        }
    })
    .then((response) => response.data)
    .catch((error) => error)
});

export const getDailyAppointments = createAsyncThunk(
    "appointments/getDailyAppointments", async (parameters, {getState}) => {
    const state = getState();       // Get the state so the login token can be used
    return axios
    .get(Variables.API_URL + `appointment/day/${state.loginReducer.employeeID}/${parameters.date}`, {
        headers: {
            Authorization: `Bearer ${state.loginReducer.token}`
        }
    })
    .then((response) => response.data)
    .catch((error) => error)
});

const getCurrentMonthAppointments = (appointments, currentMonth) => {
    let tempAppointments = [];
    appointments.forEach( (appointment) => {
        let appointmentMonth = moment(appointment.appDate);
        if (appointmentMonth.month() === currentMonth) {
            tempAppointments.push(appointment);
        }
    });

    return tempAppointments;
}

const AppointmentSlice = createSlice({
    name: "appointments",
    initialState: {
        userId: null,
        appointments: [],
        monthAppointments: [],
        weeklyAppointments: [],
        dailyAppointments: [],
        currentMonth: moment().month(),
        currentDay: moment(),
        today: moment(),
        loading: false,
        selectedCells: [],
    },
    reducers: {
        addSelectedCell: (state, action) => {
            state.selectedCells.push(action.payload);
        },
        resetSelectedCells: (state) => {
            state.selectedCells = [];
        },
        removeLastSelectedCell: (state) => {
            state.selectedCells.pop();
        },
        moveToNextWeek: (state) => {
            // Move to the next week on the weekly view
            let oldDay = moment(state.currentDay);
            oldDay.day(0);
            oldDay.add(7, 'days');
            state.currentDay = oldDay;
        },
        moveToPreviousWeek: (state) => {
            // Move to the previous week on the weekly view
            let oldDay = moment(state.currentDay);
            oldDay.day(0);
            oldDay.subtract(7, 'days');
            state.currentDay = oldDay;
        },
        changeCurrentDay: (state, action) => {
            // This code will change the current day
            state.currentDay = action.payload;
            state.currentDay.hour(0).minute(0).second(0);
            
        },
        moveToNextDay: (state) => {
            let oldDay = moment(state.currentDay);
            oldDay.add(1, 'days');
            state.currentDay = oldDay;
        },
        moveToPreviousDay: (state) => {
            let oldDay = moment(state.currentDay);
            oldDay.subtract(1, 'days');
            state.currentDay = oldDay;
        },
        moveCalendarToNextMonth: (state) => {
            if (state.currentDay.month() === 11) {
                state.currentDay.year(state.currentDay.year() + 1).month(0).date(1);
            } else {
                state.currentDay.month(state.currentDay.month() + 1).date(1);
            }

            state.currentMonth = state.currentDay.month();
            //state.monthAppointments = getCurrentMonthAppointments(state.appointments, state.currentMonth);
        },
        moveCalendarToPreviousMonth: (state) => {
            if (state.currentDay.month() === 0) {
                state.currentDay.year(state.currentDay.year() - 1).month(11).date(1);
            } else {
                state.currentDay.month(state.currentDay.month() - 1).date(1);
            }

            state.currentMonth = state.currentDay.month();
            //state.monthAppointments = getCurrentMonthAppointments(state.appointments, state.currentMonth);
        },
    },
    extraReducers: {
        [getAppointments.pending]: (state, action) => {
            state.loading = true;
        },
        [getAppointments.fulfilled]: (state, action) => {
            state.loading = false;
            state.appointments = action.payload;
            //state.monthAppointments = getCurrentMonthAppointments(action.payload, state.currentMonth);
        },
        [getAppointments.rejected]: (state, action) => {
            state.loading = false;   
        },
        [getMonthlyAppointments.pending]: (state, action) => {
            state.loading = true;
        },
        [getMonthlyAppointments.fulfilled]: (state, action) => {
            state.loading = false;
            state.monthAppointments = action.payload;
        },
        [getMonthlyAppointments.rejected]: (state, action) => {
            state.loading = false;
        },
        [getWeeklyAppointments.pending]: (state, action) => {
            state.loading = true;
        },
        [getWeeklyAppointments.fulfilled]: (state, action) => {
            state.loading = false;
            state.weeklyAppointments = action.payload;
        },
        [getWeeklyAppointments.rejected]: (state, action) => {
            state.loading = false;
        },
        [getDailyAppointments.pending]: (state, action) => {
            state.loading = true;
        },
        [getDailyAppointments.fulfilled]: (state, action) => {
            state.loading = false;
            state.dailyAppointments = action.payload;
        },
        [getDailyAppointments.rejected]: (state, action) => {
            state.loading = false;
        },
    },
});

export const { moveCalendarToNextMonth, moveCalendarToPreviousMonth, changeCurrentDay, moveToNextWeek, moveToPreviousWeek, 
    addSelectedCell, resetSelectedCells, removeLastSelectedCell, moveToNextDay, moveToPreviousDay } = AppointmentSlice.actions;

export default AppointmentSlice.reducer;