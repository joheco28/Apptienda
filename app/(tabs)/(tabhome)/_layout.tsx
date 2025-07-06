import { Stack } from "expo-router";

export default function homeLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#25292e",
        },
        headerTintColor: "#fff",
        headerTitleAlign: "center",
        headerShadowVisible: false,
        }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ResumenVentas"
        options={{
          title: "Resumen de ventas",
        }}
      />
    </Stack>
  );
}