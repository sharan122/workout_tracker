import { createSlice } from '@reduxjs/toolkit'


const initialState ={
    userName:'',
    email:'',
    accessToken:'',
    refreshToken:'',
}


const authSlice = createSlice({
    name : 'auth',
    initialState,
    reducers:{
        login:(state,action)=>{
             state.userName = action.payload.user.username;
             state.email = action.payload.user.email;
             state.accessToken = action.payload.access;
             state.refreshToken = action.payload.refresh;

        },
        logout:(state)=>{
            state.userName= null
            state.email= null
            state.accessToken= null
            state.refreshToken= null

        }
    }
})

export const {login,logout} = authSlice.actions;
export default authSlice.reducer;