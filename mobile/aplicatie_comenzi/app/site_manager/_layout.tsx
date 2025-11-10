import {Stack, Tabs} from "expo-router";

export default function siteManagerLayout() {
  return <Tabs screenOptions={{headerShown: false}}>
    <Tabs.Screen name="home_site_manager" options={{title:"Home"}}/>
    <Tabs.Screen name="settings" options={{title:"Setari"}}/>
  </Tabs>
}
