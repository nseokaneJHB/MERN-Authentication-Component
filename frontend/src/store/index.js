import { configureStore } from "@reduxjs/toolkit"
import storageSession from 'reduxjs-toolkit-persist/lib/storage/session'
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';

// Imports
import { authReducer } from "./authSlice";

// Store
const persistConfig = {
	key: 'root',
	storage: storageSession,
}

const persistedReducer = persistReducer(persistConfig, authReducer)
  
export const store = configureStore({
	reducer: persistedReducer,
	devTools: process.env.NODE_ENV !== 'production',
	middleware: [thunk]
})

export const persister = persistStore(store)