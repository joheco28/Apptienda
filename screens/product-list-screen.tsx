"use client"

import { useState, useEffect } from "react"
import { Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from "react-native"
import ProductCard from "../components/productCard"

// Mock data - in a real app, this would come from an API
const PRODUCTS = [
  {
    id: "1",
    name: "Wireless Headphones",
    price: 99.99,
    image: null, // Will use default image
    category: "Electronics",
  },
  {
    id: "2",
    name: "Running Shoes",
    price: 79.99,
    image: "https://via.placeholder.com/150",
    category: "Sports",
  },
  {
    id: "3",
    name: "Coffee Maker",
    price: 49.99,
    image: "https://via.placeholder.com/150",
    category: "Home",
  },
  {
    id: "4",
    name: "Smartphone",
    price: 699.99,
    image: "https://via.placeholder.com/150",
    category: "Electronics",
  },
  {
    id: "5",
    name: "Yoga Mat",
    price: 29.99,
    image: null,
    category: "Sports",
  },
  {
    id: "6",
    name: "Blender",
    price: 39.99,
    image: "https://via.placeholder.com/150",
    category: "Home",
  },
]

export default function ProductListScreen() {
  const [products, setProducts] = useState(PRODUCTS)
  const [filteredProducts, setFilteredProducts] = useState(PRODUCTS)
  const [selectedCategory, setSelectedCategory] = useState("All")

  // Extract unique categories from products
  const categories = ["All", ...new Set(PRODUCTS.map((product) => product.category))]

  // Filter products when category changes
  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredProducts(products)
    } else {
      setFilteredProducts(products.filter((product) => product.category === selectedCategory))
    }
  }, [selectedCategory, products])

interface CategoryPressHandler {
    (category: string): void;
}

const handleCategoryPress: CategoryPressHandler = (category) => {
    setSelectedCategory(category);
};

interface Product {
    id: string;
    name: string;
    price: number;
    image: string | null;
    category: string;
}

interface HandleAddToCart {
    (product: Product): void;
}

const handleAddToCart: HandleAddToCart = (product) => {
    console.log("Added to cart:", product.name);
    // In a real app, this would dispatch to a cart state manager
};

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Products</Text>

      {/* Category Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[styles.categoryButton, selectedCategory === category && styles.selectedCategory]}
            onPress={() => handleCategoryPress(category)}
          >
            <Text style={[styles.categoryText, selectedCategory === category && styles.selectedCategoryText]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Products List */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => <ProductCard product={item} onAddToCart={() => handleAddToCart(item)} />}
        contentContainerStyle={styles.productList}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    marginTop: 8,
  },
  categoriesContainer: {
    paddingVertical: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "#e9ecef",
  },
  selectedCategory: {
    backgroundColor: "#007bff",
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
  },
  selectedCategoryText: {
    color: "white",
  },
  productList: {
    paddingTop: 8,
  },
})
