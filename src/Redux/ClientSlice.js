import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {Variables} from '../Data/Variables';
import axios from 'axios';
import axiosInstance from "../Data/axiosInstance";


export const getClientList = createAsyncThunk(
    "clients/getClientList", async (_, {getState} ) => {
    const state = getState();       // Get the state so the login token can be used
    return axiosInstance.get('client')
        .then( (response) => response.data)
        .catch( (error) => {
            console.log(error);
            return error;
        });

});


const ClientSlice = createSlice({
    name: "clients",
    initialState: {
        loading: false,
        clients: []
    },
    reducers: {
        logout: (state, action) => {
            
        },
    },
    extraReducers: {
        [getClientList.pending]: (state, action) => {
            state.loading = true;
        },
        [getClientList.fulfilled]: (state, action) => {
            state.loading = false;
            state.clients = action.payload;
        },
        [getClientList.rejected]: (state, action) => {
            state.loading = false;
        },
    },
});

export const { logout } = ClientSlice.actions;

export default ClientSlice.reducer;