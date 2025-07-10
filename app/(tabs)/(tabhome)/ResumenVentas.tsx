import React, { useState, useMemo,useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import DateFilterComponent from '@/components/DateFilterComponent';

import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { venta, cliente, vendedor  } from "@/database/schemas/tiendaSchema";
import { useFocusEffect } from "expo-router";
import { eq } from 'drizzle-orm';


interface Sale {
  idventa: number;
  fecha: string;
  nombreCliente: string;
  nombreVendedor: string;
  total: number;
}

interface SalesTableProps {
  sales?: Sale[];
}



const ResumenVentas = ( ) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showDateFilter, setShowDateFilter] = useState<boolean>(false);
  const [ventasData, setSales] = useState<Sale[]>([]);
  const sales = ventasData;

  // Conectar a la base de datos SQLite usando Drizzle ORM
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema: { venta } });

  // Cargar ventas desde la base de datos
  // Esta función se encarga de obtener las ventas desde la base de datos
const loadVentas2 = async () => {
    try {
      const ventas2 = await drizzleDb
        .select({venta
        })
        .from(venta)
      console.log('Ventas cargadas desde la base de datos:', ventas2);
    } catch (error) {
      console.error("Error al cargar las ventas:", error);
    }
  }



  const loadventas = async () => {
    try {
      const ventas = await drizzleDb
        .select({
          idventa: venta.idVenta,
          fecha: venta.fecha,
          total: venta.total,
          nombreCliente: cliente.nombre,
          nombreVendedor: vendedor.nombre,
        })
        .from(venta)
        .innerJoin(cliente, eq(venta.idCliente, cliente.idCliente))
        .innerJoin(vendedor, eq(venta.idVendedor, vendedor.idVendedor));
        console.log('Ventas cargadas desde la base de datos:', ventas);
      setSales(ventas.map((v: any) => ({
        idventa: v.idventa,
        fecha: v.fecha,
        nombreCliente: v.nombreCliente,
        nombreVendedor: v.nombreVendedor,
        total: v.total,
      })));
      //return ventas as Sale[];
    } catch (error) {
      console.error("Error al cargar las ventas:", error);
      return [];
    } 
  }
  // Cargar ventas desde la base de datos
  
  useFocusEffect(
        useCallback(() => {
          loadventas();
        }, [])
  );
  
console.log('Ventas cargadas:', ventasData);

 


  const salesDataFinal = sales.length > 0 ? sales : [];

  // Filtrar ventas por fecha seleccionada
  const filteredSales = useMemo(() => {
    if (!selectedDate) return salesDataFinal;
    return salesDataFinal.filter(sale => sale.fecha === selectedDate);
  }, [salesDataFinal, selectedDate]);

  // Calcular total
  const totalSum = useMemo(() => {
    return filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  }, [filteredSales]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setShowDateFilter(false);
  };

  const clearFilter = () => {
    setSelectedDate('');
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  };

  return (
    <View style={styles.container}>
      {/* Filtro de fecha */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowDateFilter(!showDateFilter)}
        >
          <Text style={styles.filterButtonText}>
            {selectedDate ? `Filtrado por: ${formatDate(selectedDate)}` : 'Filtrar por fecha'}
          </Text>
        </TouchableOpacity>
        
        {selectedDate && (
          <TouchableOpacity style={styles.clearButton} onPress={clearFilter}>
            <Text style={styles.clearButtonText}>Limpiar</Text>
          </TouchableOpacity>
        )}
      </View>

      {showDateFilter && (
        <DateFilterComponent
          onDateSelect={handleDateSelect}
          onClose={() => setShowDateFilter(false)}
          availableDates={salesDataFinal.map(sale => sale.fecha)}
        />
      )}

      {/* Tabla de ventas */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.table}>
          {/* Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, styles.idColumn]}>ID Venta</Text>
            <Text style={[styles.headerCell, styles.dateColumn]}>Fecha</Text>
            <Text style={[styles.headerCell, styles.clientColumn]}>Cliente</Text>
            <Text style={[styles.headerCell, styles.sellerColumn]}>Vendedor</Text>
            <Text style={[styles.headerCell, styles.totalColumn]}>Total</Text>
          </View>

          {/* Rows */}
          <ScrollView style={styles.tableBody}>
            {filteredSales.map((sale) => (
              <View key={sale.idventa} style={styles.tableRow}>
                <Text style={[styles.cell, styles.idColumn]}>{sale.idventa}</Text>
                <Text style={[styles.cell, styles.dateColumn]}>
                  {formatDate(sale.fecha)}
                </Text>
                <Text style={[styles.cell, styles.clientColumn]}>
                  {sale.nombreCliente}
                </Text>
                <Text style={[styles.cell, styles.sellerColumn]}>
                  {sale.nombreVendedor}
                </Text>
                <Text style={[styles.cell, styles.totalColumn, styles.totalText]}>
                  {formatCurrency(sale.total)}
                </Text>
              </View>
            ))}
          </ScrollView>

          {/* Total row */}
          <View style={styles.totalRow}>
            <Text style={[styles.cell, styles.idColumn]}></Text>
            <Text style={[styles.cell, styles.dateColumn]}></Text>
            <Text style={[styles.cell, styles.clientColumn]}></Text>
            <Text style={[styles.cell, styles.sellerColumn, styles.totalLabel]}>
              TOTAL:
            </Text>
            <Text style={[styles.cell, styles.totalColumn, styles.totalAmount]}>
              {formatCurrency(totalSum)}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Información adicional */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Mostrando {filteredSales.length} de {salesDataFinal.length} ventas
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  filterButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 8,
  },
  filterButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  clearButton: {
    backgroundColor: '#6c757d',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 12,
  },
  table: {
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#343a40',
    paddingVertical: 12,
  },
  headerCell: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  tableBody: {
    maxHeight: 400,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    paddingVertical: 10,
  },
  cell: {
    textAlign: 'center',
    paddingHorizontal: 8,
    fontSize: 14,
  },
  totalRow: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    borderTopWidth: 2,
    borderTopColor: '#dee2e6',
  },
  totalLabel: {
    fontWeight: 'bold',
    color: '#495057',
  },
  totalAmount: {
    fontWeight: 'bold',
    color: '#28a745',
    fontSize: 16,
  },
  totalText: {
    color: '#28a745',
    fontWeight: '600',
  },
  idColumn: {
    width: 80,
  },
  dateColumn: {
    width: 100,
  },
  clientColumn: {
    width: 140,
  },
  sellerColumn: {
    width: 140,
  },
  totalColumn: {
    width: 100,
  },
  infoContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  infoText: {
    color: '#6c757d',
    fontSize: 12,
  },
});

export default ResumenVentas;