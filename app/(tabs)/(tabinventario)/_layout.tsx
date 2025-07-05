import { Stack } from "expo-router";

export default function inventariosLayout() {
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
        name="articulo"
        options={{
          title: "Home",
         // headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="FormInventarios"
        options={{
          title: "Registro Nuevo Articulo",
         // headerTitleAlign: "center",
        }}
      />
    </Stack>
  );
}