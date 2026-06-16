import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform, Pressable
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HubConnectionBuilder, HubConnection, LogLevel } from "@microsoft/signalr";
import {Ionicons} from "@expo/vector-icons";
import {router} from "expo-router";
import {useColorScheme} from "@/hooks/use-color-scheme";
import {ThemeIconButton} from "@/components/ThemeIconButton";

const HUB_URL ='https://p32-native.itstep.click/chat';

interface Message {
    id: string;
    text: string;
    timestamp: string;
}

export default function Chat() {
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState<string>("");
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const styles = getStyles(isDark); // ← стилі тепер залежать від теми

    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl(HUB_URL)
            .configureLogging(LogLevel.Information)
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);

        newConnection.start()
            .then(() => {
                setIsConnected(true);
                setIsLoading(false);

                newConnection.on("Send", (messageText: string) => {
                    const newMsg: Message = {
                        id: Math.random().toString(),
                        text: messageText,
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    };
                    setMessages((prevMessages) => [...prevMessages, newMsg]);
                });
            })
            .catch((error) => {
                console.error("SignalR Connection Error: ", error);
                setIsLoading(false);
            });

        return () => {
            if (newConnection) {
                newConnection.off("Send");
                newConnection.stop();
            }
        };
    }, []);

    const handleSendMessage = async () => {
        if (!inputText.trim() || !connection || !isConnected) return;

        try {
            await connection.invoke("Send", inputText);
            setInputText("");
        } catch (error) {
            console.error("Failed to send message: ", error);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={isDark ? "#3b82f6" : "#0066cc"} />
                <Text style={styles.loadingText}>Connecting to chat live stream...</Text>
            </View>
        );
    }

    const handleBack = async () => {
        router.replace("/");
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <View style={styles.header}>
                    <View>
                        <Pressable onPress={handleBack}>
                            <Ionicons
                                name="log-out-outline"
                                size={22}
                                color={isDark ? "#ffffff" : "#1f2937"}
                            />
                        </Pressable>
                    </View>
                    <View>
                        <Text style={styles.headerTitle}>Live Chat</Text>
                        <View style={styles.statusIndicator}>
                            <View style={[styles.statusDot, { backgroundColor: isConnected ? "#4cd964" : "#ff3b30" }]} />
                            <Text style={styles.statusText}>{isConnected ? "Connected" : "Disconnected"}</Text>
                        </View>
                    </View>
                    <View>
                        <ThemeIconButton size={22} />
                    </View>
                </View>

                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.messagesList}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    renderItem={({ item }) => (
                        <View style={styles.messageContainer}>
                            <Text style={styles.messageText}>{item.text}</Text>
                            <Text style={styles.timestamp}>{item.timestamp}</Text>
                        </View>
                    )}
                />

                <SafeAreaView edges={['bottom']} style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type your message..."
                        placeholderTextColor={isDark ? "#71717a" : "#999"}
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, { opacity: inputText.trim() ? 1 : 0.6 }]}
                        onPress={handleSendMessage}
                        disabled={!inputText.trim()}
                    >
                        <Text style={styles.sendButtonText}>Send</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

// ← Стилі тепер генеруються функцією залежно від теми
const getStyles = (isDark: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: isDark ? '#09090b' : '#f5f5f5',
    },
    header: {
        paddingTop: 16,
        paddingHorizontal: 16,
        paddingBottom: 12,
        backgroundColor: isDark ? '#18181b' : '#fff',
        borderBottomWidth: 1,
        borderBottomColor: isDark ? '#27272a' : '#e0e0e0',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: isDark ? '#f4f4f5' : '#333',
        marginBottom: 8,
    },
    statusIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 6,
    },
    statusText: {
        fontSize: 14,
        color: isDark ? '#a1a1aa' : '#666',
    },
    messagesList: {
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    messageContainer: {
        backgroundColor: isDark ? '#18181b' : '#fff',
        borderRadius: 12,
        padding: 12,
        marginVertical: 4,
        maxWidth: '85%',
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: isDark ? '#27272a' : '#e0e0e0',
    },
    messageText: {
        fontSize: 16,
        color: isDark ? '#f4f4f5' : '#333',
        lineHeight: 22,
    },
    timestamp: {
        fontSize: 12,
        color: isDark ? '#71717a' : '#999',
        marginTop: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingVertical: 12,
        backgroundColor: isDark ? '#18181b' : '#fff',
        borderTopWidth: 1,
        borderTopColor: isDark ? '#27272a' : '#e0e0e0',
        alignItems: 'flex-end',
    },
    input: {
        flex: 1,
        backgroundColor: isDark ? '#27272a' : '#f5f5f5',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginRight: 8,
        fontSize: 16,
        color: isDark ? '#f4f4f5' : '#333',
        maxHeight: 100,
    },
    sendButton: {
        backgroundColor: isDark ? '#3b82f6' : '#0066cc',
        borderRadius: 24,
        paddingHorizontal: 20,
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: isDark ? '#09090b' : '#fff',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: isDark ? '#a1a1aa' : '#666',
    },
});