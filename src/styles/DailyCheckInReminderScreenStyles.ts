import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 45,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  selectedTime: {
    color: '#fff',
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
  },
  infoText: {
    color: '#8a2be2', // Purple color
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default styles;