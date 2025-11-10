import { ImageBackground, Image, Text, TouchableOpacity, View } from 'react-native';
import React, {useEffect, useState} from 'react';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { clearTokens } from "@/src/Services/authStorage";
import {fetchWithAuth} from "@/src/Services/fetchWithAuth";
import DropDownPicker from "react-native-dropdown-picker";


export async function fetchAvailableCars(){
    const response = await fetchWithAuth("http://192.168.1.131:8000/api/cars/available/");
    if(!response.ok){
        throw new Error("Cannot load available cars");
    }
    return await response.json();
}


export async function startShift(carId: number) {
    const response = await fetchWithAuth(
        `http://192.168.1.131:8000/api/shifts/start/${carId}/`,
        {
            method: "POST",
        }
    );

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Eroare la pornirea shift-ului");
    }

    return await response.json();
}




interface Car {
    id: number;
    registration_number: string;
    active: boolean;
}


export default function Settings() {
    const [cars, setCars] = useState<Car[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedCar, setSelectedCar] = useState<number | null>(null);
    const [items, setItems] = useState<{label: string; value: number}[]>([]);


    useEffect(() => {
        const load = async () => {
            try {
                const list = await fetchAvailableCars();
                setCars(list);

                setItems(
                    list.map((car: Car) => ({
                        label: car.registration_number,
                        value: car.id,
                    }))
                );
            } catch (error) {
                console.error("Eroare la masini", error);
            }
        };
        load();
    }, []);


    const handleStartShift = async () => {
        if (!selectedCar) {
            alert("Selectează o mașină mai întâi!");
            return;
        }

        try {
            const result = await startShift(selectedCar);
            alert(result.detail || "Shift pornit!");
        } catch (err: any) {
            alert(err.message);
        }
    };




    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1">

                {/* Background full-screen */}
                    <View className="flex-1 px-6">

                        {/* LOGO la centru */}
                        <View className="items-center mt-16 mb-16">
                            <Image
                                source={require("../../images/logo10.png")} // pune logo-ul firmei tale
                                className="w-32 h-32"
                                resizeMode="contain"
                            />
                        </View>


                        {/* SELECT CAR */}
                        <View className="w-10/12 self-center mb-10 z-50">
                            <DropDownPicker
                                open={open}
                                value={selectedCar}
                                items={items}
                                setOpen={setOpen}
                                setValue={setSelectedCar}
                                setItems={setItems}
                                placeholder="Alege mașina"
                                style={{
                                    backgroundColor: "white",
                                    borderRadius: 12,
                                    borderColor: "#ccc",
                                    height: 55,
                                }}
                                dropDownContainerStyle={{
                                    borderRadius: 12,
                                    borderColor: "#ccc",
                                }}
                            />
                        </View>

                        <View className="flex-col mt-10">
                        <TouchableOpacity
                            onPress={handleStartShift}
                            className="bg-green-600 py-3 rounded-xl mt-4"
                        >
                            <Text className="text-center text-white text-xl">Start Shift</Text>
                        </TouchableOpacity>
                        </View>



                        {/* Card SETARI */}
                        <View className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-lg mt-20">
                            <Text className="text-2xl font-bold text-gray-800 mb-6">
                                Settings
                            </Text>

                            {/* Buton Logout */}
                            <TouchableOpacity
                                onPress={clearTokens}
                                className="bg-red-500 py-3 rounded-xl active:bg-red-600"
                            >
                                <Text className="text-center text-white text-xl font-semibold">
                                    Log out
                                </Text>
                            </TouchableOpacity>
                        </View>
                        </View>

            </SafeAreaView>
        </SafeAreaProvider>
    );
}
