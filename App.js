import { ToastAndroid, useColorScheme } from 'react-native';
import { MD3LightTheme, MD3DarkTheme, PaperProvider } from 'react-native-paper';
import { LightScheme } from './src/theme/lightScheme';
import { DarkScheme } from './src/theme/darkScheme';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './src/navigation/StackNavigator';
import { useEffect } from 'react';
import { prepareDatabase } from './src/services/Database';

const LightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...LightScheme
  }
}

const DarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...DarkScheme
  }
}

export default function App() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? DarkTheme : LightTheme;

  useEffect(() => {
    const initDatabase = async () => {
      try {
        await prepareDatabase();
      } catch (err) {
        ToastAndroid.showWithGravity(
          'Database error!',
          ToastAndroid.BOTTOM,
          ToastAndroid.SHORT
        );
      }
    };
    initDatabase();
  }, []);

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme}>
        <StackNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
}
