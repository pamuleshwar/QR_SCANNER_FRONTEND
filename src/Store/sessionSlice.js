import { createSlice } from "@reduxjs/toolkit";

const sessionSlice = createSlice({
    name : "session",
    initialState : null,
    reducers : {
        addSession : (state, action) => {
            return  action.payload;
        },
        removeSession : (state, action) => {
            return null;
        }
    }
});

//export actions
export const {addSession, removeSession} = sessionSlice.actions;

//export reducer
export default sessionSlice.reducer;