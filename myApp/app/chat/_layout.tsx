import {router, Stack} from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeIconButton } from "@/components/ThemeIconButton";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLogout } from "@/hooks/use-logout";

export default function ChatLayout() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const handleLogout = useLogout();

    const commonHeaderOptions = {
        headerStyle: {
            backgroundColor: Colors[colorScheme ?? "light"].background,
        },
        headerTintColor: isDark ? "#ffffff" : "#1f2937",
        headerRight: () => <ThemeIconButton size={22} />,
        headerRightContainerStyle: { paddingRight: 16 },
    };
    const backHeaderLeft = () => (
        <Pressable onPress={() => router.back()} style={{ padding: 16 }}>
            <Ionicons
                name="arrow-back-outline"
                size={22}
                color={isDark ? "#ffffff" : "#1f2937"}
            />
        </Pressable>
    );
    return (
        <SafeAreaProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen
                    name="home"
                    options={{
                        ...commonHeaderOptions,
                        headerShown: true,
                        title: "chat",
                    }}
                />
                <Stack.Screen
                    name="create"
                    options={{
                        ...commonHeaderOptions,
                        headerShown: true,
                        title: "Новий чат",
                        headerLeft: backHeaderLeft,
                    }}
                />
                <Stack.Screen
                    name="join"
                    options={{
                        ...commonHeaderOptions,
                        headerShown: true,
                        title: "Чати",
                        headerLeft: backHeaderLeft,
                    }}
                />
            </Stack>
        </SafeAreaProvider>
    );
}