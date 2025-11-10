import { getAccessToken } from "./authStorage";
import { refreshAccessToken } from "./refreshAccessToken";
import {router} from "expo-router";

export async function fetchWithAuth(url: string, options: any = {}) {
    let access = await getAccessToken();

    // 1. Încerci request-ul normal
    let response = await fetch(url, {
        ...options,
        headers: {
            ...(options.headers || {}),
            "Authorization": `Bearer ${access}`,
            "Content-Type": "application/json",
        },
    });

    // 2. Dacă token-ul e expirat -> Django răspunde 401 UNAUTHORIZED
    if (response.status === 401) {
        const newAccess = await refreshAccessToken();

        // 3. Dacă refresh token-ul este invalid → user trebuie delogat
        if (!newAccess) {
            router.replace("/");
            return response;
        }

        // 4. Dacă avem un token nou, retrimitem request-ul cu el
        response = await fetch(url, {
            ...options,
            headers: {
                ...(options.headers || {}),
                "Authorization": `Bearer ${newAccess}`,
                "Content-Type": "application/json",
            },
        });
    }

    return response;
}
