import ProductTable from "@/components/ProductTable";
import { Link } from "expo-router";
import { Text, View, StyleSheet, Alert } from "react-native";
import { Button } from "react-native-paper";
import { useCallback, useState } from "react";

import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { eq } from "drizzle-orm";
import { producto, categoria } from "@/database/schemas/tiendaSchema";
import { useFocusEffect } from "expo-router";




export default function ArticuloLayout() {
  // cargando base de datos
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema: { producto } });

  interface products {
    idProducto: number;
    codigo: string;
    nombre: string;
    imagen: string;
    descripcion: string;
    precio: number;
    cantidad: number;
    idcategoria: number;
  }


  const [products, setProducts] = useState<products[]>([]);

  // cargado productos
  const loadProductos = async () => {
    try {
      const productos = await drizzleDb
        .select({
          idProducto: producto.idProducto,
          codigo: producto.codigo,
          nombre: producto.nombre,
          imagen: producto.image,
          descripcion: producto.descripcion,
          precio: producto.price,
          cantidad: producto.cantidad,
          idcategoria: producto.idCategoria,
        })
        .from(producto);

      // Map descripcion nulls to empty string
      const productosFixed = productos.map((p) => ({
        ...p,
        descripcion: p.descripcion === null ? "" : p.descripcion,
      }));

      setProducts(productosFixed as products[]);
    } catch (error) {
      
      Alert.alert("Error", "No se pudieron cargar los clientes");
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProductos();
    }, [])
  );

  const actualizaProducto = async(data: products) => {
    // Actualiza el producto en la lista
    await drizzleDb
      .update(producto)
      .set({
        price: data.precio,
        cantidad: data.cantidad,})
      .where(eq(producto.idProducto, data.idProducto));
  };


  return (
    <View style={styles.container}>
      <ProductTable initialProducts={products} onProductChange={actualizaProducto} />
      <Link href="/(tabs)/(tabinventario)/FormInvetarios" asChild>
        <Button style={styles.button}>
          <Text style={styles.buttonText}>Registrar Articulo Nuevo</Text>
        </Button>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  text: {
    fontSize: 20,
    color: "#333",
  },
  button: {
    backgroundColor: "#6200ee",
    color: "white",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
