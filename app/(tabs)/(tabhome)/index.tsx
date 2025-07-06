import { Image, Text, View, StyleSheet } from 'react-native';
 import { Link } from 'expo-router'; 

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>AppTienda</Text>
      <Image
        source={require('@/assets/images/tienda.png')}
        style={styles.image} 
      />
      <Text style={styles.text}>Welcome to the home screen!</Text>

      <Link href="/" style={styles.button}>
        ver resumen de ventas
      </Link>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    color: '#fff',
    fontSize: 24,},
  image: {
    width: 300,
    height: 300,
  },
  text: {
    color: '#fff',
    fontSize: 20,
    margin: 20,
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
});

