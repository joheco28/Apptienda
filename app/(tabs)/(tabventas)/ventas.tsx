import { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import TablaCarrito from "@/components/TablaCarrito";
import AccionDialogo from "@/components/AccionDialogo";
import { PaperProvider } from "react-native-paper";

const data = [
  { id: 1, articulo: "Producto 1", precio: 10.0, cantidad: 2 },
  { id: 2, articulo: "Producto 2", precio: 20.0, cantidad: 1 },
  { id: 3, articulo: "Producto 3", precio: 15.0, cantidad: 3 },
  { id: 4, articulo: "Producto 4", precio: 5.0, cantidad: 5 },
  { id: 5, articulo: "Producto 5", precio: 30.0, cantidad: 1 },
];

const sum = data.reduce(
  (total, item) => total + item.precio * item.cantidad,
  0
);

const eliminarItem = (id: number) => {
  console.log(`Eliminar item con ID: ${id}`);
  // Aquí puedes agregar la lógica para eliminar el item del carrito
};

const RegistraVenta = () => {
  console.log("Registrar venta");
};

const CrearFactura = () => {
  // Aquí puedes agregar la lógica para crear la factura
  console.log("Crear factura");
};

//inicio de componente

export default function VentasScreen() {
  const [dialogVisible, setDialogVisible] = useState(false)
  const [optboton, setOptboton] = useState(1)


  const showDialog = () => setDialogVisible(true)
  const hideDialog = () => setDialogVisible(false)

  const RegistraVenta = () => {
    console.log("Registrar venta");
  };

  const CrearFactura = () => {
    console.log("Crear factura");
  };

  const handleConfirm = () => {
    if (optboton === 1) {
      RegistraVenta()
    } else {
      CrearFactura()
    }

  }

  const handleCancel = () => {
    console.log("Cancelado")
    // Aquí puedes agregar la lógica que se ejecutará al cancelar
  }


  

  return (
    <>
      <PaperProvider>
        
        <View style={styles.container}>
          <TablaCarrito data={data} sum={sum} onEliminar={eliminarItem} />
        </View>
        <View style={styles.conteinerPie}>
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
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          onDismiss={hideDialog}
        />
        </View>
      </PaperProvider>
    </>
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
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#25292e",
    alignItems: "center",
    marginTop: 10,
    height: 100,
    width: "100%",
  },
  text: {
    color: "#fff",
  },

  textBoton: {
    color: "#fff",
    fontSize: 20,
  },

  Boton: {
    backgroundColor: "#1565c0",
    borderRadius: 5,
    padding: 10,
    margin: 10,
    width: "45%",
    alignItems: "center",
  },
});
