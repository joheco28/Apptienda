import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from "react-native"


// Get screen width to make the cards responsive
const { width } = Dimensions.get("window")
const cardWidth = (width - 48) / 2 // 2 columns with padding



interface Product {
    id: string;
    name: string;
    price: number;
    image: string | null;
    category: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  // Format price to show 2 decimal places
  const formattedPrice = `$${product.price.toFixed(2)}`

  return (
    <View style={styles.card}>
      <Image
        source={
          product.image ? { uri: product.image } : require("../assets/images/producto1.jpg")
         
        }
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.cardContent}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.price}>{formattedPrice}</Text>

        <TouchableOpacity style={styles.button} onPress={onAddToCart}>
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 120,
    backgroundColor: "#f1f1f1",
  },
  cardContent: {
    padding: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    height: 40, // Fixed height for 2 lines
  },
  category: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#007bff",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 12,
  },
})
