import { View, Text, TextInput, Pressable, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function ResetPasswordScreen() {
    const router = useRouter();
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    return (
        <View className="flex-1 justify-center bg-zinc-50 dark:bg-zinc-950 items-center px-6">
            <Text className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                Новий пароль
            </Text>

            <TextInput
                placeholder="Новий пароль"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                placeholderTextColor="#9ca3af"
                className="w-full max-w-md bg-white dark:bg-zinc-800 text-black dark:text-white rounded-lg px-4 py-3 mb-4 border border-gray-300 dark:border-zinc-700"
            />

            <TextInput
                placeholder="Підтвердіть пароль"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholderTextColor="#9ca3af"
                className="w-full max-w-md bg-white dark:bg-zinc-800 text-black dark:text-white rounded-lg px-4 py-3 mb-6 border border-gray-300 dark:border-zinc-700"
            />

            <Pressable
                className="w-full max-w-md bg-blue-500 rounded-lg py-3 items-center mb-3"
                onPress={() => console.log("TODO: реалізувати")}
            >
                <Text className="text-white font-semibold">Змінити пароль</Text>
            </Pressable>

            <TouchableOpacity onPress={() => router.replace('/login')}>
                <Text className="text-zinc-500 dark:text-zinc-400 mt-2">
                    Повернутися до входу
                </Text>
            </TouchableOpacity>
        </View>
    );
}