import { useCallback, useEffect, useState } from "react";
import { removeFromArray } from "../../features/_utils/array.utils";

interface UseKeyboardListenerParams {
	onKeyDown?: (event: KeyboardEvent) => void;
	onKeyUp?: (event: KeyboardEvent) => void;
};

export function useKeyboardListener({ onKeyDown, onKeyUp }: UseKeyboardListenerParams) {
	useEffect(() => {
		if (onKeyDown)
			document.addEventListener("keydown", onKeyDown);
		if (onKeyUp)
			document.addEventListener("keyup", onKeyUp);

		return () => {
			if (onKeyDown)
				document.removeEventListener("keydown", onKeyDown);
			if (onKeyUp)
				document.removeEventListener("keyup", onKeyUp);
		};
	}, [onKeyDown, onKeyUp]);
}

interface UseShortcutsParams {
	options: Record<string, Record<string, Function>> | Record<string, Function>;
	shortcuts?: Record<string, Record<string, string[]>> | Record<string, string[]>;
	useCategories?: boolean,
}

export function useShortcuts({ options, shortcuts, useCategories = true }: UseShortcutsParams) {
	const [activeKeys, setActiveKeys] = useState([]);

	const checkShortcuts = useCallback((event, allowExecution = true) => {
		if (!shortcuts)
			return;

		const keys = [...activeKeys];

		// Prevent alt-tabbing from messing with alt key registration
		if (keys.includes("Alt") && !event.altKey)
			removeFromArray("Alt", keys);

		const checkGroup = (group: Record<string, string[]>, category?) => {
			for (const [name, shortcut] of Object.entries(group)) {
				let active = true;

				shortcut.forEach((key) => {
					if (!keys.includes(key) && event.key !== key)
						return active = false;
				});

				if (!active)
					continue;

				event.preventDefault();
				event.stopPropagation();

				if (!shortcut.includes(event.key) || !allowExecution)
					continue;

				if (category != null) {
					options?.[category]?.[name]?.();
				} else {
					(options?.[name] as Function)?.();
				}
			}
		};

		if (useCategories) {
			for (const [category, group] of Object.entries(shortcuts)) {
				checkGroup(group, category);
			}
		} else {
			checkGroup(shortcuts as Record<string, string[]>);
		}

		setActiveKeys(keys);
	}, [activeKeys, options, shortcuts, useCategories]);

	const onKeyDown = (event) => {
		const isRepeated = activeKeys.includes(event.key);
		checkShortcuts(event, isRepeated);

		if (!isRepeated)
			setActiveKeys(activeKeys.concat([event.key]));
	};

	const onKeyUp = (event) => {
		checkShortcuts(event);

		if (activeKeys.includes(event.key)) {
			const keys = [...activeKeys];
			removeFromArray(event.key, keys);
			setActiveKeys(keys);
		}
	};

	useKeyboardListener({ onKeyDown, onKeyUp });
}