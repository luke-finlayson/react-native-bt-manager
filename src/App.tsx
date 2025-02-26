import { StyleSheet, SafeAreaView } from 'react-native';
import { useBluetoothManager } from '../lib/src';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ScanningScreen from './Scanning';
import DeviceScreen from './Device';
import DFUpdateScreen from './Update';

const Stack = createStackNavigator();

export default function App() {
  useBluetoothManager();

  return (
    <NavigationContainer>
      <SafeAreaView style={styles.safeContainer}>
        <Stack.Navigator initialRouteName='Scanning' screenOptions={{ headerShown: false }}>
          <Stack.Screen name='Scanning' component={ScanningScreen} />
          <Stack.Screen name='Device' component={DeviceScreen} />
          <Stack.Screen name='Update' component={DFUpdateScreen} />
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
      flex: 1,
      backgroundColor: 'rgb(240, 240, 240)'
  },
});
