import * as React from 'react';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import DropdownComponent from './DropdownComponent'; 
import { View } from 'react-native';

type listcategorias = {
    idcategoria: string;
    nombrecategoria: string;
  } 

type CustomDialogProps = {
  visible: boolean
  title: string
  content: string
  confirmText?: string
  cancelText?: string
  listclientes: listcategorias[]
  onConfirm?: (id: string) => void
  onCancel?: () => void
  onDismiss: () => void
}

const AccionDialogo =({
  visible,
  title,
  content,
  confirmText = "Aceptar",
  cancelText = "Cancelar",
  listclientes,
  onConfirm,
  onCancel,
  onDismiss,
}: CustomDialogProps) => {
  
const [idcliente, setidcliente] = React.useState("0");

  return (
    
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
            <Text>{content}</Text>
            {
              title === "Crear Factura" && (
                <View style={{ marginTop: 10 }}>
                <Text style={{ marginTop: 10, color: 'white', fontSize: 20 }}>
                  Seleccione un cliente {idcliente}
                </Text>
                <DropdownComponent
                  data={listclientes}
                  handleChange={(name, value) => setidcliente(value)}
              />
              </View>
              )
            }

        </Dialog.Content>
        <Dialog.Actions>
        {onCancel && (
            <Button
              onPress={() => {
                onCancel()
                onDismiss()
              }}
            >
              {cancelText}
            </Button>
          )}
          {onConfirm && (
            <Button
              onPress={() => {
                if (title === "Crear Factura") {
                  if (idcliente === "0") {
                    alert("Debe seleccionar un cliente");
                    return;
                  }
                onConfirm(idcliente);
                } else {
                  onConfirm("0");
                }
                setidcliente("0");
                onDismiss()
              }}
            >
              {confirmText}
            </Button>
          )}
        </Dialog.Actions>
      </Dialog>
    </Portal>

  );
};

export default AccionDialogo;