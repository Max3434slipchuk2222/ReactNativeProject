import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ThemeIconButton } from "@/components/ThemeIconButton";

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
                tabBarButton: HapticTab,
                headerShown: true,
                headerStyle: {
                    backgroundColor: isDark ? "#18181b" : "#ffffff",
                },
                headerTintColor: isDark ? "#ffffff" : "#1f2937",
                headerRight: () => <ThemeIconButton size={22} />,
                headerRightContainerStyle: { paddingRight: 16 },
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