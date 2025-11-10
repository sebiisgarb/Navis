import { Stack } from "expo-router";
import {Tabs} from "expo-router";

export default function driverLayout() {
  return <Tabs screenOptions={{headerShown: false}}>
    <Tabs.Screen name="home_driver" options={{title:"Home"}}/>
    <Tabs.Screen name="settings" options={{title:"Setari"}}/>
  </Tabs>


}
