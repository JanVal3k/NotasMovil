import {
  Text,
  StyleSheet,
  StatusBar,
  useWindowDimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { PaperProvider } from 'react-native-paper';
import { useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

//---------------------------------------
import AllNotes from './AllNotes';
import NewNote from './NewNote';
import Calendario from './Calendario';
import { ProvedorEstado } from './Clases/hookCambioEstado';

//---------------------------------------

const MostrarAllNotes = () => <AllNotes />;
const MostrarNewNote = () => <NewNote />;
const renderScene = SceneMap({
  first: MostrarAllNotes,
  second: MostrarNewNote,
  third: Calendario,
});
const routes = [
  { key: 'first', title: 'Notas' },
  { key: 'second', title: 'Nueva Nota' },
  { key: 'third', title: 'Tareas' },
];
//--------------------------------------
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
//--------------------------------------
const requestNotificationPermissions = async () => {
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('No podremos mostrar notificaciones sin tu permiso');
      return false;
    }
    return true;
  }
  alert('Las notificaciones solo funcionan en dispositivos físicos');
  return false;
};
//--------------------------------------
const App = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  useEffect(() => {
    requestNotificationPermissions();
  }, []);
  //--------------------------------------
  useEffect(() => {
    const verificarFechaSistema = () => {
      const fechaActual = new Date();
      const fechaLocal = new Date(
        fechaActual.getTime() - fechaActual.getTimezoneOffset() * 60000
      );

      console.log('Información del sistema:', {
        fechaLocal: fechaLocal.toLocaleString('es-CO', {
          timeZone: 'America/Bogota',
        }),
        zonaHoraria: Intl.DateTimeFormat().resolvedOptions().timeZone,
        offset: fechaActual.getTimezoneOffset() / 60,
      });
    };

    verificarFechaSistema();
  }, []);
  //---------------------------------------
  return (
    <ProvedorEstado>
      <PaperProvider>
        <SafeAreaProvider>
          <SafeAreaView style={styles.safeAreaContent}>
            <StatusBar style="light" />
            <TabView
              navigationState={{ index, routes }}
              renderScene={renderScene}
              onIndexChange={setIndex}
              initialLayout={{ width: layout.width }}
              renderTabBar={(props) => {
                return <TabBar {...props} style={styles.tabBar} />;
              }}
              style={styles.tabBarStyle}
            />
            {index === 0 && (
              <TouchableOpacity
                style={styles.extraButton}
                onPress={() => setIndex(1)}
              >
                <Text style={styles.extraButtonText}>+</Text>
              </TouchableOpacity>
            )}
          </SafeAreaView>
        </SafeAreaProvider>
      </PaperProvider>
    </ProvedorEstado>
  );
};
const styles = StyleSheet.create({
  safeAreaContent: {
    flex: 1,
    backgroundColor: '#192b42',
  },
  tabBar: {
    backgroundColor: '#192b42',
  },
  extraButton: {
    borderRadius: 12,
    top: -50,
    right: -300,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    backgroundColor: '#5C6570',
  },
  extraButtonText: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
  },
});
export default App;
