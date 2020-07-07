/**
 * Retrieve the saved state of a UI element.
 * @param key the name of the UI element whose state we want to retrieve
 */
export const getPreferences = (key) => {
	return JSON.parse(window.localStorage.getItem(key))
}

/**
 * Save the current state of a UI element
 * @param key the name of the UI element whose state we want to save
 * @param JSONObject contains the state of the UI element
 */
export const savePreferences = (key, JSONObject) => {
	window.localStorage.setItem(key, JSON.stringify(JSONObject))
}