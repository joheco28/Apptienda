import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';

interface DateFilterComponentProps {
  onDateSelect: (date: string) => void;
  onClose: () => void;
  availableDates: string[];
}

const DateFilterComponent: React.FC<DateFilterComponentProps> = ({
  onDateSelect,
  onClose,
  availableDates,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  // Obtener fechas únicas y ordenadas
  const uniqueDates = [...new Set(availableDates)].sort();
  
  // Generar calendario simple
  const generateCalendar = () => {
    const firstDay = new Date(selectedYear, selectedMonth, 1);
    const lastDay = new Date(selectedYear, selectedMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const calendar = [];
    
    // Días vacíos al inicio
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendar.push(null);
    }
    
    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      calendar.push(day);
    }

    return calendar;
  };

  const formatDateForComparison = (year: number, month: number, day: number): string => {
    const date = new Date(year, month, day);
    return date.toISOString().split('T')[0];
  };

  const isDateAvailable = (day: number): boolean => {
    const dateString = formatDateForComparison(selectedYear, selectedMonth, day);
    return uniqueDates.includes(dateString);
  };

  const handleDatePress = (day: number) => {
    if (isDateAvailable(day)) {
      const dateString = formatDateForComparison(selectedYear, selectedMonth, day);
      onDateSelect(dateString);
    }
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const calendar = generateCalendar();

  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Seleccionar Fecha</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Month/Year selector */}
          <View style={styles.monthYearSelector}>
            <TouchableOpacity
              onPress={() => {
                if (selectedMonth === 0) {
                  setSelectedMonth(11);
                  setSelectedYear(selectedYear - 1);
                } else {
                  setSelectedMonth(selectedMonth - 1);
                }
              }}
              style={styles.navButton}
            >
              <Text style={styles.navButtonText}>‹</Text>
            </TouchableOpacity>
            
            <Text style={styles.monthYearText}>
              {monthNames[selectedMonth]} {selectedYear}
            </Text>
            
            <TouchableOpacity
              onPress={() => {
                if (selectedMonth === 11) {
                  setSelectedMonth(0);
                  setSelectedYear(selectedYear + 1);
                } else {
                  setSelectedMonth(selectedMonth + 1);
                }
              }}
              style={styles.navButton}
            >
              <Text style={styles.navButtonText}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Day names */}
          <View style={styles.dayNamesRow}>
            {dayNames.map((dayName) => (
              <Text key={dayName} style={styles.dayName}>
                {dayName}
              </Text>
            ))}
          </View>

          {/* Calendar grid */}
          <ScrollView style={styles.calendarContainer}>
            <View style={styles.calendarGrid}>
              {calendar.map((day, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayCell,
                    day && isDateAvailable(day) ? styles.availableDay : null,
                    !day ? styles.emptyDay : null,
                  ]}
                  onPress={() => day && handleDatePress(day)}
                  disabled={!day || !isDateAvailable(day)}
                >
                  <Text
                    style={[
                      styles.dayText,
                      day && isDateAvailable(day) ? styles.availableDayText : undefined,
                      day && !isDateAvailable(day) ? styles.unavailableDayText : undefined,
                    ]}
                  >
                    {day || ''}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Available dates list */}
          <View style={styles.availableDatesContainer}>
            <Text style={styles.availableDatesTitle}>Fechas con ventas:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.availableDatesList}>
                {uniqueDates.map((date) => (
                  <TouchableOpacity
                    key={date}
                    style={styles.availableDateChip}
                    onPress={() => onDateSelect(date)}
                  >
                    <Text style={styles.availableDateChipText}>
                      {new Date(date).toLocaleDateString('es-ES')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
  },
  monthYearSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  navButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 18,
    color: '#333',
  },
  monthYearText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  dayNamesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  dayName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    width: 40,
  },
  calendarContainer: {
    maxHeight: 250,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  dayCell: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderRadius: 20,
  },
  emptyDay: {
    backgroundColor: 'transparent',
  },
  availableDay: {
    backgroundColor: '#007bff',
  },
  dayText: {
    fontSize: 14,
    textAlign: 'center',
  },
  availableDayText: {
    color: 'white',
    fontWeight: '600',
  },
  unavailableDayText: {
    color: '#ccc',
  },
  availableDatesContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingTop: 15,
  },
  availableDatesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  availableDatesList: {
    flexDirection: 'row',
  },
  availableDateChip: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
  },
  availableDateChipText: {
    fontSize: 12,
    color: '#495057',
  },
});

export default DateFilterComponent;