import styles from "./App.module.css";
import { Taskbar } from "./components/taskbar/Taskbar";
import { WindowsManagerProvider } from "./hooks/windows/windowsManagerContext";
import { WindowsView } from "./components/windows/WindowsView";
import { VirtualRootProvider } from "./hooks/virtual-drive/virtualRootContext";
import { Desktop } from "./components/desktop/Desktop";
import { SettingsManagerProvider } from "./hooks/settings/settingsManagerContext";
import { ModalsView } from "./components/modals/ModalsView";
import { FC, useEffect } from "react";
import { ZIndexManagerProvider } from "./hooks/z-index/zIndexManagerContext";
import { TrackingManager } from "./features/tracking/trackingManager";
import { ModalsManagerProvider } from "./hooks/modals/modalsManagerContext";

TrackingManager.initialize();

const App: FC = () => {
	useEffect(() => {
		const onContextMenu = (event: Event) => {
			event.preventDefault();
		};

		document.addEventListener("contextmenu", onContextMenu);

		return () => {
			document.removeEventListener("contextmenu", onContextMenu);
		};
	}, []);

	return (
		<VirtualRootProvider>
			<ZIndexManagerProvider>
				<WindowsManagerProvider>
					<ModalsManagerProvider>
						<SettingsManagerProvider>
							<div className={styles.App}>
								<Taskbar/>
								<WindowsView/>
								<ModalsView/>
								<Desktop/>
							</div>
						</SettingsManagerProvider>
					</ModalsManagerProvider>
				</WindowsManagerProvider>
			</ZIndexManagerProvider>
		</VirtualRootProvider>
	);
};

export default App;