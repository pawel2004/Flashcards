import { View, StyleSheet, FlatList, ToastAndroid, Dimensions } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from "react";
import Database from "../services/Database";
import { Button, Dialog, FAB, Portal, TextInput, Text, Surface, ToggleButton, useTheme } from "react-native-paper";
import FlashCard from "../components/FlashCard";

export default FlashCardsScreen = ({ route, navigation }) => {

    const { deckId, deckName } = route.params;

    const [flashCardsArray, setFlashCardsArray] = useState([]);
    const [addDialogVisible, setAddDialogVisible] = useState(false);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [frontText, setFrontText] = useState('');
    const [rearText, setRearText] = useState('');
    const [flashIdToDelete, setFlashIdToDelete] = useState('');
    const [testNormalMode, setTestNormalMode] = useState(true);
    const [toggleState, setToggleState] = useState('unchecked');
    const [surfaceVisible, setSurfaceVisible] = useState(true);
    const [editedFlashesCounter, setEditedFlashesCounter] = useState(0);

    const screenWidth = Dimensions.get('window').width;

    useEffect(() => {
        navigation.setOptions({ title: deckName });
    }, []);

    useEffect(() => {
        const getFlashCards = async () => {
            try {
                const flashCards = await Database.getFlashCardsFromDeck(deckId);
                setFlashCardsArray(flashCards);
            } catch (err) {

            }
        };
        getFlashCards();
    }, []);

    const handleFlashCardAdd = async () => {
        try {
            const newId = await Database.addFlashCard(deckId, frontText, rearText);
            setFlashCardsArray([...flashCardsArray, {
                FlashcardId: newId,
                DeckId: deckId,
                Front: frontText,
                Rear: rearText
            }]);
            setFrontText('');
            setRearText('');
            setAddDialogVisible(false);
        } catch (err) {
            console.log(err);
            ToastAndroid.showWithGravity(
                'An error occured!',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM
            );
        }
    }

    const handleFlashCardDelete = async () => {
        try {
            await Database.deleteFlashCard(flashIdToDelete);
            setFlashCardsArray(flashCardsArray.filter(v => v.FlashcardId !== flashIdToDelete));
            ToastAndroid.showWithGravity(
                'Deleted!',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM
            );
            setDeleteDialogVisible(false);
        } catch (err) {
            console.log(err);
            ToastAndroid.showWithGravity(
                'An error occured!',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM
            );
        }
    };

    const openDeleteDialog = (flashId) => {
        setFlashIdToDelete(flashId);
        setDeleteDialogVisible(true);
    };

    const toggleButton = () => {
        if (testNormalMode) {
            setTestNormalMode(false);
            setToggleState('checked');
        } else {
            setTestNormalMode(true);
            setToggleState('unchecked');
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar style="auto"></StatusBar>
            <Portal>
                <Dialog visible={addDialogVisible} onDismiss={() => setAddDialogVisible(false)}>
                    <Dialog.Icon icon='plus' />
                    <Dialog.Title>Add new flashcard</Dialog.Title>
                    <Dialog.Content style={styles.textInputContainer}>
                        <TextInput label={'Front'} multiline={true} onChangeText={(text) => setFrontText(text)} />
                        <TextInput label={'Rear'} multiline={true} onChangeText={(text) => setRearText(text)} />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setAddDialogVisible(false)}>Cancel</Button>
                        <Button onPress={handleFlashCardAdd}>Add</Button>
                    </Dialog.Actions>
                </Dialog>
                <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
                    <Dialog.Icon icon='delete' />
                    <Dialog.Title>Delete flashcard</Dialog.Title>
                    <Dialog.Content>
                        <Text variant="bodyMedium">Do you want to delete flashcard?</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setDeleteDialogVisible(false)}>No</Button>
                        <Button onPress={handleFlashCardDelete}>Yes</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            <FlatList
                data={flashCardsArray}
                renderItem={(dataPiece) => <FlashCard flashId={dataPiece.item.FlashcardId} front={dataPiece.item.Front} rear={dataPiece.item.Rear} setFlashCardsArray={setFlashCardsArray} openDialog={openDeleteDialog} setSurfaceVisible={setSurfaceVisible} setEditedFlashesCounter={setEditedFlashesCounter} editedFlashesCounter={editedFlashesCounter} />}
                contentContainerStyle={styles.fl}
            />
            <Surface elevation={0} style={{ width: screenWidth, ...styles.button_surface, display: surfaceVisible ? 'block' : 'none' }}>
                <ToggleButton
                    icon="repeat-variant"
                    status={toggleState}
                    iconColor={useTheme().colors.primary}
                    onPress={() => toggleButton()}
                    style={styles.tgb}
                />
                <FAB
                    icon="test-tube"
                    label="BEGIN TEST"
                    disabled={flashCardsArray.length === 0}
                    onPress={() => navigation.navigate('Test', { normalMode: testNormalMode, flashCards: flashCardsArray })}
                />
                <FAB
                    icon="plus"
                    onPress={() => setAddDialogVisible(true)}
                />
            </Surface>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    button_surface: {
        position: 'absolute',
        padding: 16,
        bottom: 0,
        left: 0,
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    fl: {
        paddingBottom: 100
    },
    textInputContainer: {
        gap: 10
    },
    tgb: {
        width: 56,
        height: 56
    }
});