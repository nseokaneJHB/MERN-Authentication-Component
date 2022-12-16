// Third party
import axios from 'axios'

const apiOptions = {
	withCredentials: true
}

export const signUpApiCall = async (payload) => {
	const { data } = await axios.post(`/sign-up/`, payload, apiOptions)
	return data
}

export const signInApiCall = async (payload) => {
	const { data } = await axios.post(`/sign-in/`, payload, apiOptions)
	return data
}

export const signOutApiCall = async (payload) => {
	const { data } = await axios.post(`/sign-out/`, payload, apiOptions)
	return data
}

export const getMeApiCall = async () => {
	const { data } = await axios.get(`/settings/`, apiOptions)
	return data
}

export const updateMeApiCall = async (payload) => {
	let formData = new FormData()
	Object.keys(payload).forEach(item => {
		formData.append([item], payload[item])
	})
	const { data } = await axios.put(`/settings/`, formData, apiOptions)
	return data
}

export const passwordChangeApiCall = async (payload) => {
	const { data } = await axios.put(`/password-change/`, payload, apiOptions);
	return data;
};

export const passwordResetRequestApiCall = async (payload) => {
	const { data } = await axios.post(`/password-reset-request/`, payload, apiOptions);
	return data;
};

export const passwordResetVerifyTokenApiCall = async (params) => {
	const { data } = await axios.get(`/password-reset-verify/${params.userId}/${params.token}`, apiOptions);
	return data;
};

export const passwordResetApiCall = async (params, payload) => {
	const { data } = await axios.post(`/password-reset/${params.userId}/${params.token}`, payload, apiOptions);
	return data;
};