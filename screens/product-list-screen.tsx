"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import ProductCard from "../components/productCard";
import {useCart} from "@/contexto/carritoContext";

import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { producto, categoria } from "@/database/schemas/tiendaSchema";
import { useFocusEffect } from "expo-router";
import { eq } from "drizzle-orm";

export default function ProductListScreen() {
  type products = {
    id: number;
    name: string;
    price: number;
    image: string | null;
    category: string | null;
  };

  const { state, addItem } = useCart();
  const [products, setProducts] = useState<products[]>([]);

  // cargando base de datos
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema: { producto } });

  // cargado productos
  const loadProductos = async () => {
    try {
      const productos = await drizzleDb
        .select({
          id: producto.idProducto,
          name: producto.nombre,
          price: producto.price,
          image: producto.image,
          category: categoria.nombre,
        })
        .from(producto)
        .leftJoin(categoria, eq(categoria.idCategoria, producto.idCategoria));
      setProducts(productos);
    } catch (error) {
      
      Alert.alert("Error", "al cargar los clientes");
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProductos();
    }, [])
  );

  // State to manage products and filtering

  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Extract unique categories from products
  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  // Filter products when category changes
  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter(
          (product) => String(product.category) === selectedCategory
        )
      );
    }
  }, [selectedCategory, products]);

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
    
    addItem({id: product.id, producto: product.name, cantidad: 1, precio: product.price});
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategory,
            ]}
            onPress={() => handleCategoryPress(String(category))}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.selectedCategoryText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Products List */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        renderItem={({ item }) => (
          <ProductCard
            product={{
              ...item,
              id: String(item.id),
              category: String(item.category),
            }}
            onAddToCart={() =>
              handleAddToCart({
                ...item,
                id: String(item.id),
                category: String(item.category),
              })
            }
          />
        )}
        contentContainerStyle={styles.productList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#b2babb",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    marginTop: 8,
  },
  categoriesContainer: {
    marginBottom: 0,
    width: "100%",
    height: 120,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "#e9ecef",
    fontSize: 14,
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
});
