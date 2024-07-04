import { View, StyleSheet, FlatList, ToastAndroid, Dimensions } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from "react";
import { addFlashCard, addFlashCards, deleteFlashCard, getFlashCardsFromDeck } from "../services/Database";
import { Button, Dialog, FAB, Portal, TextInput, Text, Surface, ToggleButton, useTheme, Checkbox } from "react-native-paper";
import FlashCard from "../components/FlashCard";
import NavBar from "../components/NavBar";
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as csvReader from 'react-native-csv';
import * as SecureStore from 'expo-secure-store';

export default FlashCardsScreen = ({ route, navigation }) => {

    const { deckId, deckName } = route.params;

    const [flashCardsArray, setFlashCardsArray] = useState([]);
    const [addDialogVisible, setAddDialogVisible] = useState(false);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [helpDialogVisible, setHelpDialogVisible] = useState(false);
    const [checkboxChecked, setCheckboxChecked] = useState(false);
    const [frontText, setFrontText] = useState('');
    const [rearText, setRearText] = useState('');
    const [flashIdToDelete, setFlashIdToDelete] = useState('');
    const [testNormalMode, setTestNormalMode] = useState(true);
    const [toggleState, setToggleState] = useState('unchecked');
    const [surfaceVisible, setSurfaceVisible] = useState(true);
    const [editedFlashesCounter, setEditedFlashesCounter] = useState(0);

    const screenWidth = Dimensions.get('window').width;

    useEffect(() => {
        navigation.setOptions({
            title: deckName,
            header: (props) => <NavBar {...props} handleImport={
                (SecureStore.getItem('notShowImportHint') === 'true') ? handleImport : () => setHelpDialogVisible(true)
            } handleExport={handleExport} />
        });
    }, [navigation, checkboxChecked]);

    useEffect(() => {
        const getFlashCards = async () => {
            try {
                const flashCards = await getFlashCardsFromDeck(deckId);
                setFlashCardsArray(flashCards);
            } catch (err) {

            }
        };
        getFlashCards();
    }, []);

    const isCSVValid = (csvJSON) => {
        const data = csvJSON.data;
        for (let record of data)
            if (record.length !== 2)
                return false;
        return true;
    }

    const handleImport = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                copyToCacheDirectory: true,
                type: 'text/*'
            });
            if (!result.canceled) {
                const uri = result.assets[0].uri;
                const contents = await FileSystem.readAsStringAsync(uri);
                const csvJSON = csvReader.readString(contents);
                if (isCSVValid(csvJSON)) {
                    const importedFlashcards = csvJSON.data;
                    const res = await addFlashCards(deckId, importedFlashcards);
                    const newFlashCards = importedFlashcards.map((e, i) => {
                        return {
                            FlashcardId: res - (importedFlashcards.length - 1) + i,
                            DeckId: deckId,
                            Front: e[0],
                            Rear: e[1]
                        }
                    });
                    setFlashCardsArray((curr) => [...curr, ...newFlashCards]);
                    ToastAndroid.showWithGravity(
                        'Import successful!',
                        ToastAndroid.BOTTOM,
                        ToastAndroid.SHORT
                    );
                } else {
                    ToastAndroid.showWithGravity(
                        'File invalid!',
                        ToastAndroid.BOTTOM,
                        ToastAndroid.SHORT
                    );
                }
            }
        } catch (err) {
            ToastAndroid.showWithGravity(
                'An error occured!',
                ToastAndroid.BOTTOM,
                ToastAndroid.SHORT
            );
        }
    }

    const prepareJSONToParsing = (inputJSON) => {
        const outputJSON = [];
        for (let object of inputJSON)
            outputJSON.push([object.Front, object.Rear]);
        return outputJSON;
    }

    const handleExport = async () => {
        try {
            const flashcards = await getFlashCardsFromDeck(deckId);
            if (flashcards.length === 0) {
                ToastAndroid.showWithGravity(
                    'Nothing to export!',
                    ToastAndroid.BOTTOM,
                    ToastAndroid.SHORT
                );
                throw 'Nothing to export';
            }
            const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
            if (permissions.granted) {
                const filePath = await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, `${deckName}.csv`, 'text/csv');
                const preparedData = csvReader.jsonToCSV(prepareJSONToParsing(flashcards), {
                    delimiter: ';'
                });
                await FileSystem.StorageAccessFramework.writeAsStringAsync(filePath, preparedData);
                ToastAndroid.showWithGravity(
                    'Export successful!',
                    ToastAndroid.BOTTOM,
                    ToastAndroid.SHORT
                );
            } else {
                ToastAndroid.showWithGravity(
                    'Permissions denied!',
                    ToastAndroid.BOTTOM,
                    ToastAndroid.SHORT
                );
            }
        } catch (err) {
            ToastAndroid.showWithGravity(
                'Error occured!',
                ToastAndroid.BOTTOM,
                ToastAndroid.SHORT
            );
        }
    }

    const handleFlashCardAdd = async () => {
        try {
            const newId = await addFlashCard(deckId, frontText, rearText);
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
            ToastAndroid.showWithGravity(
                'An error occured!',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM
            );
        }
    }

    const handleFlashCardDelete = async () => {
        try {
            await deleteFlashCard(flashIdToDelete);
            setFlashCardsArray((curr) => curr.filter(v => v.FlashcardId !== flashIdToDelete));
            ToastAndroid.showWithGravity(
                'Deleted!',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM
            );
            setDeleteDialogVisible(false);
        } catch (err) {
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

    const handleCheckbox = () => {
        if (checkboxChecked) {
            SecureStore.setItem('notShowImportHint', 'false');
            setCheckboxChecked(false);
        } else {
            SecureStore.setItem('notShowImportHint', 'true');
            setCheckboxChecked(true);
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
                        <TextInput label={'Front'} multiline={true} onChangeText={(text) => setFrontText(text)} numberOfLines={5} maxLength={100} />
                        <TextInput label={'Rear'} multiline={true} onChangeText={(text) => setRearText(text)} numberOfLines={5} maxLength={100} />
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
                <Dialog visible={helpDialogVisible} onDismiss={() => { setHelpDialogVisible(false); handleImport() }}>
                    <Dialog.Icon icon='information' />
                    <Dialog.Title>Import hints</Dialog.Title>
                    <Dialog.Content>
                        <Text>1. Imported file must be in CSV format</Text>
                        <Text>2. It shouldn't have a header row</Text>
                        <Text>3. It should have two columns in each record (semicolon delimiter recommended)</Text>
                        <Text>4. Data should be placed consistently. For example, the front side of a flashcard is in the first column, and the rear side is in the second</Text>
                        <Checkbox.Item label='Do not show this again' status={checkboxChecked ? 'checked' : 'unchecked'} onPress={handleCheckbox} />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => { setHelpDialogVisible(false); handleImport() }}>OK</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal >
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
                    style={{ ...styles.tgb, backgroundColor: testNormalMode ? useTheme().colors.primaryContainer : useTheme().colors.secondaryContainer }}
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
        </View >
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
        height: 56,
        borderRadius: 15
    }
});