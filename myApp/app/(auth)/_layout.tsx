import {View} from "react-native";
import {Slot} from "expo-router";
import {AuthTabs} from "@/components/auth/AuthTabs";
import {SafeAreaView} from "react-native-safe-area-context";
import {ThemeIconButton} from "@/components/ThemeIconButton";

export default function AuthLayout() {
    return (
        <View className="flex-1 bg-white dark:bg-zinc-950">
            <SafeAreaView className="flex-1 p-6">
                <View className="items-end mb-2">
                    <ThemeIconButton size={22}/>
                </View>
                <Slot/>
                <AuthTabs/>
            </SafeAreaView>
        </View>
    );
}