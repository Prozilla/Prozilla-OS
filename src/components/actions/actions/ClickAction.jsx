import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatShortcut } from "../../../features/_utils/string.utils.js";
import styles from "../Actions.module.css";
import { ImagePreview } from "../../apps/file-explorer/directory-list/ImagePreview.jsx";
import { memo } from "react";

/**
 * @param {object} props
 * @param {string} props.actionId
 * @param {string} props.label
 * @param {string[]} props.shortcut
 * @param {Function} props.onTrigger
 * @param {string|object} props.icon
 */
export const ClickAction = memo(({ actionId, label, shortcut, onTrigger, icon }) => {
	return (<button key={actionId} className={styles.Button} tabIndex={0} onClick={onTrigger}>
		<span className={styles.Label}>
			{icon && <div className={styles.Icon}>
				{typeof icon == "string"
					? <ImagePreview source={icon} className={styles["Image-icon"]}/>
					: <FontAwesomeIcon icon={icon}/>
				}
			</div>}
			<p>{label}</p>
		</span>
		{shortcut && <p className={styles.Shortcut}>{formatShortcut(shortcut)}</p>}
	</button>);
});