import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import React from 'react'
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {clearTokens} from "@/src/Services/authStorage";

export default function settings() {
    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <View className="flex-col items-start gap-10 ">
                <TouchableOpacity onPress={clearTokens} className="mt-10">
                    <Text> Log out!</Text>
                </TouchableOpacity>

                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}