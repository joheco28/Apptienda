import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"
import ProductListScreen from "../../../screens/product-list-screen"




export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <ProductListScreen />
    </SafeAreaProvider>
  )
}
