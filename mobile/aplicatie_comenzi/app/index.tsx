import {Text, View, TextInput, TouchableOpacity} from "react-native";
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import {useState} from "react";
import {router, useRouter} from "expo-router";
import { jwtDecode } from "jwt-decode";
import {saveTokens} from "@/src/Services/authStorage";




interface LoginRequest {
    phone_number: string;
    password: string;
}

interface LoginResponse {
    refresh: string;
    access: string;
}


export async function login( data: LoginRequest ): Promise<LoginResponse> {
        const response = await fetch("http://192.168.1.131:8000/api/token/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error("Error occured");
        }

        const result: LoginResponse = await response.json();
        return result;
}



export default function Index() {
    const[username, setUsername] = useState("");
    const[password, setPassword] = useState("");
    const[token, setToken] = useState("");
    const[refresh_token, setRefreshToken] = useState("");


    const router = useRouter();
    const handleLogin = async () => {
        try{
            const result = await login({phone_number : username, password});


            await saveTokens(result.access,result.refresh);

            const payload : any = jwtDecode(result.access);

            if(payload.role == "DRIVER"){
                router.replace("/driver/home_driver");
            }else if(payload.role == "SITE_MANAGER"){
                router.replace("/site_manager/home_site_manager");
            }




        } catch (error) {
            setToken("");
            setRefreshToken("");
            console.log("Login gresit");
        }
    }





  return (
      <SafeAreaProvider>
    <SafeAreaView>
        <View className="flex-col items-center gap-10">
            <Text className="text-3xl font-bold text-green-700 mt-5">
                Introduceti numarul de telefon
            </Text>
            <TextInput placeholder="Nr telefon" className="bg-gray-400 text-3xl w-7/12" value={username} onChangeText={setUsername} >

            </TextInput>
            <Text className="text-3xl font-bold text-green-700 mt-5">
                Introduceti parola:
            </Text>

            <TextInput placeholder="Parola" className="bg-gray-400 text-3xl w-7/12" secureTextEntry={true} value={password} onChangeText={setPassword} >

            </TextInput>

            <TouchableOpacity onPress={handleLogin}>
                <Text>
                    Login
                </Text>
            </TouchableOpacity>

        </View>
    </SafeAreaView>
</SafeAreaProvider>
  );
}
