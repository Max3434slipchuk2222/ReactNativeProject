import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ThemeIconButton } from "@/components/ThemeIconButton";
import {Pressable} from "react-native";
import {useLogout} from "@/hooks/use-logout";

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const handleLogout = useLogout();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
                tabBarButton: HapticTab,
                headerShown: true,
                headerStyle: {
                    backgroundColor: Colors[colorScheme ?? 'light'].background,
                },
                headerTintColor: isDark ? "#ffffff" : "#1f2937",
                headerRight: () => <ThemeIconButton size={22} />,
                headerRightContainerStyle: { paddingRight: 16 },
                headerLeft: () => (
                    <Pressable onPress={handleLogout} style={{ paddingLeft: 16 }}>
                        <Ionicons
                            name="log-out-outline"
                            size={22}
                            color={isDark ? "#ffffff" : "#1f2937"}
                        />
                    </Pressable>
                ),
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Головна",
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="home-outline" size={26} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: "Огляд",
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="compass-outline" size={26} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}