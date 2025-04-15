import { Tabs } from 'expo-router';

import Ionicons from '@expo/vector-icons/Ionicons';

export default function ventaslayout() {
    return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#fff',
          tabBarPosition: 'top',
          headerStyle: {
            backgroundColor: '#2c3e50',
          },
          headerShadowVisible: false,
          headerTintColor: '#fff',
          tabBarStyle: {
            backgroundColor: '#25292e',
          },
          animation:'fade',
        }}
      >
        <Tabs.Screen
          name="listProductos" 
            options={{
                title: 'Lista de productos',
                tabBarIcon: ({ color, focused }) => (
                <Ionicons name={focused ? 'list-sharp' : 'list-outline'} color={color} size={24} />
                ),
            }}
        />
        <Tabs.Screen
          name="ventas" 
            options={{
                title: 'Carrito de ventas',
                tabBarIcon: ({ color, focused }) => (
                <Ionicons name={focused ? 'cart-sharp' : 'cart-outline'} color={color} size={24} />
                ),
            }}
        />


      </Tabs>
    );
  }