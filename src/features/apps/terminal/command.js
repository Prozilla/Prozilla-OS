import { VirtualFolder } from "../../virtual-drive/folder/virtualFolder.js";
import { VirtualRoot } from "../../virtual-drive/root/virtualRoot.js";

/**
 * @callback executeType
 * @param {string[]} args 
 * @param {object} options
 * @param {Function} options.promptOutput
 * @param {Function} options.pushHistory 
 * @param {VirtualRoot} options.virtualRoot 
 * @param {VirtualFolder} options.currentDirectory 
 * @param {Function} options.setCurrentDirectory 
 * @param {string} options.username 
 * @param {string} options.hostname 
 * @param {string} options.rawInputValue 
 * @param {string[]} options.options 
 * @param {Function} options.exit
 * @returns {string|{ blank: boolean }}
 */

export default class Command {
	/** @type {string} */
	name;

	/** @type {executeType} */
	execute = () => {};

	/**
	 * @param {string} name 
	 * @param {executeType} execute 
	 */
	constructor(name, execute) {
		this.name = name;
		this.execute = execute;
	}

	/**
	 * @param {string} name 
	 * @returns {Command}
	 */
	setName(name) {
		this.name = name;
		return this;
	}

	/**
	 * @param {executeType} execute 
	 * @returns {Command}
	 */
	setExecute(execute) {
		this.execute = execute;
		return this;
	}

	/**
	 * @param {boolean} value 
	 * @returns {Command}
	 */
	setRequireArgs(value) {
		this.requireArgs = value;
		return this;
	}

	/**
	 * @param {boolean} value 
	 * @returns {Command}
	 */
	setRequireOptions(value) {
		this.requireOptions = value;
		return this;
	}

	/**
	 * @param {{ purpose: string, usage: string, description: string, options: object }} manual 
	 * @returns {Command}
	 */
	setManual({ purpose, usage, description, options }) {
		this.manual = { purpose, usage, description, options };
		return this;
	}
}