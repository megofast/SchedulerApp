import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
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
    .post(Variables.API_URL + "login", userLoginDetails, {
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
        employeeID: null,
        employee: []
    },
    reducers: {
        logout: (state, action) => {
            state.token = "";
            state.employee = [];
            state.employeeID = null;
            state.isAuthenticated = false;
        },
    },
    extraReducers: {
        [checkLoginCredentials.pending]: (state, action) => {
            state.loading = true;
        },
        [checkLoginCredentials.fulfilled]: (state, action) => {
            state.failedAttempt = false;
            state.loading = false;
            state.token = action.payload;
            state.employee = jwtDecode(action.payload);
            state.employeeID = parseInt(state.employee.employeeID);
            state.isAuthenticated = true;
        },
        [checkLoginCredentials.rejected]: (state, action) => {
            state.failedAttempt = true;
            state.loading = false;
            state.isAuthenticated = false;   
        },
    },
});

export const { logout } = LoginSlice.actions;

export default LoginSlice.reducer;