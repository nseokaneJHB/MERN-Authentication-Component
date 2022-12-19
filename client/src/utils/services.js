// Third party
import axios from 'axios'

const api_url = `${process.env.REACT_APP_API_URL}/api`

const apiOptions = {
	withCredentials: true
}

export const signUpApiCall = async (payload) => {
	const { data } = await axios.post(`${api_url}/sign-up/`, payload, apiOptions)
	return data
}

export const signInApiCall = async (payload) => {
	const { data } = await axios.post(`${api_url}/sign-in/`, payload, apiOptions)
	return data
}

export const signOutApiCall = async (payload) => {
	const { data } = await axios.post(`${api_url}/sign-out/`, payload, apiOptions)
	return data
}

export const getMeApiCall = async () => {
	const { data } = await axios.get(`${api_url}/settings/`, apiOptions)
	return data
}

export const updateMeApiCall = async (payload) => {
	let formData = new FormData()
	Object.keys(payload).forEach(item => {
		formData.append([item], payload[item])
	})
	const { data } = await axios.put(`${api_url}/settings/`, formData, apiOptions)
	return data
}

export const deleteMeApiCall = async (payload) => {
	const { data } = await axios.delete(`${api_url}/settings/`, payload, apiOptions)
	return data
}

export const passwordChangeApiCall = async (payload) => {
	const { data } = await axios.put(`${api_url}/password-change/`, payload, apiOptions);
	return data;
};

export const passwordResetRequestApiCall = async (payload) => {
	const { data } = await axios.post(`${api_url}/password-reset-request/`, payload, apiOptions);
	return data;
};

export const passwordResetVerifyTokenApiCall = async (params) => {
	const { data } = await axios.get(`${api_url}/password-reset-verify/${params.userId}/${params.token}`, apiOptions);
	return data;
};

export const passwordResetApiCall = async (params, payload) => {
	const { data } = await axios.post(`${api_url}/password-reset/${params.userId}/${params.token}`, payload, apiOptions);
	return data;
};