import { useEffect } from "react";
import { Appearance } from "react-native";

export function useSyncAppearance(resolved: "light" | "dark") {
    useEffect(() => {
        Appearance.setColorScheme(resolved);
    }, [resolved]);
}