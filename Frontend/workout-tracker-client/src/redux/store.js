import { configureStore } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage'; 
import authReducer from './authSlice'
import { persistStore, persistReducer } from 'redux-persist';



const persistConfig = {
    key : 'auth',
    storage,
}

const persistedReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
    reducer:{
        auth : persistedReducer
    }
})


const persistor = persistStore(store);

export const getToken = (state) => state.auth.accessToken;
export const getRefreshToken = (state) => state.auth.refreshToken;

export { store, persistor };