import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../Data/axiosInstance";


export const getClientList = createAsyncThunk(
    "clients/getClientList", async (_, {getState} ) => {
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