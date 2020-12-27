export default function storageAvailable(): boolean {
	try {
		let id;

		do {
			id = Math.random().toString(36).slice(2);
		} while (window.localStorage.getItem(id) !== null);

		window.localStorage.setItem(id, "uwu");

		const success = window.localStorage.getItem(id) === "uwu";

		window.localStorage.removeItem(id);

		return success;
	} catch (e) {
		return false;
	}
}