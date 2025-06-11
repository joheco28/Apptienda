import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

const COLORS = {
  headerBackground: '#2c3e50',
  tabBarBackground: '#25292e',
  activeTintColor: '#fff',
  inactiveTintColor: '#ccc', // Ejemplo, si quisieras un color diferente para inactivos
  headerTintColor: '#fff',
};

const ICON_SIZE = 24;

export default function VentasLayout() {
    return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: COLORS.activeTintColor,
          tabBarPosition: 'top',
          headerStyle: {
            backgroundColor: COLORS.headerBackground,
          },
          headerShadowVisible: false,
          headerTintColor: COLORS.headerTintColor,
          tabBarStyle: {
            backgroundColor: COLORS.tabBarBackground,
          },
          animation:'fade',
        }}
      >
        <Tabs.Screen
          name="listProductos" 
          options={{
                title: "Lista de productos",
                tabBarIcon: ({ color, focused }) => (
                <Ionicons name={focused ? 'list-sharp' : 'list-outline'} color={color} size={ICON_SIZE} />
                ),
            }}
        />
        <Tabs.Screen
          name="ventas" 
          options={{
                title: "Carrito de ventas",
                tabBarIcon: ({ color, focused }) => (
                <Ionicons name={focused ? 'cart-sharp' : 'cart-outline'} color={color} size={ICON_SIZE} />
                ),
            }}
        />
      </Tabs>
    );
  }