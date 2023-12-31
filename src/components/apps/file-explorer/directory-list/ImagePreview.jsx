import { useState } from "react";
import styles from "./ImagePreview.module.css";
import { ReactSVG } from "react-svg";
import AppsManager from "../../../../features/apps/appsManager.js";
import { APPS } from "../../../../config/apps.config.js";

export function ImagePreview({ source, className, onError, ...props }) {
	const [loadingFailed, setLoadingFailed] = useState(false);

	const onLoadingError = () => {
		setLoadingFailed(true);
		onError?.();
	};

	const classNames = [styles["Image-preview"]];
	if (className != null)
		classNames.push(className);

	return (<div className={classNames.join(" ")} {...props}>
		{loadingFailed
			? <ReactSVG src={AppsManager.getAppIconUrl(APPS.FILE_EXPLORER, "file")}/>
			: source.endsWith(".svg")
				? <ReactSVG src={source} onError={onLoadingError}/>
				: <img src={source} onError={onLoadingError} alt="Preview" draggable="false"/>
		}
	</div>);
}