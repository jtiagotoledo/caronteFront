import "../../global.css";
import { useEffect } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{title:'Início'}}/>
        <Stack.Screen name="add" options={{title:'Add posição'}}/>
      </Stack>
  );
}