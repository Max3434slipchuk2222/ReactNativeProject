import { useAppDispatch } from "@/hooks/redux";
import { logout } from "@/store/reducers/AuthSlice";
import { authService } from "@/service/AuthService";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

export function useLogout() {
    const dispatch = useAppDispatch();
    return async () => {
        await SecureStore.deleteItemAsync("accessToken");
        dispatch(logout());
        dispatch(authService.util.resetApiState());
        router.replace("/login");
    };
}