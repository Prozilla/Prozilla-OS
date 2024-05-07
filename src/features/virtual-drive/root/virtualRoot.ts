import { StorageManager } from "../../storage/storageManager";
import { VirtualFolderLink } from "../folder/virtualFolderLink";
import { loadDefaultData } from "./defaultData";
import { VirtualFile, VirtualFileJson } from "../file/virtualFile";
import { VirtualFolder } from "../folder";
import { VirtualFileLink } from "../file/virtualFileLink";
import { VirtualFolderJson } from "../folder/virtualFolder";

export interface VirtualRootJson extends VirtualFolderJson {
	scs: Record<string, string>;
}

/**
 * A virtual folder that serves as the root folder
 */
export class VirtualRoot extends VirtualFolder {
	shortcuts: Record<string, VirtualFile | VirtualFileLink | VirtualFolder | VirtualFolderLink>;
	initiated: boolean = false;
	loadedDefaultData: boolean = false;

	constructor() {
		super("root");
		this.root = this;
		this.isRoot = true;
		this.shortcuts = {};
	}

	loadDefaultData() {
		loadDefaultData(this);
	}

	loadData() {
		const data = StorageManager.load("data");
		if (data == null)
			return;

		let object;
		try {
			object = JSON.parse(data);
		} catch (error) {
			console.error(error);
		}
		if (object == null)
			return;

		const shortcuts = { ...object.scs };

		const addFile = ({
			nam: name,
			ext: extension,
			src: source,
			cnt: content,
			lnk: link,
			ico: iconUrl,
		}: any, parent: VirtualFolder = this) => {
			if (link) {
				parent.createFileLink(name, (fileLink: VirtualFileLink) => {
					fileLink.setLinkedPath(link);
					if (iconUrl != null) {
						fileLink.setIconUrl(iconUrl);
					}
				});
				return;
			}
			
			parent.createFile(name, extension, (file: VirtualFile) => {
				if (source != null) {
					file.setSource(source);
				} else if (content != null) {
					file.setContent(content);
				}
				if (iconUrl != null) {
					file.setIconUrl(iconUrl);
				}
			});
		};

		const addFolder = ({
			nam: name,
			fds: folders,
			fls: files,
			lnk: link,
			ico: iconUrl,
		}: any, parent: VirtualFolder = this) => {
			if (link) {
				parent.createFolderLink(name, (folderLink: VirtualFolderLink) => {
					folderLink.setLinkedPath(link);
					if (iconUrl != null) {
						folderLink.setIconUrl(iconUrl);
					}
				});
				return;
			}

			parent.createFolder(name, (folder: VirtualFolder) => {
				if (Object.values(shortcuts).includes(folder.displayPath)) {
					let alias;
					for (const [key, value] of Object.entries(shortcuts)) {
						if (value === folder.displayPath)
							alias = key;
					}
					folder.setAlias(alias);
				}
				if (folders != null) {
					folders.forEach((subFolder: VirtualFolderJson) => {
						addFolder(subFolder, folder);
					});
				}
				if (files != null) {
					files.forEach((file: VirtualFileJson) => {
						addFile(file, folder);
					});
				}
				if (iconUrl != null) {
					folder.setIconUrl(iconUrl);
				}
			});
		};

		if (object.fds != null) {
			object.fds.forEach((subFolder: VirtualFolderJson) => {
				addFolder(subFolder);
			});
		}
		if (object.fls != null) {
			object.fls.forEach((file: VirtualFileJson) => {
				addFile(file);
			});
		}
	}

	/**
	 * Calls the storage manager's store function with this root's data as a string
	 */
	saveData() {
		if (!this.initiated)
			return;

		const data = this.toString();

		if (data == null)
			return;

		StorageManager.store("data", data);
	}

	/**
	 * Initiates this root by loading the default data and then the user's data on top
	 */
	init(): VirtualRoot {
		this.initiated = false;

		// Load default data
		this.loadedDefaultData = false;
		this.setAlias("/");
		this.loadDefaultData();
		this.loadedDefaultData = true;

		// Load user's data
		this.loadData();
		this.initiated = true;

		return this;
	}

	/**
	 * Adds a shortcut to a file or folder
	 */
	addShortcut(name: string, destination: VirtualFile | VirtualFileLink | VirtualFolder | VirtualFolderLink) {
		this.shortcuts[name] = destination;
		return this;
	}

	/**
	 * Tells the storage manager to clear all data and reloads the window
	 */
	reset() {
		if (window.confirm("Are you sure you want to reset all your data?")) {
			StorageManager.clear();
			window.location.reload();
		}
	}

	static isValidName(name) {
		// TO DO
	}

	static isValidFileName(name) {
		// TO DO
	}

	static isValidFolderName(name) {
		// TO DO
	}

	get path() {
		return "";
	}

	get displayPath() {
		return "/";
	}

	toJSON(): VirtualRootJson | null {
		const object = super.toJSON() as VirtualRootJson;

		if (object == null)
			return null;

		if (Object.entries(this.shortcuts).length > 0) {
			object.scs = {};

			for (const [key, value] of Object.entries(this.shortcuts)) {
				if (!value.root)
					object.scs[key] = value.absolutePath;
			}
		}

		return object;
	}

	/**
	 * @returns {string | null}
	 */
	toString(): string | null {
		const json = this.toJSON();

		if (json == null)
			return null;

		return JSON.stringify(json);
	}
}