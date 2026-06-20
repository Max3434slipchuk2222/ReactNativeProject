import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {Stack} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css';
import {useColorScheme} from '@/hooks/use-color-scheme';
import {Provider} from "react-redux";
import {store, useAppSelector} from "@/store";
import * as SecureStore from 'expo-secure-store';
import {loginSuccess} from "@/store/reducers/AuthSlice";
import {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {setThemeMode} from "@/store/reducers/ThemeSlice";
import { useColorScheme as useNativeWindScheme } from 'nativewind';
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";

function AppContent() {
    const themeMode = useAppSelector(s => s.themeReducer.mode);
    const systemScheme = useColorScheme();
    const { setColorScheme } = useNativeWindScheme();
    const resolved: "light" | "dark" =
        themeMode === 'system'
            ? (systemScheme === 'dark' ? 'dark' : 'light')
            : themeMode;

    useEffect(() => {
        setColorScheme(resolved);
    }, [resolved]);
    return (

        <ThemeProvider value={resolved === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
                <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                <Stack.Screen name="(auth)" options={{headerShown: false}}/>
                <Stack.Screen name="mychat" options={{ headerShown: false }} />
                <Stack.Screen name="chat" options={{ headerShown: false }} />
                <Stack.Screen name="profile" options={{ headerShown: true, title: "Профіль" }} />
                <Stack.Screen name="modal" options={{presentation: 'modal', title: 'Modal'}}/>
                <Stack.Screen name="logger" options={{headerShown: false}}/>
            </Stack>
            <StatusBar style={resolved === 'dark' ? 'light' : 'dark'}/>
        </ThemeProvider>
    );
}
export default function RootLayout() {

    //token
    //await SecureStore.getItemAsync('accessToken');
    const [storageReady, setStorageReady] = useState(false);

    useEffect(() => {
        initStore().then(() => {
            setStorageReady(true)
        });
    }, []);

    async function initStore(): Promise<void> {
        const accessToken  = await SecureStore.getItemAsync('accessToken');
        // console.log("User info", accessToken);
        if (accessToken) {
            store.dispatch(loginSuccess(accessToken));
            // console.log("User info", accessToken);
        }
        const savedTheme = await AsyncStorage.getItem('app_theme');
        if (savedTheme === 'light' || savedTheme === 'dark') {
            store.dispatch(setThemeMode(savedTheme));
        }
    }

    if (!storageReady) {
        return null;
    }

    return (
        <>
            <SafeAreaProvider>
                <Provider store={store}>
                    <AppContent />
                </Provider>
            </SafeAreaProvider>
        </>

    );
}