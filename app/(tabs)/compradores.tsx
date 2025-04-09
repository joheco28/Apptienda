import { useState } from "react"
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native"

export default function RegistrationForm() {
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

  const handleSubmit = () => {
    if (validateForm()) {
      Alert.alert(
        "Formulario Enviado",
        `Cédula: ${formData.cedula}\nNombre: ${formData.nombre}\nCelular: ${formData.celular}\nCorreo: ${formData.correo}`,
        [{ text: "OK" }],
      )
      // Aquí puedes enviar los datos a tu API o realizar otras acciones
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Formulario de Registro</Text>

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
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
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
})

