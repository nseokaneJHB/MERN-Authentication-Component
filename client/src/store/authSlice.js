import { createSlice } from "@reduxjs/toolkit"

// Slices
const initialState = {
	isAuthenticated: false,
	user: {
		email: "",
		thumbnailUrl: ""
	},
}

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		login(state, action){
			state.user = {...state.user, ...action.payload}
			state.isAuthenticated = true
		},
		logout(state){
			state.user = {}
			state.isAuthenticated = false
		}
	}
})

export const authActions = authSlice.actions
export const authReducer = authSlice.reducer