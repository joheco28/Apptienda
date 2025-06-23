import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  Alert,
  Keyboard,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  CameraView,
  useCameraPermissions,
  BarcodeScanningResult,
  CameraType,
} from "expo-camera";
import * as ImagePicker from "expo-image-picker";

import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { producto } from "@/database/schemas/tiendaSchema";
import EditDialogo from "@/components/EditDialogo";
import { PaperProvider } from "react-native-paper";

export default function InventarioForm() {
  // Estados para la cámara y permisos
  const [facing, setFacing] = useState<CameraType>(ImagePicker.CameraType.back);
  const [scanned, setScanned] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  // cargando la base de datos
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema: { producto } });

  // Estados del formulario
  const [form, setForm] = useState({
    //id: '',
    codigo: "",
    nombre: "",
    imagen: null as string | null,
    description: "",
    category: "",
    price: "",
    cantidad: "",
  });


const [dialogVisible, setDialogVisible] = useState(false)
const showDialog = () => setDialogVisible(true)
const hideDialog = () => setDialogVisible(false)



  // Solicitar permisos al iniciar
  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permiso necesario",
          "Necesitamos acceso a la galería para seleccionar imágenes"
        );
      }
    })();
  }, []);

  // Manejar escaneo de código
  const handleBarCodeScanned = ({ data }: BarcodeScanningResult) => {
    setScanned(true);
    setShowScanner(false);
    setForm({ ...form, codigo: data });
    Alert.alert("Código escaneado", `Valor: ${data}`);
  };

  // Seleccionar imagen de galería
  const pickImage = async () => {
    Keyboard.dismiss();
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setForm({ ...form, imagen: result.assets[0].uri });
    }
  };

  // Tomar foto con cámara
  const takePhoto = async () => {
    Keyboard.dismiss();
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setForm({ ...form, imagen: result.assets[0].uri });
    }
  };

  // Manejar cambios en inputs
  const handleChange = (name: string, value: string) => {
    if (
      (name === "cantidad" || name === "valorUnitario") &&
      value !== "" &&
      isNaN(Number(value))
    ) {
      return;
    }
    setForm({ ...form, [name]: value });
  };

  // Enviar formulario
  const handleSubmit = async () => {
    if (!form.codigo || !form.nombre || !form.cantidad || !form.price) {
      Alert.alert("Error", "Por favor complete todos los campos obligatorios");
      return;
    }

    Alert.alert("Éxito", "Artículo guardado en el inventario");
    // Aquí puedes guardar los datos en la base de datos

    await drizzleDb
      .insert(producto)
      .values({
        codigo: form.codigo,
        nombre: form.nombre,
        image: form.imagen || "",
        descripcion: form.description,
        price: parseFloat(form.price),
        cantidad: parseInt(form.cantidad, 10),
        idCategoria: parseInt(form.category), // Asignar una categoría por defecto o manejarlo dinámicamente
      })
      .run();
    // Mostrar datos guardados en consola

    console.log("Datos guardados:", form);

    // Limpiar formulario
    setForm({
      // id: '',
      codigo: "",
      nombre: "",
      imagen: null,
      description: "",
      category: "",
      cantidad: "",
      price: "",
    });
  };

  // Verificar permisos de cámara
  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center", marginBottom: 20 }}>
          Necesitamos permiso para acceder a la cámara y escanear códigos de
          barras
        </Text>
        <Button title="Conceder permiso" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <>
    
    <PaperProvider>
      <EditDialogo visible={dialogVisible} onDismiss={hideDialog} />
    
    <View style={styles.container}>
      {showScanner ? (
        <View style={styles.scannerContainer}>
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing={facing}
            barcodeScannerSettings={{
              barcodeTypes: ["ean13", "ean8", "upc_a", "code128", "qr"],
            }}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          >
            <View style={styles.scannerOverlay}>
              <TouchableOpacity
                style={styles.flipButton}
                onPress={() =>
                  setFacing(
                    facing === ImagePicker.CameraType.back
                      ? ImagePicker.CameraType.front
                      : ImagePicker.CameraType.back
                  )
                }
              >
                <Text style={styles.flipText}>Voltear Cámara</Text>
              </TouchableOpacity>
              <View style={styles.scannerFrame} />
              <Button
                title="Cancelar"
                onPress={() => setShowScanner(false)}
                color="#ff4444"
              />
            </View>
          </CameraView>
        </View>
      ) : (
        <>
          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.label}>Código de barras:</Text>
            <View style={styles.codeContainer}>
              <TextInput
                style={styles.input}
                value={form.codigo}
                onChangeText={(text) => handleChange("codigo", text)}
                placeholder="Escanea el código"
              />
              <Button
                title="Escanear"
                onPress={() => {
                  setScanned(false);
                  setShowScanner(true);
                }}
              />
            </View>

            <Text style={styles.label}>Nombre del artículo:</Text>
            <TextInput
              style={styles.input}
              value={form.nombre}
              onChangeText={(text) => handleChange("nombre", text)}
              placeholder="Ingrese el nombre"
            />

            <Text style={styles.label}>Foto del artículo:</Text>
            {form.imagen && (
              <Image source={{ uri: form.imagen }} style={styles.image} />
            )}
            <View style={styles.imageButtons}>
              <Button title="Seleccionar de galería" onPress={pickImage} />
              <Button title="Tomar foto" onPress={takePhoto} />
            </View>

            <Text style={styles.label}>Descripción:</Text>
            <TextInput
              style={styles.input}
              value={form.description}
              onChangeText={(text) => handleChange("description", text)}
              placeholder="Ingrese la descripción"
            />
            <View style={styles.contenirecategoria}> 
            <Text style={styles.label}>Categoria:</Text>
            <TextInput
              style={styles.input}
              value={form.category}
              onChangeText={(text) => handleChange("category", text)}
              placeholder="Ingrese la descripción"
            />
            <Button
              title="Ingresar Categoria"
              onPress={() => {
                showDialog();
              }}>              
            </Button>
            
            </View>

            <Text style={styles.label}>Cantidad:</Text>
            <TextInput
              style={styles.input}
              value={form.cantidad}
              onChangeText={(text) => handleChange("cantidad", text)}
              placeholder="Ingrese la cantidad"
              keyboardType="numeric"
            />

            <Text style={styles.label}>Precio:</Text>
            <TextInput
              style={styles.input}
              value={form.price}
              onChangeText={(text) => handleChange("price", text)}
              placeholder="Ingrese el valor unitario"
              keyboardType="numeric"
            />

            <Button
              title="Guardar artículo"
              onPress={handleSubmit}
              color="#4CAF50"
            />
          </ScrollView>
        </>
      )}
    </View>
    </PaperProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  contenirecategoria: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },

  label: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 16,
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    height: 48,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  codeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginVertical: 12,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  imageButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 10,
  },
  scannerContainer: {
    flex: 1,
    justifyContent: "center",
  },
  scannerOverlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  scannerFrame: {
    width: 250,
    height: 150,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 10,
    marginBottom: 20,
  },
  flipButton: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 12,
    borderRadius: 30,
  },
  flipText: {
    color: "white",
    fontWeight: "bold",
  },
  scrollContainer: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    paddingBottom: 40,
  },
});
