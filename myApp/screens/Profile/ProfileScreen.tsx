import {
    View,
    Text,
    TextInput,
    Pressable,
    StatusBar,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    useColorScheme
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import {useEffect, useState} from "react";
import { useMeQuery, useUpdateProfileMutation } from "@/service/AuthService";
import { ImagePickerButton } from "@/components/form/ImagePickerButton";
import { useForm } from "@/hooks/useForm";
import * as ImagePicker from "expo-image-picker";

export default function ProfileScreen() {
    const { data: me, isLoading: meLoading } = useMeQuery();
    const [updateProfile, { isLoading: saving }] = useUpdateProfileMutation();
    const colorScheme = useColorScheme();
    const { form, setForm, onChange } = useForm<{
        firstName: string;
        lastName: string;
        email: string;
        imageFile: { uri: string; name: string; type: string } | null;
    }>({
        firstName: me?.fullName?.split(" ")[0] ?? "",
        lastName: me?.fullName?.split(" ")[1] ?? "",
        email: me?.email ?? "",
        imageFile: null,
    });
    useEffect(() => {
        if (me) {
            setForm(prev => ({
                ...prev,
                firstName: me.fullName?.split(" ")[0] ?? "",
                lastName: me.fullName?.split(" ")[1] ?? "",
                email: me.email ?? "",
            }));
        }
    }, [me]);

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert("Доступ до галереї потрібен для вибору фото.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            const asset = result.assets[0];
            setForm(prev => ({
                ...prev,
                imageFile: { uri: asset.uri, name: "avatar.jpg", type: "image/jpeg" },
            }));
        }
    };

    const onSave = async () => {
        try {
            await updateProfile({
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                ...(form.imageFile ? { imageFile: form.imageFile } : {}),
            }).unwrap();
            router.back();
        } catch (e: any) {
            console.log("Update profile error:", JSON.stringify(e?.data, null, 2));
            alert("Помилка оновлення профілю");
        }
    };

    if (meLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-zinc-50 dark:bg-zinc-950">
                <Text className="text-zinc-400">Завантаження...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-zinc-50 dark:bg-zinc-950">
            <StatusBar barStyle="default" />
                <SafeAreaView edges={['bottom', 'left', 'right']} className="flex-1">
                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{ paddingBottom: 40 }}
                        className="px-6"
                    >
                        <View className="items-center my-8">
                            <ImagePickerButton
                                imageUri={form.imageFile?.uri ?? me?.image ?? null}
                                onPress={pickImage}
                            />
                            <Text className="text-zinc-400 dark:text-zinc-300 mt-2">
                                Натисніть, щоб змінити фото
                            </Text>
                        </View>

                        <TextInput
                            placeholder="Ім'я"
                            value={form.firstName}
                            onChangeText={onChange("firstName")}
                            keyboardAppearance={colorScheme === "dark" ? "dark" : "light"}
                            className="w-full bg-white dark:bg-zinc-800 text-black dark:text-white rounded-lg px-4 py-3 mb-4 border border-gray-300 dark:border-zinc-700"
                        />

                        <TextInput
                            placeholder="Прізвище"
                            value={form.lastName}
                            onChangeText={onChange("lastName")}
                            keyboardAppearance={colorScheme === "dark" ? "dark" : "light"}
                            className="w-full bg-white dark:bg-zinc-800 text-black dark:text-white rounded-lg px-4 py-3 mb-4 border border-gray-300 dark:border-zinc-700"
                        />
                        <TextInput
                            placeholder="Email"
                            keyboardType="email-address"
                            value={form.email}
                            onChangeText={onChange("email")}
                            keyboardAppearance={colorScheme === "dark" ? "dark" : "light"}
                            className="w-full bg-white dark:bg-zinc-800 text-black dark:text-white rounded-lg px-4 py-3 mb-6 border border-gray-300 dark:border-zinc-700"
                        />

                        <Text className="text-zinc-400 mb-6">{me?.email}</Text>

                        <Pressable
                            onPress={onSave}
                            disabled={saving}
                            className="bg-emerald-500 py-4 rounded-2xl items-center"
                        >
                            <Text className="text-white text-lg font-bold">
                                {saving ? "Збереження..." : "Зберегти"}
                            </Text>
                        </Pressable>
                    </ScrollView>
                </SafeAreaView>
        </View>
    );
}