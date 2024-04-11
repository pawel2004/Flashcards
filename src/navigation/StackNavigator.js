import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DeckScreen from '../screens/DeckScreen';
import FlashCardsScreen from '../screens/FlashCardsScreen';
import NavBar from '../components/NavBar';
import TestScreen from '../screens/TestScreen';

const Stack = createNativeStackNavigator();

export default StackNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName='Decks'
            screenOptions={{
                header: NavBar,
                animation: 'slide_from_bottom'
            }}>
            <Stack.Screen name='Decks' component={DeckScreen} />
            <Stack.Screen name='FlashCards' component={FlashCardsScreen} options={({ route }) => ({ title: route.params.name })} />
            <Stack.Screen name='Test' component={TestScreen} />
        </Stack.Navigator>
    );
}