import { createContext } from "react"

// Third party
import axios from 'axios'

const AuthContext = createContext({})

export const AuthContextProvider = ({ children }) => {
	const url = 'http://localhost:8000/api'
	const apiOptions = {
		withCredentials: true
	}

	const signUpApiCall = async (payload) => {
		return await axios.post(`${url}/auth/sign-up/`, payload, apiOptions)
	}

	const signInApiCall = async (payload) => {
		return await axios.post(`${url}/auth/sign-in/`, payload, apiOptions)
	}

	const signOutApiCall = async () => {
		const { data } = await axios.post(`${url}/auth/sign-out/`, apiOptions)
		return data
	}

	const getProfileApiCall = async () => {
		const { data } = await axios.get(`${url}/settings/`, apiOptions)
		return data
	}

	const updatedProfileApiCall = async (payload) => {
		return await axios.put(`${url}/settings/`, payload, apiOptions)
	}

	const changePasswordApiCall = async (payload) => {
		return await axios.put(`${url}/settings/change-password/`, payload, apiOptions)
	}

	return <AuthContext.Provider value={{
		signUpApiCall,
		signInApiCall,
		signOutApiCall,
		getProfileApiCall,
		updatedProfileApiCall,
		changePasswordApiCall,
	}}>{ children }</AuthContext.Provider>
}

export default AuthContext