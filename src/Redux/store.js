import { configureStore } from "@reduxjs/toolkit";
import AppointmentReducer from "./AppointmentSlice";
import LoginReducer from "./LoginSlice";

export const store = configureStore({
    reducer: {
        appointmentReducer: AppointmentReducer,
        loginReducer: LoginReducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: false
    })
})