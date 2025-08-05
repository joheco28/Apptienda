import { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import TablaCarrito from "@/components/TablaCarrito";
import AccionDialogo from "@/components/AccionDialogo";
import { PaperProvider } from "react-native-paper";
import { useCart } from "@/contexto/carritoContext";

import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { venta, detalleVenta, cliente } from "@/database/schemas/tiendaSchema";



//inicio de componente

export default function VentasScreen() {
  const [dialogVisible, setDialogVisible] = useState(false)
  const [optboton, setOptboton] = useState(1)
  const showDialog = () => setDialogVisible(true)
  const hideDialog = () => setDialogVisible(false)

   // cargando base de datos
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema: { venta, detalleVenta } });

  type clientes = {
    idcategoria: string;
    nombrecategoria: string;
  } 

  const [listClientes, setListClientes] = useState<clientes[]>([]);

  const { state, removeItem, clearCart,updateQuantity } = useCart();
  const data = state.items.map((item) => ({
    id: item.id,
    articulo: item.producto,
    precio: item.precio,
    cantidad: item.cantidad,
    subtotal: item.subtotal, 
  }));  

  const sum = state.total; // Asegúrate de que el total esté calculado en tu contexto

const buscarclientes = async () => {
    try {
      const lclientes = await drizzleDb.select().from(cliente);
      setListClientes(
        lclientes.map((cat: any) => ({
          idcategoria: String(cat.idCliente),
          nombrecategoria: cat.nombre,
        }))
      );
    } catch (error) {
      
      Alert.alert("Error", "No se pudieron cargar los clientes.");
    }
  };

const eliminarItem = (id: string) => {

  Alert.alert("Confirmar eliminación", "¿Estás seguro de que deseas eliminar este item?", [
    {
      text: "Cancelar",
      style: "cancel",
    },
    {
      text: "Eliminar",
      style: "destructive",
      onPress: () => {
        removeItem(id);
      },
    },
  ]);

};

const insertarventa = async(Cliente:number, Vendedor:number) => {

   try {
    // 1. Insertar en la tabla 'venta' y obtener el ID de la nueva venta.
    const newVentas = await drizzleDb.insert(venta).values({
      fecha: new Date().toISOString(),
      total: sum,
      idCliente: Cliente, 
      idVendedor: 1, 
    }).returning({ idVenta: venta.idVenta });

    if (!newVentas || newVentas.length === 0) {
      
      Alert.alert("Error", "No se pudo registrar la venta y obtener el ID.");
      // Aquí podrías mostrar una alerta al usuario.
      return;
    }

    const ventaId = newVentas[0].idVenta;


    // 2. Insertar cada item del carrito en la tabla 'detalleVenta'.
  
    await Promise.all(data.map(item => {
      
      const productId = typeof item.id === 'string' ? parseInt(item.id, 10) : item.id;

      return drizzleDb.insert(detalleVenta).values({
        idVenta: ventaId, 
        idProducto: productId,
        cantidad: item.cantidad,
        precioUnitario: item.precio,
        subtotal: item.subtotal,
      });
    }));

    clearCart(); // Limpiar el carrito después de registrar la venta.
  } catch (error) {
    
    Alert.alert("Error", "No se pudo registrar la venta. {error}");
    // Aquí podrías mostrar una alerta de error al usuario.
  }
} 

const RegistraVenta = (idc: number) => {

  insertarventa(idc, 1) 
};

const CrearFactura = (clienteId?: string) => {
  
  if (!clienteId) {
    
    Alert.alert("Error", "No se seleccionó un cliente para la factura.");
    return;
  }
    insertarventa(Number(clienteId), 1) 
    // console.log("Creando factura para el cliente con ID:", clienteId);
    Alert.alert("Factura creada", `Factura creada para el cliente con ID: ${clienteId}`);
};


  const handleConfirm = (clienteId?: string) => {
    if (optboton === 1) {
      
      RegistraVenta(Number(clienteId))
    } else {
      
      CrearFactura(clienteId)
    }

  }


  const handleCancel = () => {
    console.log("Cancelado")
    // Aquí puedes agregar la lógica que se ejecutará al cancelar
  }

  return (
  
      <PaperProvider>
        <View style={styles.container}>
          { data.length === 0 ? (
            <Text style={styles.text}>No hay productos en el carrito</Text>
          ) : (
            <TablaCarrito data={data} sum={sum} onEliminar={eliminarItem} />
          )}
        </View>
          {data.length != 0 ? (

        <View style={styles.conteinerPie}>
          <TouchableOpacity
            style={styles.Boton}
            onPress={() => {
              clearCart();
            } }
          >
            <Text style={styles.textBoton}>Limpiar Carrito</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.Boton}
            onPress={() => {
              setOptboton(1);
              showDialog();
            } }
          >
            <Text style={styles.textBoton}>Registra Venta</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.Boton}
            onPress={() => {
              buscarclientes();
              setOptboton(2);
              showDialog();
            } }
          >
            <Text style={styles.textBoton}>Crear Factura</Text>
          </TouchableOpacity> 

          <AccionDialogo
          visible={dialogVisible}
          title= {optboton === 1 ? "Registrar Venta" : "Crear Factura"}
          content="¿Estás seguro de que deseas realizar esta acción?"
          confirmText="Confirmar"
          cancelText="Cancelar"
          listclientes={optboton=== 1 ? [] : [...listClientes]}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          onDismiss={hideDialog}
        />
        </View>
          ) : null}

      </PaperProvider>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
  },
  conteinerPie: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 2,
    backgroundColor: "#25292e",
    marginTop: 0,
    height: 70,
    width: "100%",
  },
  text: {
    color: "#fff",
  },

  textBoton: {
    color: "#fff",
    fontSize: 15,
  },

  Boton: {
    backgroundColor: "#1565c0",
    borderRadius: 5,
    padding: 10,
    margin: 10,
    alignItems: "center",
  },
});
