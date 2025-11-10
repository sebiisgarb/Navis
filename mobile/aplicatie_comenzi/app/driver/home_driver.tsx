import {StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react'
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";

export default function homeDriver() {
    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <Text>
                    Ai ajuns in home page driver!
                </Text>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}