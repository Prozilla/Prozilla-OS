export class StorageManager {
	static MAX_BYTES = 5_000_000;

	/**
	 * @param {string} key 
	 * @param {string} value 
	 */
	static store(key, value) {
		localStorage.setItem(key, value);
	}

	/**
	 * @param {string} key 
	 * @returns {string | null}
	 */
	static load(key) {
		return localStorage.getItem(key);
	}

	static clear() {
		localStorage.clear();
	}

	/**
	 * @param {string} string 
	 * @returns {number} bytes
	 */
	static getByteSize(string) {
		return new Blob([string]).size;
	}

	/**
	 * @param {number} bytes 
	 * @returns {number} kilobytes
	 */
	static byteToKilobyte(bytes) {
		return bytes / 1000;
	}
}