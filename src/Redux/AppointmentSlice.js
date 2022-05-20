import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {Variables} from '../Data/Variables';
import moment from 'moment';
import axiosInstance from "../Data/axiosInstance";



// Create a sort function to place the appointments in ascending order based on start times.
function sortByStartTimes(a, b) {
    if (moment(a.startTime).isBefore(moment(b.startTime))) {
        // Then a is before b, thus return a negative number
        return -1;
    } else {
        return 1;
    }
}

export const getAppointments = createAsyncThunk("appointments/getAppointment", async () => {
    return fetch(Variables.API_URL + "appointment").then(res => res.json());
});

export const getMonthlyAppointments = createAsyncThunk(
    "appointments/getMonthlyAppointments", async (parameters, {getState, dispatch}) => {
    const state = getState();       // Get the state so the login token can be used

    return axiosInstance.get(`appointment/month/${state.loginReducer.viewingEmployeeID}/${parameters.month}/${parameters.year}`)
        .then( (response) => response.data)
        .catch( (error) => {
            console.log(error);
            return error;
        });
});

export const getWeeklyAppointments = createAsyncThunk(
    "appointments/getWeeklyAppointments", async (parameters, {getState, dispatch}) => {
    const state = getState();       // Get the state so the login token can be used

    return axiosInstance.get(`appointment/week/${state.loginReducer.viewingEmployeeID}/${parameters.startDate}/${parameters.endDate}`)
        .then( (response) => response.data)
        .catch( (error) => {
            console.log(error);
            return error;
        });
});

export const getDailyAppointments = createAsyncThunk(
    "appointments/getDailyAppointments", async (parameters, {getState, dispatch}) => {
    const state = getState();       // Get the state so the login token can be used

    return axiosInstance.get(`appointment/day/${state.loginReducer.viewingEmployeeID}/${parameters.date}`)
        .then( (response) => response.data)
        .catch( (error) => {
            console.log(error);
            return error;
        });
});


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
            let newDay = moment(state.currentDay);
            if (state.currentDay.month() === 11) {
                newDay.year(newDay.year() + 1).month(0).date(1);
            } else {
                newDay.month(newDay.month() + 1).date(1);
            }
            state.currentDay = moment(newDay);
            state.currentMonth = state.currentDay.month();
            //state.monthAppointments = getCurrentMonthAppointments(state.appointments, state.currentMonth);
        },
        moveCalendarToPreviousMonth: (state) => {
            let newDay = moment(state.currentDay);
            if (state.currentDay.month() === 0) {
                newDay.year(newDay.year() - 1).month(11).date(1);
            } else {
                newDay.month(newDay.month() - 1).date(1);
            }
            state.currentDay = moment(newDay);
            state.currentMonth = state.currentDay.month();
            //state.monthAppointments = getCurrentMonthAppointments(state.appointments, state.currentMonth);
        },
        resetCurrentDay: (state) => {
            state.currentMonth = moment().month();
            state.currentDay = moment();
        },
    },
    extraReducers: {
        [getMonthlyAppointments.pending]: (state, action) => {
            state.loading = true;
        },
        [getMonthlyAppointments.fulfilled]: (state, action) => {
            state.loading = false;
            state.monthAppointments = action.payload.sort(sortByStartTimes);
        },
        [getMonthlyAppointments.rejected]: (state, action) => {
            state.loading = false;
        },
        [getWeeklyAppointments.pending]: (state, action) => {
            state.loading = true;
        },
        [getWeeklyAppointments.fulfilled]: (state, action) => {
            state.loading = false;
            state.weeklyAppointments = action.payload.sort(sortByStartTimes);
        },
        [getWeeklyAppointments.rejected]: (state, action) => {
            state.loading = false;
        },
        [getDailyAppointments.pending]: (state, action) => {
            state.loading = true;
        },
        [getDailyAppointments.fulfilled]: (state, action) => {
            state.loading = false;
            state.dailyAppointments = action.payload.sort(sortByStartTimes);
        },
        [getDailyAppointments.rejected]: (state, action) => {
            state.loading = false;
        },
    },
});

export const { moveCalendarToNextMonth, moveCalendarToPreviousMonth, changeCurrentDay, moveToNextWeek, moveToPreviousWeek, 
    addSelectedCell, resetSelectedCells, removeLastSelectedCell, moveToNextDay, moveToPreviousDay, resetCurrentDay } = AppointmentSlice.actions;

export default AppointmentSlice.reducer;