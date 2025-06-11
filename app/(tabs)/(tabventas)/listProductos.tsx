import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"
import ProductListScreen from "../../../screens/product-list-screen"




export default function listProductos() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <ProductListScreen />
    </SafeAreaProvider>
  )
}
