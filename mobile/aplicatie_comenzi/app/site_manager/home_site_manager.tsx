import {StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react'
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";

export default function homeSiteManager() {
    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <Text>
                    Ai ajuns in home page site-manager!
                </Text>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}