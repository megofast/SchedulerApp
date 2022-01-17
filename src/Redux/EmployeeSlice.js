import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {Variables} from '../Data/Variables';
import axios from 'axios';


export const getEmployeeList = createAsyncThunk(
    "employees/getEmployeeList", async (_, {getState} ) => {
    const state = getState();       // Get the state so the login token can be used
    return axios
    .get(Variables.API_URL + "employee",{
        headers: {
            Authorization: `Bearer ${state.loginReducer.token}`
        }
    })
    .then((response) => response.data)
    .catch((error) => error)
});


const EmployeeSlice = createSlice({
    name: "employees",
    initialState: {
        loading: false,
        employees: []
    },
    reducers: {
        logout: (state, action) => {
            
        },
    },
    extraReducers: {
        [getEmployeeList.pending]: (state, action) => {
            state.loading = true;
        },
        [getEmployeeList.fulfilled]: (state, action) => {
            state.loading = false;
            state.employees = action.payload;
        },
        [getEmployeeList.rejected]: (state, action) => {
            state.loading = false;
        },
    },
});

export const { logout } = EmployeeSlice.actions;

export default EmployeeSlice.reducer;