import {getRefreshToken,saveTokens} from "@/src/Services/authStorage";


export async function refreshAccessToken() {
    const refresh = await getRefreshToken();
    if (!refresh) {
        return null;
    }

    const response = await fetch("http://192.168.1.131:8000/api/token/refresh/",{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({refresh}),
    });

    if (!response.ok) {
        return null;
    }

    const data = await response.json();
    await saveTokens(data.access,refresh);
    return data.access;
}