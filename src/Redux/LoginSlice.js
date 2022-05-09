import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {Variables} from '../Data/Variables';
import axios from 'axios';
import jwtDecode from "jwt-decode";


export const checkLoginCredentials = createAsyncThunk(
    "login/checkLoginCredentials", async (parameters) => {
    
    // Create the Json payload from the username and password
    let userLoginDetails = JSON.stringify({
        username: parameters.username,
        password: parameters.password,
    });
    
    return axios
    .post(Variables.API_URL + "login/login", userLoginDetails, {
        headers: {
            'Content-Type': 'application/json'
        }})
    .then(response => response.data)
});


const LoginSlice = createSlice({
    name: "authenticatedUser",
    initialState: {
        failedAttempt: false,
        loading: false,
        isAuthenticated: false,
        token: "",
        refreshToken: "",
        refreshing: false,
        viewingEmployeeID: null,
        loggedInEmployeeID: null,
        viewingAnotherCalendar: false,
        employee: []
    },
    reducers: {
        logout: (state, action) => {
            state.token = "";
            state.employee = [];
            state.viewingEmployeeID = null;
            state.loggedInEmployeeID = null;
            state.isAuthenticated = false;
        },
        updateFromRefreshToken: (state, action) => {
            state.token = action.payload.data.accessToken;
            state.refreshToken = action.payload.data.refreshToken;
            state.employee = jwtDecode(action.payload.data.accessToken);
            state.loggedInEmployeeID = parseInt(state.employee.employeeID);
            state.isAuthenticated = true;
            state.refreshing = false;
        },
        updateViewingEmployee: (state, action) => {
            state.viewingEmployeeID = action.payload;
            if (state.loggedInEmployeeID === action.payload) {
                state.viewingAnotherCalendar = false;
            } else {
                state.viewingAnotherCalendar = true;
            }
        },
        updateRefreshing: (state, action) => {
            state.refreshing = action.payload;
        }
    },
    extraReducers: {
        [checkLoginCredentials.pending]: (state, action) => {
            state.loading = true;
        },
        [checkLoginCredentials.fulfilled]: (state, action) => {
            state.failedAttempt = false;
            state.loading = false;
            state.token = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.employee = jwtDecode(action.payload.accessToken);
            state.viewingEmployeeID = parseInt(state.employee.employeeID);
            state.loggedInEmployeeID = parseInt(state.employee.employeeID);
            state.isAuthenticated = true;
        },
        [checkLoginCredentials.rejected]: (state, action) => {
            state.failedAttempt = true;
            state.loading = false;
            state.isAuthenticated = false;   
        },
    },
});

export const { logout, updateFromRefreshToken, updateViewingEmployee, updateRefreshing } = LoginSlice.actions;

export default LoginSlice.reducer;