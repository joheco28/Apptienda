import type React from "react"
import { useState,useCallback } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native"

import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { vendedor } from "@/database/schemas/tiendaSchema";
import { useFocusEffect } from "expo-router";
import { eq } from "drizzle-orm";



interface Vendedor {
  id: number
  nombre: string
  celular: string
  correo: string
  password: string
}

const VendedoresManager = () => {
  const [vendedores, setVendedores] = useState<Vendedor[]>([])

  const [vendedorActual, setVendedorActual] = useState<Vendedor>({
    id: 0,
    nombre: "",
    celular: "",
    correo: "",
    password: "",
  })

  // Cargando base de datos
    const db = useSQLiteContext()
    const drizzleDb = drizzle(db, { schema: { vendedor } })

  // Cargar vendedores desde la base de datos

  const loadVendedores = async () => {

    try {
      const result = await drizzleDb.select().from(vendedor)
      const vendedoresData = result.map((v) => ({
        id: v.idVendedor,
        nombre: v.nombre,
        celular: v.celular,
        correo: v.correo,
        password: v.password,
      }))

      setVendedores(vendedoresData.map((v) => ({
        ...v,
        celular: v.celular || "",
        correo: v.correo || "",
        password: v.password || "",
      })))  

    } catch (error) {
      console.error("Error al cargar los vendedores:", error)
    }
  }

  // Funciones para crear, actualizar y eliminar vendedores
  const updatevendedor = async (v: Vendedor) => {
    try {
      await drizzleDb.update(vendedor)
        .set({
          nombre: v.nombre,
          celular: v.celular,
          correo: v.correo,
          password: v.password,
        })
        .where(eq(vendedor.idVendedor, v.id))

      loadVendedores()
    } catch (error) {
      console.error("Error al actualizar el vendedor:", error)
    }
  }


// Función para crear un nuevo vendedor
  const createVendedor = async (v: Vendedor) => {
    try {
      await drizzleDb.insert(vendedor).values({
        nombre: v.nombre,
        celular: v.celular,
        correo: v.correo,
        password: v.password,
      })
      loadVendedores()
    } catch (error) {
      console.error("Error al crear el vendedor:", error)
    }
  } 

// Hook para cargar los vendedores al montar el componente
  // Se ejecuta una vez cuando el componente se monta
  useFocusEffect(
    useCallback(() => {
      loadVendedores();
    }, [])
  );


  const [modoEdicion, setModoEdicion] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [mostrarPasswords, setMostrarPasswords] = useState<{ [key: number]: boolean }>({})

  const limpiarFormulario = () => {
    setVendedorActual({
      id: 0,
      nombre: "",
      celular: "",
      correo: "",
      password: "",
    })
    setModoEdicion(false)
  }

  const abrirModalNuevo = () => {
    limpiarFormulario()
    setModalVisible(true)
  }

  const abrirModalEditar = (vendedor: Vendedor) => {
    setVendedorActual(vendedor)
    setModoEdicion(true)
    setModalVisible(true)
  }

  const guardarVendedor = () => {
    if (!vendedorActual.nombre || !vendedorActual.celular || !vendedorActual.correo || !vendedorActual.password) {
      Alert.alert("Error", "Por favor complete todos los campos")
      return
    }
    
    if (modoEdicion) {
      updatevendedor(vendedorActual)
      // setVendedores(vendedores.map((v) => (v.id === vendedorActual.id ? vendedorActual : v)))
    } else {
      const nuevoId = Math.max(...vendedores.map((v) => v.id), 0) + 1
      createVendedor(vendedorActual)
      //setVendedores([...vendedores, { ...vendedorActual, id: nuevoId }])
    }

    setModalVisible(false)
    limpiarFormulario()
  }

  const eliminarVendedor = (id: number) => {
    Alert.alert("Confirmar eliminación", "¿Está seguro de que desea eliminar este vendedor?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => setVendedores(vendedores.filter((v) => v.id !== id)),
      },
    ])
  }

  const toggleMostrarPassword = (id: number) => {
    setMostrarPasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const renderTableHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={[styles.headerText, styles.nombreColumn]}>Nombre</Text>
      <Text style={[styles.headerText, styles.celularColumn]}>Celular</Text>
      <Text style={[styles.headerText, styles.correoColumn]}>Correo</Text>
      <Text style={[styles.headerText, styles.passwordColumn]}>Contraseña</Text>
      <Text style={[styles.headerText, styles.accionesColumn]}>Acciones</Text>
    </View>
  )

  const renderVendedorRow = (vendedor: Vendedor) => (
    <View key={vendedor.id} style={styles.tableRow}>
      <Text style={[styles.cellText, styles.nombreColumn]} numberOfLines={2}>
        {vendedor.nombre}
      </Text>
      <Text style={[styles.cellText, styles.celularColumn]} numberOfLines={2}>
        {vendedor.celular}
      </Text>
      <Text style={[styles.cellText, styles.correoColumn]} numberOfLines={2}>
        {vendedor.correo}
      </Text>
      <View style={[styles.passwordContainer, styles.passwordColumn]}>
        <Text style={styles.passwordText} numberOfLines={1}>
          {mostrarPasswords[vendedor.id] ? vendedor.password : "••••••••"}
        </Text>
        <TouchableOpacity onPress={() => toggleMostrarPassword(vendedor.id)} style={styles.eyeButton}>
          <Text style={styles.eyeIcon}>{mostrarPasswords[vendedor.id] ? "🙈" : "👁️"}</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.actionsContainer, styles.accionesColumn]}>
        <TouchableOpacity onPress={() => abrirModalEditar(vendedor)} style={[styles.actionButton, styles.editButton]}>
          <Text style={styles.actionButtonText}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => eliminarVendedor(vendedor.id)}
          style={[styles.actionButton, styles.deleteButton]}
        >
          <Text style={styles.actionButtonText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Gestión de Vendedores</Text>
          <Text style={styles.subtitle}>Administra la información de los vendedores</Text>
        </View>
        <TouchableOpacity onPress={abrirModalNuevo} style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Nuevo</Text>
        </TouchableOpacity>
      </View>

      {/* Table */}
      <View style={styles.tableContainer}>
        {renderTableHeader()}
        <ScrollView style={styles.tableBody}>
          {vendedores.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No hay vendedores registrados</Text>
            </View>
          ) : (
            vendedores.map(renderVendedorRow)
          )}
        </ScrollView>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Total: {vendedores.length} {vendedores.length === 1 ? "vendedor" : "vendedores"}
        </Text>
      </View>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{modoEdicion ? "Editar Vendedor" : "Nuevo Vendedor"}</Text>

            <ScrollView style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nombre completo</Text>
                <TextInput
                  style={styles.textInput}
                  value={vendedorActual.nombre}
                  onChangeText={(text) => setVendedorActual({ ...vendedorActual, nombre: text })}
                  placeholder="Ingrese el nombre completo"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Celular</Text>
                <TextInput
                  style={styles.textInput}
                  value={vendedorActual.celular}
                  onChangeText={(text) => setVendedorActual({ ...vendedorActual, celular: text })}
                  placeholder="+57 300 123 4567"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Correo electrónico</Text>
                <TextInput
                  style={styles.textInput}
                  value={vendedorActual.correo}
                  onChangeText={(text) => setVendedorActual({ ...vendedorActual, correo: text })}
                  placeholder="correo@empresa.com"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Contraseña</Text>
                <TextInput
                  style={styles.textInput}
                  value={vendedorActual.password}
                  onChangeText={(text) => setVendedorActual({ ...vendedorActual, password: text })}
                  placeholder="Ingrese la contraseña"
                  placeholderTextColor="#999"
                  secureTextEntry={true}
                />
              </View>
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={[styles.modalButton, styles.cancelButton]}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={guardarVendedor} style={[styles.modalButton, styles.saveButton]}>
                <Text style={styles.saveButtonText}>{modoEdicion ? "Actualizar" : "Guardar"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#212529",
  },
  subtitle: {
    fontSize: 14,
    color: "#6c757d",
    marginTop: 4,
  },
  addButton: {
    backgroundColor: "#007bff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
  tableContainer: {
    flex: 1,
    margin: 16,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  headerText: {
    fontWeight: "600",
    fontSize: 12,
    color: "#495057",
    textAlign: "center",
  },
  tableBody: {
    flex: 1,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f3f4",
    alignItems: "center",
  },
  cellText: {
    fontSize: 12,
    color: "#212529",
    textAlign: "center",
  },
  nombreColumn: {
    flex: 2,
  },
  celularColumn: {
    flex: 1.5,
  },
  correoColumn: {
    flex: 2,
  },
  passwordColumn: {
    flex: 1.5,
  },
  accionesColumn: {
    flex: 1,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  passwordText: {
    fontSize: 12,
    color: "#212529",
    fontFamily: "monospace",
  },
  eyeButton: {
    marginLeft: 4,
    padding: 2,
  },
  eyeIcon: {
    fontSize: 12,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
  },
  actionButton: {
    padding: 6,
    borderRadius: 4,
    borderWidth: 1,
  },
  editButton: {
    borderColor: "#007bff",
    backgroundColor: "#f8f9ff",
  },
  deleteButton: {
    borderColor: "#dc3545",
    backgroundColor: "#fff5f5",
  },
  actionButtonText: {
    fontSize: 12,
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    color: "#6c757d",
    fontSize: 14,
  },
  footer: {
    padding: 16,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#6c757d",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#212529",
    marginBottom: 20,
    textAlign: "center",
  },
  formContainer: {
    maxHeight: 300,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#495057",
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#212529",
    backgroundColor: "#ffffff",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#ced4da",
  },
  cancelButtonText: {
    color: "#6c757d",
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#007bff",
  },
  saveButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
})

export default VendedoresManager
