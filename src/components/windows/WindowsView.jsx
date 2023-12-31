import { useWindows } from "../../hooks/windows/windowsContext.js";
import { useWindowsManager } from "../../hooks/windows/windowsManagerContext.js";
import { memo, useEffect, useState } from "react";
import { WindowView } from "./WindowView.jsx";
import { useSettingsManager } from "../../hooks/settings/settingsManagerContext.js";
import { SettingsManager } from "../../features/settings/settingsManager.js";
import { NAME, TAG_LINE } from "../../config/branding.config.js";
import { setViewportIcon, setViewportTitle } from "../../features/_utils/browser.utils.js";

export const WindowsView = memo(() => {
	const settingsManager = useSettingsManager();
	const windows = useWindows();
	const windowsManager = useWindowsManager();
	const [sortedWindows, setSortedWindows] = useState([]);

	// Sort windows
	useEffect(() => {
		setSortedWindows([...windows].sort((windowA, windowB) =>
			windowA.lastInteraction - windowB.lastInteraction
		));
	}, [windows]);

	useEffect(() => {
		const resetViewportTitleAndIcon = () => {
			setViewportTitle(`${NAME} | ${TAG_LINE}`);
			setViewportIcon(`${process.env.PUBLIC_URL}/favicon.ico`);
		};

		if (sortedWindows.length === 0 || sortedWindows[sortedWindows.length - 1].minimized)
			resetViewportTitleAndIcon();

		window.addEventListener("blur", resetViewportTitleAndIcon);

		return () => {
			window.removeEventListener("blur", resetViewportTitleAndIcon);
		};
	}, [sortedWindows]);

	// Launch startup apps
	useEffect(() => {
		const settings = settingsManager.get(SettingsManager.VIRTUAL_PATHS.apps);
		settings.get("startup", (value) => {
			if (value !== "")
				windowsManager.startup(value?.split(","));
		});
	}, [settingsManager, windowsManager]);

	// TO DO: prevent windows from being rerendered when order is changed

	return (<div>
		{windows.map((window) => {
			const { id, app, size, position, options, minimized } = window;
			const index = sortedWindows.indexOf(window);
			return <WindowView
				key={id}
				onInteract={() => { windowsManager.focus(id); }}
				active={index === sortedWindows.length - 1}
				id={id}
				app={app}
				size={size}
				index={index}
				position={position}
				options={options}
				minimized={minimized}
				toggleMinimized={(event) => {
					event.preventDefault();
					event.stopPropagation();
					windowsManager.setMinimized(id, !minimized);
				}}
			/>;
		})}
	</div>);
});