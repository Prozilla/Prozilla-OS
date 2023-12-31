import { useEffect, useState } from "react";
import { SettingsManager } from "../../../../features/settings/settingsManager.js";
import styles from "../Settings.module.css";
import utilStyles from "../../../../styles/utils.module.css";
import { useVirtualRoot } from "../../../../hooks/virtual-drive/virtualRootContext.js";
import { useSettingsManager } from "../../../../hooks/settings/settingsManagerContext.js";
import { WALLPAPERS_PATH } from "../../../../config/apps/settings.config.js";
import { useWindowedModal } from "../../../../hooks/modals/windowedModal.js";
import ModalsManager from "../../../../features/modals/modalsManager.js";
import { Button } from "../../../_utils/button/Button.jsx";
import { FileSelector } from "../../../modals/file-selector/FileSelector.jsx";
import { SELECTOR_MODE } from "../../../../config/apps/fileExplorer.config.js";
import { DEFAULT_FILE_SELECTOR_SIZE } from "../../../../config/modals.config.js";
import { IMAGE_FORMATS } from "../../../../config/apps/mediaViewer.config.js";

/**
 * @param {object} props 
 * @param {ModalsManager} props.modalsManager 
 */
export function AppearanceSettings({ modalsManager }) {
	const virtualRoot = useVirtualRoot();
	const settingsManager = useSettingsManager();
	const [wallpaper, setWallpaper] = useState(null);
	const settings = settingsManager.get(SettingsManager.VIRTUAL_PATHS.desktop);
	const { openWindowedModal } = useWindowedModal({ modalsManager });

	useEffect(() => {
		settings.get("wallpaper", setWallpaper);
	}, [settings]);

	const onChange = (event) => {
		const value = event.target.value;
		settings.set("wallpaper", value);
	};

	return (<>
		<div className={styles["Option"]}>
			<p className={styles["Label"]}>Wallpaper</p>
			<Button
				className={`${styles.Button} ${utilStyles["Text-bold"]}`}
				onClick={() => {
					openWindowedModal({
						size: DEFAULT_FILE_SELECTOR_SIZE,
						Modal: (props) => <FileSelector
							type={SELECTOR_MODE.SINGLE}
							allowedFormats={IMAGE_FORMATS}
							onFinish={(file) => {
								settings.set("wallpaper", file.source);
							}}
							{...props}
						/>
					});
				}}
			>
				Browse
			</Button>
			<div className={styles["Input"]}>
				{virtualRoot.navigate(WALLPAPERS_PATH)?.getFiles()?.toReversed().map(({ id, source }) =>
					<label className={styles["Image-select"]} key={id}>
						<input
							type="radio"
							value={source}
							aria-label="Wallpaper image"
							checked={source === wallpaper ? "checked" : ""}
							onChange={onChange}
							tabIndex={0}
						/>
						<img src={source} alt={id} draggable="false"/>
					</label>
				)}
			</div>
		</div>
	</>);
}