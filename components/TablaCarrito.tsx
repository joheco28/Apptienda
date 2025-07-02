import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { DataTable } from 'react-native-paper';



interface TablaCarritoProps {
    data: {
        id: string;
        articulo: string;
        precio: number;
        cantidad: number;
        subtotal?: number; // Optional, if you want to display subtotal
    }[];
    sum: number; // Total sum of the cart
    onEliminar: (id: string) => void;
}

const TablaCarrito: React.FC<TablaCarritoProps> = ({ data, sum, onEliminar }) => {
    return (
        <DataTable style={styles.conteiner}>
            <DataTable.Header style={styles.celda}>
                <DataTable.Title>
                   <Text style={styles.textocolor}>Articulo</Text> 
                </DataTable.Title>
                <DataTable.Title numeric>
                    <Text style={styles.textocolor}>Precio</Text>
                </DataTable.Title>
                <DataTable.Title numeric>
                    <Text style={styles.textocolor}>Cantidad</Text>
                </DataTable.Title>
                <DataTable.Title numeric>
                    <Text style={styles.textocolor}>Total</Text>
                </DataTable.Title>
                <DataTable.Title numeric>
                    <Text style={styles.textocolor}>Acciones</Text>
                </DataTable.Title>
            </DataTable.Header>

            {data.map((item) => (
                <DataTable.Row key={item.id} style={styles.celda}>
                    <DataTable.Cell>
                        <Text style={styles.texto}> {item.articulo} </Text>
                    </DataTable.Cell> 
                    <DataTable.Cell numeric><Text style={styles.texto}>${item.precio.toFixed(2)}</Text></DataTable.Cell>
                    <DataTable.Cell numeric><Text style={styles.texto}>{item.cantidad}</Text></DataTable.Cell>
                    <DataTable.Cell numeric><Text style={styles.texto}>${(item.subtotal ?? 0).toFixed(2)}</Text></DataTable.Cell>
                    <DataTable.Cell numeric onPress={() => onEliminar(item.id)}>
                        <Text style={styles.eliminar}>Quitar</Text>
                    </DataTable.Cell>
                </DataTable.Row>
            ))}
            <DataTable.Row key="total-row" style={styles.celda}>    
                <DataTable.Cell>
                    <Text style={styles.texto}>Total</Text>
                </DataTable.Cell>
                {/* Celdas vacías para alinear el total */}
                <DataTable.Cell numeric>
                    <Text style={styles.texto}></Text> 
                </DataTable.Cell>
                <DataTable.Cell numeric>
                    <Text style={styles.texto}></Text> 
                </DataTable.Cell>

                
                <DataTable.Cell numeric>
                    <Text style={styles.texto}>${sum.toFixed(2)}</Text> 
                </DataTable.Cell>
 
            </DataTable.Row>
        </DataTable>
    );
};

const styles = StyleSheet.create({
    conteiner: {
        backgroundColor: '#25292e',
        width: '100%',
        padding: 10,
    },
    celda: {
        backgroundColor: 'white',
        borderEndWidth: 1,
        borderEndColor: '#ccc',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    texto: {
        color: '#2980b9',
    },
    textocolor: {
        color: '#000',
    },
    eliminar: {
        borderRadius: 5,
        backgroundColor: '#f44336',
        padding: 5,
        color: 'white',
        fontWeight: 'bold',
    },
});


export default TablaCarrito;