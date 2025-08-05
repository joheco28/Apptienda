import React, { useState, JSX, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  TextInput,
  ScrollView,
  ListRenderItem,
} from 'react-native';

// Interfaces y tipos
interface Product {
  idProducto: number;
  codigo: string;
  nombre: string;
  imagen: string;
  descripcion: string;
  precio: number;
  cantidad: number;
  idcategoria: number;
}

interface FormData {
  codigo: string;
  nombre: string;
  imagen: string;
  descripcion: string;
  precio: string;
  cantidad: string;
  idcategoria: string;
}

interface ProductTableProps {
  initialProducts?: Product[];
  onProductChange?: (products: Product) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ 
  initialProducts = [],
  onProductChange 
}) => {

  const [products, setProducts] = useState<Product[]>(
    initialProducts.map(product => ({      ...product,
      descripcion: product.descripcion || '', // Asegurar que descripcion no sea null
    }))
  );

  useEffect(() => {
    if (initialProducts.length > 0) {
      setProducts(initialProducts.map(product => ({
        ...product,
        descripcion: product.descripcion || '', // Asegurar que descripcion no sea null
      })));
    }
  }, [initialProducts]);

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<FormData>({
    codigo: '',
    nombre: '',
    imagen: '',
    descripcion: '',
    precio: '',
    cantidad: '',
    idcategoria: '',
  });

  const updateProducts = (newProducts: Product[]): void => {
    setProducts(newProducts);
    
  };


  const handleEdit = (product: Product): void => {
    setEditingProduct(product);
    setFormData({
      codigo: product.codigo,
      nombre: product.nombre,
      imagen: product.imagen,
      descripcion: product.descripcion,
      precio: product.precio.toString(),
      cantidad: product.cantidad.toString(),
      idcategoria: product.idcategoria.toString(),
    });
    setModalVisible(true);
  };

  const validateForm = (): boolean => {
    if (!formData.codigo.trim()) {
      Alert.alert('Error', 'El código es requerido');
      return false;
    }
    if (!formData.nombre.trim()) {
      Alert.alert('Error', 'El nombre es requerido');
      return false;
    }
    if (!formData.precio || isNaN(parseFloat(formData.precio))) {
      Alert.alert('Error', 'El precio debe ser un número válido');
      return false;
    }
    if (!formData.cantidad || isNaN(parseInt(formData.cantidad))) {
      Alert.alert('Error', 'La cantidad debe ser un número válido');
      return false;
    }
    if (!formData.idcategoria || isNaN(parseInt(formData.idcategoria))) {
      Alert.alert('Error', 'El ID de categoría debe ser un número válido');
      return false;
    }
    return true;
  };

  const handleSave = (): void => {
    if (!validateForm()) return;

    if (editingProduct) {
      // Editar producto existente
      console.log('Editando producto con datos:', formData);
      const updatedProduct: Product = {
        ...editingProduct,
        codigo: formData.codigo.trim(),
        nombre: formData.nombre.trim(),
        imagen: formData.imagen.trim() || 'https://via.placeholder.com/50',
        descripcion: formData.descripcion.trim(),
        precio: parseFloat(formData.precio),
        cantidad: parseInt(formData.cantidad),
        idcategoria: parseInt(formData.idcategoria),
      };
      onProductChange?.(updatedProduct);
      const updatedProducts = products.map(p => 
        p.idProducto === editingProduct.idProducto
          ? {
              ...p,
              codigo: formData.codigo.trim(),
              nombre: formData.nombre.trim(),
              imagen: formData.imagen.trim(),
              descripcion: formData.descripcion.trim(),
              precio: parseFloat(formData.precio),
              cantidad: parseInt(formData.cantidad),
              idcategoria: parseInt(formData.idcategoria),
            }
          : p
      );
      updateProducts(updatedProducts);
    } else {
      // Agregar nuevo producto
      console.log('Agregando nuevo producto con datos:', formData);
      const maxId = products.length > 0 ? Math.max(...products.map(p => p.idProducto)) : 0;
      const newProduct: Product = {
        idProducto: maxId + 1,
        codigo: formData.codigo.trim(),
        nombre: formData.nombre.trim(),
        imagen: formData.imagen.trim() || 'https://via.placeholder.com/50',
        descripcion: formData.descripcion.trim(),
        precio: parseFloat(formData.precio),
        cantidad: parseInt(formData.cantidad),
        idcategoria: parseInt(formData.idcategoria),
      };
      updateProducts([...products, newProduct]);
    }
    
    closeModal();
  };

  const handleAdd = (): void => {
    setEditingProduct(null);
    setFormData({
      codigo: '',
      nombre: '',
      imagen: '',
      descripcion: '',
      precio: '',
      cantidad: '',
      idcategoria: '',
    });
    setModalVisible(true);
  };

  const closeModal = (): void => {
    setModalVisible(false);
    setEditingProduct(null);
    setFormData({
      codigo: '',
      nombre: '',
      imagen: '',
      descripcion: '',
      precio: '',
      cantidad: '',
      idcategoria: '',
    });
  };

  const updateFormField = (field: keyof FormData, value: string): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderProductItem: ListRenderItem<Product> = ({ item }) => (
   
    <View style={styles.productRow}>
 
        <View style={styles.productContent}>
          <Text style={styles.productId}>{item.idProducto}</Text>
          <Text style={styles.productCode}>{item.codigo}</Text>
          <Text style={styles.productName}>{item.nombre}</Text>
          <Text style={styles.productDescription} numberOfLines={2}>
            {item.descripcion}
          </Text>
          <Text style={styles.productPrice}>${item.precio.toFixed(2)}</Text>
          <Text style={styles.productQuantity}>{item.cantidad}</Text>
          <Text style={styles.productCategory}>{item.idcategoria}</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.button, styles.editButton]}
              onPress={() => handleEdit(item)}
              accessibilityLabel={`Editar producto ${item.nombre}`}
            >
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>

          </View>
        </View>

    </View>
  );

  const renderFormInput = (
    placeholder: string,
    value: string,
    onChangeText: (text: string) => void,
    keyboardType: 'default' | 'numeric' = 'default',
    multiline: boolean = false
  ): JSX.Element => (
    <TextInput
      style={[styles.input, multiline && styles.textArea]}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      multiline={multiline}
      numberOfLines={multiline ? 3 : 1}
      textAlignVertical={multiline ? 'top' : 'center'}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tabla de Productos</Text>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={handleAdd}
          accessibilityLabel="Agregar nuevo producto"
        >
          <Text style={styles.addButtonText}>+ Agregar</Text>
        </TouchableOpacity>
      </View>

      {/* Header de la tabla */}
      <View style={styles.tableHeader}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.headerContent}>
            <Text style={styles.headerText}>ID</Text>
            <Text style={styles.headerText}>Código</Text>
            <Text style={styles.headerText}>Nombre</Text>
            <Text style={styles.headerText}>Descripción</Text>
            <Text style={styles.headerText}>Precio</Text>
            <Text style={styles.headerText}>Cantidad</Text>
            <Text style={styles.headerText}>Categoría</Text>
            <Text style={styles.headerText}>Acciones</Text>
          </View>
      </ScrollView>
      </View>
     <ScrollView horizontal showsHorizontalScrollIndicator={false}>

      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item: Product) => item.idProducto.toString()}
        style={styles.productList}
        showsVerticalScrollIndicator={false}
      />
     </ScrollView>

      {/* Modal para editar/agregar */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingProduct ? 'Editar Producto' : 'Agregar Producto'}
            </Text>
            
            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
              {renderFormInput(
                'Código *',
                formData.codigo,
                (text) => updateFormField('codigo', text)
              )}
              
              {renderFormInput(
                'Nombre *',
                formData.nombre,
                (text) => updateFormField('nombre', text)
              )}
              
              {renderFormInput(
                'URL de Imagen',
                formData.imagen,
                (text) => updateFormField('imagen', text)
              )}
              
              {renderFormInput(
                'Descripción',
                formData.descripcion,
                (text) => updateFormField('descripcion', text),
                'default',
                true
              )}
              
              {renderFormInput(
                'Precio *',
                formData.precio,
                (text) => updateFormField('precio', text),
                'numeric'
              )}
              
              {renderFormInput(
                'Cantidad *',
                formData.cantidad,
                (text) => updateFormField('cantidad', text),
                'numeric'
              )}
              
              {renderFormInput(
                'ID Categoría *',
                formData.idcategoria,
                (text) => updateFormField('idcategoria', text),
                'numeric'
              )}
            </ScrollView>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={closeModal}
                accessibilityLabel="Cancelar"
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
                accessibilityLabel="Guardar producto"
              >
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  tableHeader: {
    backgroundColor: '#e9ecef',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  headerContent: {
    flexDirection: 'row',
    paddingHorizontal: 8,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#495057',
    width: 80,
    textAlign: 'center',
  },
  productList: {
    flex: 1,
  },
  productRow: {
    backgroundColor: 'white',
    marginBottom: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  productContent: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  productId: {
    width: 80,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
  },
  productCode: {
    width: 80,
    textAlign: 'center',
    fontSize: 12,
  },
  productName: {
    width: 120,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
  },
  productImage: {
    width: 50,
    height: 50,
    marginHorizontal: 15,
    borderRadius: 4,
  },
  productDescription: {
    width: 150,
    fontSize: 11,
    color: '#666',
    paddingHorizontal: 8,
  },
  productPrice: {
    width: 80,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#28a745',
  },
  productQuantity: {
    width: 80,
    textAlign: 'center',
    fontSize: 12,
  },
  productCategory: {
    width: 80,
    textAlign: 'center',
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'column',
    
    marginLeft: 16,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  editButton: {
    backgroundColor: '#ffc107',
    textAlign: 'center',
    marginBottom: 8,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    textAlign: 'center',
    marginBottom: 8,
  },
  saveButton: {
    backgroundColor: '#28a745',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  formContainer: {
    maxHeight: 400,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
});

export default ProductTable;