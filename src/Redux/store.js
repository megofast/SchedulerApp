import { configureStore } from "@reduxjs/toolkit";
import AppointmentReducer from "./AppointmentSlice";

export const store = configureStore({
    reducer: {
        appointmentReducer: AppointmentReducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: false
    })
})