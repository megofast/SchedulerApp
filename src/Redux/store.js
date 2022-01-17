import { configureStore } from "@reduxjs/toolkit";
import AppointmentReducer from "./AppointmentSlice";
import LoginReducer from "./LoginSlice";
import EmployeeReducer from "./EmployeeSlice";
import ClientReducer from "./ClientSlice";

export const store = configureStore({
    reducer: {
        appointmentReducer: AppointmentReducer,
        loginReducer: LoginReducer,
        employeeReducer: EmployeeReducer,
        clientReducer: ClientReducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: false
    })
})