import { useState, useEffect, useCallback } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemeMode = "light" | "dark" | "system";

const STORAGE_KEY = "app_theme";

export function useAppTheme() {
    const systemScheme = useColorScheme();
    const [mode, setMode] = useState<ThemeMode>("system");
    useEffect(() => {
        AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
            if (saved === "light" || saved === "dark" || saved === "system") {
                setMode(saved);
            }
        });
    }, []);
    const resolvedTheme: "light" | "dark" =
        mode === "system" ? (systemScheme ?? "light") : mode;

    const setTheme = useCallback(async (newMode: ThemeMode) => {
        setMode(newMode);
        await AsyncStorage.setItem(STORAGE_KEY, newMode);
    }, []);

    return { mode, resolvedTheme, setTheme, isDark: resolvedTheme === "dark" };
}