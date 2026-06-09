import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { setThemeMode, type ThemeMode } from "@/store/reducers/ThemeSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";

const CYCLE: ThemeMode[] = ["light", "dark", "system"];

const ICON_MAP: Record<ThemeMode, keyof typeof Ionicons.glyphMap> = {
    light:  "sunny",
    dark:   "moon",
    system: "phone-portrait",
};

export function ThemeIconButton({ size = 24 }: { size?: number }) {
    const dispatch     = useAppDispatch();
    const current      = useAppSelector((s) => s.themeReducer.mode);
    const systemScheme = useColorScheme();

    const resolved = current === "system" ? (systemScheme ?? "light") : current;
    const isDark   = resolved === "dark";

    const handlePress = async () => {
        const nextIndex = (CYCLE.indexOf(current) + 1) % CYCLE.length;
        const next = CYCLE[nextIndex];
        dispatch(setThemeMode(next));
        await AsyncStorage.setItem("app_theme", next);
    };

    return (
        <Pressable
            onPress={handlePress}
            style={({ pressed }) => ({
                opacity: pressed ? 0.6 : 1,
                padding: 4,
            })}
            hitSlop={8}
        >
            <Ionicons
                name={ICON_MAP[current]}
                size={size}
                color={isDark ? "#ffffff" : "#1f2937"}
            />
        </Pressable>
    );
}