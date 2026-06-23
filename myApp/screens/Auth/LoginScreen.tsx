import {View, Text, TextInput, Pressable, useColorScheme, TouchableOpacity} from "react-native";
import { useForm, Controller } from "react-hook-form";
import {useRouter} from "expo-router";
import {loginSuccess} from "@/store/reducers/AuthSlice";
import {useAppDispatch} from "@/hooks/redux";
import {useState} from "react";
import ILoginModel from "@/models/ILoginModel";
import * as SecureStore from 'expo-secure-store';
import {useLoginMutation} from "@/service/AuthService";


export default function LoginScreen() {
    const { control, handleSubmit } = useForm<ILoginModel>();
    const [login, { isLoading }] = useLoginMutation();
    const [serverError, setServerError] = useState<string | null>(null);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const onSubmit = async (data: ILoginModel) => {
        console.log("Form data:", data);
        try {
            const result = await login(data).unwrap();

            if (result.token) {
                console.log(result.token);
                // 2. Hydrate your global Redux state
                dispatch(loginSuccess(result.token));
                //Потрібно зберегти глобально інформацію про користувача
                await SecureStore.setItemAsync('accessToken',  result.token);
                router.push("/explore");
            }
        }
        catch (err: any) {
            console.error("Помилка авторизації:", err);

            // 1. Check if the backend returned a validation/error message payload
            if (err?.data?.message) {
                setServerError(err.data.message);
            }
            // 2. Check if it's a top-level RTK Query network fetch error
            else if (err?.status === 'FETCH_ERROR') {
                setServerError("Немає зв'язку з сервером. Перевірте інтернет.");
            }
            // 3. Fallback for any other unexpected status codes
            else {
                setServerError("Щось пішло не так. Спробуйте пізніше.");
            }
        }

    };

    // const onHandleToLogger = () => {
    //     router.push("/logger");
    // }

    return (
        <View className="flex-1 justify-center bg-zinc-50 dark:bg-zinc-950 items-center px-6">
            <Text className="text-3xl font-bold text-blue-600 mb-8">
                Увійти в акаунт
            </Text>

            {serverError && (
                <View className="w-full max-w-md bg-red-100 border border-red-400 p-3 rounded-lg mb-4">
                    <Text className="text-red-700 text-center text-sm font-medium">
                        {serverError}
                    </Text>
                </View>
            )}

            <Controller control={control}
                        name="email"
                        rules={{ required: "Email обов’язковий" }}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                placeholder="Email"
                                keyboardType="email-address"
                                keyboardAppearance={colorScheme === "dark" ? "dark" : "light"}
                                value={value}
                                onChangeText={onChange}
                                placeholderClassName={"text-gray-600"}
                                className="w-full max-w-md bg-white dark:bg-zinc-800 text-black dark:text-white rounded-lg px-4 py-3 mb-4 border border-gray-300 dark:border-zinc-700"
                            />
                        )}
            />

            <Controller control={control}
                        name="password"
                        rules={{ required: "Пароль обов’язковий" }}
                        render={({ field: { onChange, value } }) => (
                            <TextInput placeholder="Пароль"
                                       secureTextEntry
                                       value={value}
                                       keyboardAppearance={colorScheme === "dark" ? "dark" : "light"}
                                       onChangeText={onChange}
                                       className="w-full max-w-md bg-white dark:bg-zinc-800 text-black dark:text-white rounded-lg px-4 py-3 mb-4 border border-gray-300 dark:border-zinc-700"
                            />
                        )}
            />

            <Pressable onPress={handleSubmit(onSubmit)}
                       className="w-full max-w-md bg-blue-500 rounded-lg py-3 items-center"
            >
                <Text className="text-white font-semibold">Увійти</Text>
            </Pressable>
            <TouchableOpacity
                className="mb-6 mt-2"
                onPress={() => router.push('/forgot-password')}
            >
                <Text className="font-spartan-semibold text-[13px] text-[#093030] dark:text-[#DFF7E2]">
                    Forgot Password?
                </Text>
            </TouchableOpacity>
        </View>
    );
}