import { Image, Text, View, StyleSheet } from 'react-native';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/images/banner.jpeg')}
        style={styles.image}
      />
      <Text style={styles.title}>Aplicacion AppTienda!</Text>
      <View style={styles.caja}>
        <Text style={styles.text}>Esta es una aplicacion de inventarios y ventas</Text>
        <Image
          source={require('../../assets/images/tienda.png')}
          style={{ width: 50, height: 50, marginTop: 20 }}
        />
        <Text style={styles.text}>Desarrollada por: </Text>
        <Text style={styles.text}>José Hernán Cortés Rosero</Text>
        <Image
          source={require('../../assets/images/Logo-SENA.png')}
          style={{ width: 50, height: 50, marginTop: 20 }}
        />
        <Text style={styles.text}>Programador Servicios para la Nube</Text>
        <Text style={styles.text}>Servicio nacional de Aprendizaje SENA</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  text: {
    color: '#fff',
    fontSize: 14,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    margin: 20,
  },
  image: {
    width: '100%',
    height: '40%',
  },

  caja: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
