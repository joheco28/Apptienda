// BarcodeScannerCamera.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import * as ImagePicker from "expo-image-picker";
import { CameraView, CameraType, BarcodeScanningResult, useCameraPermissions } from 'expo-camera';

type Props = {
  onScannedValue: (value: string, type: string) => void;
  allowedTypes?: string[]; // Ej: ['ean13', 'code128']
};

const BarcodeScannerCamera: React.FC<Props> = ({ onScannedValue, allowedTypes }) => {
  const [facing, setFacing] = useState<CameraType>(ImagePicker.CameraType.back);
  const [scanned, setScanned] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const handleBarCodeScanned = ({ type, data }: BarcodeScanningResult) => {
    const normalizedType = type.toLowerCase();

    if (allowedTypes && !allowedTypes.includes(normalizedType)) {
      Alert.alert('Tipo no permitido', `Tipo escaneado: ${type}`);
      return;
    }

    setScanned(true);
    onScannedValue(data, type);
    Alert.alert('Código válido', `Tipo: ${type}\nValor: ${data}`);
  };

  if (permission === null) return <Text>Solicitando permisos de cámara...</Text>;
  if (!permission) return <Text>Solicitando permisos de cámara...</Text>;
  if (!permission.granted) return <Text>No se tiene acceso a la cámara.</Text>;
  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        facing={facing}
        barcodeScannerSettings={{ 
              barcodeTypes: ["ean13", "ean8", "upc_a", "code128", "qr"], 
            }}  
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}

      />
      {scanned && (
        <View style={styles.buttonContainer}>
          <Button title="Escanear otro código" onPress={() => setScanned(false)} />
        </View>
      )}
    </View>
  );
};

export default BarcodeScannerCamera;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
});