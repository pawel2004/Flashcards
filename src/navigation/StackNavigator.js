import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DeckScreen from '../screens/DeckScreen';
import FlashCardsScreen from '../screens/FlashCardsScreen';
import NavBar from '../components/NavBar';
import TestScreen from '../screens/TestScreen';
import HelpScreen from '../screens/HelpScreen';

const Stack = createNativeStackNavigator();

export default StackNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName='Decks'
            screenOptions={{
                header: (props) => <NavBar {...props} />,
                animation: 'slide_from_bottom'
            }}>
            <Stack.Screen name='Decks' component={DeckScreen} />
            <Stack.Screen name='Help' component={HelpScreen} />
            <Stack.Screen name='FlashCards' component={FlashCardsScreen} options={({ route }) => ({ title: route.params.name })} />
            <Stack.Screen name='Test' component={TestScreen} />
        </Stack.Navigator >
    );
}