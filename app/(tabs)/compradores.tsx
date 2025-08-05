import { useEffect, useState } from "react"
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, FlatList, SafeAreaView } from "react-native"

import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { cliente } from '@/database/schemas/tiendaSchema';
import { eq } from "drizzle-orm";


export default function RegistrationForm() {

  // cargando la base de datos
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema: { cliente } });


  const [ShowFormulario, setShowFormulario] = useState(true);
  const [ShowClientes, setShowClientes] = useState(false);
  const [showTitle, setShowTitle] = useState("Formulario de Registro");
  const [showboton, setShowBoton] = useState("Enviar");
  const [idcliente, setIdCliente] = useState<number | null>(0);
  
  
  type listClientes = {
    idCliente: number;
    nombre: string;
    celular: string;
    correo: string | null;
  } 
  const [listClientes, setListClientes] = useState<listClientes[]>([])

  useEffect(() => {
    loadClientes();
  }, [])



  const [formData, setFormData] = useState({
    cedula: "",
    nombre: "",
    celular: "",
    correo: "",
  })

  const [errors, setErrors] = useState({
    cedula: "",
    nombre: "",
    celular: "",
    correo: "",
  })


  // carga datos del cliente

  const loadClientes = async () => {
    try {
      const clientes = await drizzleDb.select().from(cliente);
      setListClientes(clientes);
    } catch (error) {
      
      Alert.alert("Error", "No se pudieron cargar los clientes");
    }
  };
 
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\d{1,10}$/
    return phoneRegex.test(phone)
  }

  const handleChange = (field: string, value: string) => {
    // Para el campo celular, solo permitir números
    if (field === "celular" && value !== "") {
      if (!/^\d+$/.test(value)) {
        return
      }
      // Limitar a 10 dígitos
      if (value.length > 10) {
        return
      }
    }

    setFormData({
      ...formData,
      [field]: value,
    })

    // Limpiar el error cuando el usuario comienza a escribir
    if (errors[field as keyof typeof errors]) {
      setErrors({
        ...errors,
        [field]: "",
      })
    }
  }

  const validateForm = () => {
    let isValid = true
    const newErrors = { ...errors }

    // Validar cédula
    if (!formData.cedula.trim()) {
      newErrors.cedula = "La cédula es requerida"
      isValid = false
    }

    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido"
      isValid = false
    }

    // Validar celular
    if (!formData.celular.trim()) {
      newErrors.celular = "El celular es requerido"
      isValid = false
    } else if (!validatePhone(formData.celular)) {
      newErrors.celular = "El celular debe tener máximo 10 dígitos"
      isValid = false
    }

    // Validar correo
    if (!formData.correo.trim()) {
      newErrors.correo = "El correo es requerido"
      isValid = false
    } else if (!validateEmail(formData.correo)) {
      newErrors.correo = "Ingrese un correo válido"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      Alert.alert(
        "Formulario Enviado",
        `Cédula: ${formData.cedula}\nNombre: ${formData.nombre}\nCelular: ${formData.celular}\nCorreo: ${formData.correo}`,
        [{ text: "OK" }],
      )
     
     
     
      //  codigo para insertar en la base de datos

      if(showboton === "Enviar") {

        await drizzleDb.insert(cliente).values({
          nombre: formData.nombre,
          celular: formData.celular,
          correo: formData.correo,
        }).then(() => {
          Alert.alert("Éxito", "Datos guardados correctamente")
        }).catch((error) => {
          console.error("Error al guardar los datos:", error)
          Alert.alert("Error", "No se pudieron guardar los datos")
        })
      }
      else if (showboton === "Actualizar" && idcliente !== null) { 
        await drizzleDb.update(cliente)
          .set({
            nombre: formData.nombre,
            celular: formData.celular,
            correo: formData.correo,
          })
          .where(eq(cliente.idCliente, idcliente))
          .then(() => {
            Alert.alert("Éxito", "Datos actualizados correctamente")
          })
          .catch((error) => {
            
            Alert.alert("Error", "No se pudieron actualizar los datos")
          })
          setShowBoton("Enviar");
          setIdCliente(null);
      }


      loadClientes();

      // Limpiar el formulario después de enviar
      setFormData({
        cedula: "",
        nombre: "",
        celular: "",
        correo: "",
      })

      // Limpiar los errores
      setErrors({
        cedula: "",
        nombre: "",
        celular: "",
        correo: "",
      })  
    }
  }


  //oculata y habilita formulario

  const toggleFormulario = () => {
    setShowFormulario(!ShowFormulario)
    setShowClientes(!ShowClientes)
    if (ShowFormulario) {
      setShowTitle("Ver Formulario de Registro")
    } else {
      setShowTitle("Ver Lista de clientes")
    }
  }

  // Renderizar el formulario y la lista de clientes

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Formulario de Registro</Text>
      <TouchableOpacity style={styles.button} onPress={toggleFormulario}>
        <Text style={styles.buttonText}>{showTitle}</Text>
      </TouchableOpacity>


    <View style={ShowFormulario ? styles.container : styles.ocultar}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Cédula</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingrese su cédula"
          value={formData.cedula}
          onChangeText={(text) => handleChange("cedula", text)}
        />
        {errors.cedula ? <Text style={styles.errorText}>{errors.cedula}</Text> : null}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingrese su nombre completo"
          value={formData.nombre}
          onChangeText={(text) => handleChange("nombre", text)}
        />
        {errors.nombre ? <Text style={styles.errorText}>{errors.nombre}</Text> : null}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Celular</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingrese su número de celular"
          value={formData.celular}
          onChangeText={(text) => handleChange("celular", text)}
          keyboardType="numeric"
          maxLength={10}
        />
        {errors.celular ? <Text style={styles.errorText}>{errors.celular}</Text> : null}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Correo</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingrese su correo electrónico"
          value={formData.correo}
          onChangeText={(text) => handleChange("correo", text)}
          keyboardType="email-address"
          autoCapitalize="none"
          />
        {errors.correo ? <Text style={styles.errorText}>{errors.correo}</Text> : null}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{showboton}</Text>
      </TouchableOpacity>
    </View>
    

    <View style={ShowClientes ? styles.container : styles.ocultar}>
      <Text style={styles.title}>Lista de Clientes</Text>
      <FlatList
        data={listClientes}
        keyExtractor={(item) => item.idCliente.toString()} 
        renderItem={({ item }) => (
          <View style={styles.listContainer}>
            <View style={{ flexDirection: "column", justifyContent: "space-between" }}>
              <Text style={styles.textname}>Nombre: {item.nombre}</Text>
              <Text style={styles.textcelular} >Celular: {item.celular}</Text>
              <Text style={styles.textcorreo}>Correo: {item.correo}</Text>
            </View>
            <View style={{ flexDirection: "column", justifyContent: "space-between", marginTop: 10 }}>
                          <TouchableOpacity
              style={styles.eliminar}
              onPress={() => {
                Alert.alert(
                  "Eliminar Cliente",
                  `¿Estás seguro de eliminar a ${item.nombre}?`,
                  [
                    {
                      text: "Cancelar",
                      style: "cancel",
                    },
                    {
                      text: "Eliminar",
                      onPress: async () => {
                        try {
                         await drizzleDb.delete(cliente).where(eq(cliente.idCliente, item.idCliente));
                          loadClientes();
                          Alert.alert("Éxito", "Cliente eliminado correctamente");
                        } catch (error) {
                          console.error("Error al eliminar el cliente:", error);
                          Alert.alert("Error", "No se pudo eliminar el cliente");
                        }
                      },
                    },
                  ],
                );
              }}>
              <Text style={styles.buttonText}>Eliminar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                Alert.alert(
                  "Editar Cliente",
                  `¿Estás seguro de editar a ${item.nombre}?`,
                  [
                    {
                      text: "Cancelar",
                      style: "cancel",
                    },
                    {
                      text: "Editar",
                      onPress: async () => {
                        setShowFormulario(true);
                        setShowClientes(false);
                        setShowBoton("Actualizar");
                        setIdCliente(item.idCliente);
                        setFormData({
                          cedula: item.idCliente.toString(), // Asumiendo que la cédula es el ID del cliente
                          nombre: item.nombre,
                          celular: item.celular,
                          correo: item.correo || "",
                        });
                      },
                    },
                  ],
                );
              }}>
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>
            </View>

          </View>
        )}
      />
    </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  ocultar: {
    display: "none",
  },


  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "500",
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  listContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 10,
  },
  textname: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  textcelular: {
    fontSize: 16,
    color: "#555",
  },
  textcorreo: {
    fontSize: 16,
    color: "#555",
  },

  eliminar: {
    borderRadius: 5,
    backgroundColor: '#f44336',
    padding: 5,
    color: 'white',
    fontWeight: 'bold',
    alignItems: "center",
    justifyContent: "center",
    },
})

