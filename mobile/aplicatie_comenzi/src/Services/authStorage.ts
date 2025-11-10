import * as SecureStore from "expo-secure-store";
import {router} from "expo-router";

export async function saveTokens(access: string, refresh: string) {
    await SecureStore.setItemAsync("access_token", access);
    await SecureStore.setItemAsync("refresh_token", refresh);
}

export async function getAccessToken() {
    return SecureStore.getItemAsync("access_token");
}

export async function getRefreshToken() {
    return SecureStore.getItemAsync("refresh_token");
}

export async function clearTokens() {
    await SecureStore.deleteItemAsync("access_token");
    await SecureStore.deleteItemAsync("refresh_token");
    router.replace("/");
}
