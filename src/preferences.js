export const getPreferences = (key) => {
	return JSON.parse(window.localStorage.getItem(key))
}

export const savePreferences = (key, JSONObject) => {
	window.localStorage.setItem(key, JSON.stringify(JSONObject))
}