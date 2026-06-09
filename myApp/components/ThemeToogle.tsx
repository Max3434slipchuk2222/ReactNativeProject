import { View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { setThemeMode, type ThemeMode } from "@/store/reducers/ThemeSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";

const OPTIONS: { value: ThemeMode; icon: keyof typeof Ionicons.glyphMap }[] = [
    { value: "light",  icon: "sunny-outline"           },
    { value: "dark",   icon: "moon-outline"            },
    { value: "system", icon: "phone-portrait-outline"  },
];

export function ThemeToggle() {
    const dispatch     = useAppDispatch();
    const current      = useAppSelector((s) => s.themeReducer.mode);
    const systemScheme = useColorScheme();

    const resolved = current === "system" ? (systemScheme ?? "light") : current;
    const isDark   = resolved === "dark";

    const handleSelect = async (mode: ThemeMode) => {
        dispatch(setThemeMode(mode));
        await AsyncStorage.setItem("app_theme", mode);
    };

    return (
        <View
            style={{
                flexDirection: "row",
                gap: 8,
                backgroundColor: isDark ? "#27272a" : "#f4f4f5",
                borderRadius: 999,
                padding: 4,
            }}
        >
            {OPTIONS.map(({ value, icon }) => {
                const active = current === value;
                return (
                    <Pressable
                        key={value}
                        onPress={() => handleSelect(value)}
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 999,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: active
                                ? isDark ? "#3f3f46" : "#ffffff"
                                : "transparent",
                            shadowColor: active ? "#000" : "transparent",
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: active ? 0.15 : 0,
                            shadowRadius: 2,
                            elevation: active ? 2 : 0,
                        }}
                    >
                        <Ionicons
                            name={icon}
                            size={18}
                            color={
                                active
                                    ? isDark ? "#ffffff" : "#2563eb"
                                    : isDark ? "#71717a" : "#a1a1aa"
                            }
                        />
                    </Pressable>
                );
            })}
        </View>
    );
}