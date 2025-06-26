import * as React from 'react';
import { Button, Dialog, Portal, Text, TextInput } from 'react-native-paper';
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { categoria } from "@/database/schemas/tiendaSchema"; // Asegúrate de que esta ruta sea correcta

type EditDialogoProps = {
  visible: boolean;
  onDismiss: () => void;
  actualizar: () => void; // Añadido para manejar la actualización
};

const EditDialogo =({
visible,
onDismiss,
actualizar,
}: EditDialogoProps) => {

     // cargando la base de datos
      const db = useSQLiteContext();
      const drizzleDb = drizzle(db, { schema: { categoria } });

    // Funciones para manejar la confirmación y cancelación

    const [nomcategoria, setCategoria] = React.useState("");
    const [descripcion, setDescripcion] = React.useState("");

    const onConfirm = async() => {
        // Inserta valores en la tabla de categoria
        if (nomcategoria.trim() === "" || descripcion.trim() === "") {
            console.error("Los campos no pueden estar vacíos");
            return;
        }
        try {
            await drizzleDb.insert(categoria).values({
                nombre: nomcategoria,
                descripcion: descripcion,
            });
            // Llama a la función de actualización después de guardar
            actualizar();
            console.log("Categoria guardada exitosamente");
        } catch (error) {
            console.error("Error al guardar la categoria:", error);
        }
    };

    const onCancel = () => {
        // Aquí puedes manejar la lógica de cancelación
        console.log("Cancelado");
    };
  
  return (
    
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>Ingresar Categoria</Dialog.Title>
        <Dialog.Content>
            <TextInput
              label="Nombre de la Categoria"
              mode="outlined"
              placeholder="Ingrese el nombre de la categoria"
              style={{ marginBottom: 10 }}
                value={nomcategoria}
                onChangeText={nomcategoria => setCategoria(nomcategoria)} 
            />
            <TextInput
              label="Descripción"  
                mode="outlined"
                placeholder="Ingrese una descripción"
                style={{ marginBottom: 10 }}
                value={descripcion}
                onChangeText={descripcion => setDescripcion(descripcion)}
            />
        </Dialog.Content>
        <Dialog.Actions>
            <Button
              onPress={() => {
                onCancel()
                onDismiss()
                setCategoria("");
                setDescripcion("");
              }}
            >
              Cancelar
            </Button>

            <Button
              onPress={() => {
                onConfirm()
                onDismiss()
                setCategoria("");
                setDescripcion("");
              }}
            >
              Guardar
            </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>

  );
};

export default EditDialogo;