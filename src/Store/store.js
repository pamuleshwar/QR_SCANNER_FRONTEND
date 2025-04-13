import { configureStore } from "@reduxjs/toolkit";
import sessionReducer from './sessionSlice.js'

export const store = configureStore({
    reducer : {
        session : sessionReducer,
    }
});