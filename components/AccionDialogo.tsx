import * as React from 'react';
import { Button, Dialog, Portal, Text } from 'react-native-paper';

type CustomDialogProps = {
  visible: boolean
  title: string
  content: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
  onDismiss: () => void
}

const AccionDialogo =({
  visible,
  title,
  content,
  confirmText = "Aceptar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  onDismiss,
}: CustomDialogProps) => {
  
  return (
    
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
            <Text>{content}</Text>
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
                onConfirm()
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