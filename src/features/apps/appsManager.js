import App from "./app.js";
import { FileExplorer } from "../../components/apps/file-explorer/FileExplorer.jsx";
import { MediaViewer } from "../../components/apps/media-viewer/MediaViewer.jsx";
import { WebView } from "../../components/apps/_utils/web-view/WebView.jsx";
import { Terminal } from "../../components/apps/terminal/Terminal.jsx";
import { TextEditor } from "../../components/apps/text-editor/TextEditor.jsx";
import { Settings } from "../../components/apps/settings/Settings.jsx";
import { Calculator } from "../../components/apps/calculator/Calculator.jsx";
import Vector2 from "../math/vector2.js";
import { APPS, APP_NAMES } from "../../config/apps.config.js";
import { Browser } from "../../components/apps/browser/Browser.jsx";
import { IMAGE_FORMATS } from "../../config/apps/mediaViewer.config.js";

export default class AppsManager {
	/** @type {App[]} */
	static APPS = [
		new App(APP_NAMES.TERMINAL, APPS.TERMINAL, Terminal),
		new App(APP_NAMES.SETTINGS, APPS.SETTINGS, Settings),
		new App(APP_NAMES.MEDIA_VIEWER, APPS.MEDIA_VIEWER, MediaViewer),
		// new App("Browser", "browser"),
		new App(APP_NAMES.CALCULATOR, APPS.CALCULATOR, Calculator, { size: new Vector2(400, 600) }),
		new App(APP_NAMES.TEXT_EDITOR, APPS.TEXT_EDITOR, TextEditor),
		// new App("Code Editor", "code-editor"),
		new App(APP_NAMES.FILE_EXPLORER, APPS.FILE_EXPLORER, FileExplorer),
		new App("Wordle", "wordle", WebView, {
			source: "https://prozilla.dev/wordle",
			size: new Vector2(400, 650)
		}),
		new App("Balls", "balls", WebView, {
			source: "https://prozilla.dev/ball-maze",
			size: new Vector2(600, 600)
		}),
		new App("Minesweeper", "minesweeper", WebView, {
			source: "https://prozilla.dev/minesweeper",
			size: new Vector2(500, 580)
		}),
		new App(APP_NAMES.BROWSER, APPS.BROWSER, Browser, {
			size: new Vector2(700, 500)
		}),
	];

	/**
	 * @param {string} id 
	 * @returns {App | null}
	 */
	static getAppById(id) {
		let application = null;

		this.APPS.forEach((app) => {
			if (app.id === id) {
				application = app;
				return;
			}
		});

		return application;
	}

	/**
	 * Get the app associated with a file extension
	 * @param {string} fileExtension 
	 * @returns {App}
	 */
	static getAppByFileExtension(fileExtension) {
		let app = null;

		if (IMAGE_FORMATS.includes(fileExtension))
			return this.getAppById(APPS.MEDIA_VIEWER);

		switch (fileExtension) {
			default:
				app = this.getAppById(APPS.TEXT_EDITOR);
				break;
		}

		return app;
	}

	/**
	 * Returns the url of an icon inside the icons folder or the default icon of an app
	 * @param {string} appId 
	 * @param {string | null} iconName 
	 * @returns {string}
	 */
	static getAppIconUrl(appId, iconName) {
		if (iconName == null) {
			return `${process.env.PUBLIC_URL}/assets/apps/icons/${appId}.svg`;
		} else {
			return `${process.env.PUBLIC_URL}/assets/apps/${appId}/icons/${iconName}.svg`;
		}
	}
}