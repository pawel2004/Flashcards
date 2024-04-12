import { View, StyleSheet, Dimensions } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from "react";
import { Button, IconButton, Dialog, Portal, Text, Surface, useTheme, Chip } from "react-native-paper";

export default TestScreen = ({ route, navigation }) => {

    const { normalMode, flashCards } = route.params;

    let [flashCardsArray, setFlashCardsArray] = useState([]);
    const [endDialogVisible, setEndDialogVisible] = useState(false);
    const [roundDialogVisible, setRoundDialogVisible] = useState(false);
    const [currFlashCard, setCurrentFlashcard] = useState({});
    const [reversed, setReversed] = useState(false);
    let [backupArray, setBackupArray] = useState([]);
    const [successAmount, setSuccessAmount] = useState(0);
    const [errorsAmount, setErrorsAmount] = useState(0);

    const screenWidth = Dimensions.get('window').width;

    const theme = useTheme();

    // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    useEffect(() => {
        const localFlashArray = [...flashCards];
        shuffleArray(localFlashArray);
        setFlashCardsArray(localFlashArray);
        setCurrentFlashcard(localFlashArray[0]);
    }, []);

    const handleRounds = () => {
        if (flashCardsArray.length == 0) {
            if (backupArray.length != 0) {
                setRoundDialogVisible(true);
            } else {
                setEndDialogVisible(true);
            }
        } else {
            setCurrentFlashcard(flashCardsArray[0]);
            setReversed(false);
        }
    }

    const handleNextRound = () => {
        setRoundDialogVisible(false);
        setSuccessAmount(0);
        setErrorsAmount(0);
        flashCardsArray = backupArray;
        shuffleArray(flashCardsArray);
        setCurrentFlashcard(flashCardsArray[0]);
        setFlashCardsArray(backupArray);
        setBackupArray([]);
        setReversed(false);
    }

    const handleSuccess = () => {
        setSuccessAmount(successAmount + 1);
        flashCardsArray.shift();
        setFlashCardsArray(flashCardsArray);
        handleRounds();
    }

    const handleError = () => {
        setErrorsAmount(errorsAmount + 1);
        const droppedFlashCard = flashCardsArray.shift();
        backupArray = [...backupArray, droppedFlashCard];
        setBackupArray(backupArray);
        handleRounds();
    }

    return (
        <View style={styles.container}>
            <StatusBar style="auto"></StatusBar>
            <Portal>
                <Dialog visible={endDialogVisible} onDismiss={() => setEndDialogVisible(false)}>
                    <Dialog.Icon icon='information' />
                    <Dialog.Title>Test finished!</Dialog.Title>
                    <Dialog.Content>
                        <Text variant="bodyMedium">You have successfully finished test!</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => navigation.goBack()}>OK</Button>
                    </Dialog.Actions>
                </Dialog>
                <Dialog visible={roundDialogVisible} onDismiss={() => setRoundDialogVisible(false)}>
                    <Dialog.Icon icon='information' />
                    <Dialog.Title>Round finished!</Dialog.Title>
                    <Dialog.Content>
                        <Text variant="bodyMedium">Amount of errors: {errorsAmount}!</Text>
                        <Text variant="bodyMedium">Get ready for the next run!</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => handleNextRound()}>OK</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            <Surface elevation={0} style={styles.indicatorsField}>
                <Chip icon="check">{successAmount}</Chip>
                <Chip icon="arrow-right-thick">{errorsAmount}</Chip>
                <Chip icon="cards">{flashCardsArray.length}</Chip>
            </Surface>
            <Surface style={styles.card} elevation={1} onTouchStart={() => setReversed(true)}>
                {reversed ?
                    <Text variant="displayLarge">{normalMode ? currFlashCard.Rear : currFlashCard.Front}</Text>
                    :
                    <Text variant="displayLarge">{normalMode ? currFlashCard.Front : currFlashCard.Rear}</Text>
                }
                {
                    reversed ?
                        <Surface elevation={0} style={{ left: screenWidth / 2 - 120, ...styles.decisionField }}>
                            <IconButton icon='check' mode="contained" size={70} onPress={handleSuccess} />
                            <IconButton icon='arrow-right-thick' mode="contained" iconColor={theme.colors.error} containerColor={theme.colors.errorContainer} size={70} onPress={handleError} />
                        </Surface>
                        : null
                }
            </Surface>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 16
    },
    card: {
        flex: 1,
        padding: 16,
        position: 'relative',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    decisionField: {
        position: 'absolute',
        flexDirection: 'row',
        bottom: 20
    },
    indicatorsField: {
        marginBottom: 16,
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    }
});