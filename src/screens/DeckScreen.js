import { View, StyleSheet, FlatList, ToastAndroid } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from "react";
import { getDecks, addDeck, deleteDeck } from "../services/Database";
import { Button, Dialog, FAB, HelperText, Portal, TextInput, Text } from "react-native-paper";
import DeckCard from "../components/DeckCard";

export default DeckScreen = ({ navigation }) => {

    const [decksArray, setDecksArray] = useState([]);
    const [addDialogVisible, setAddDialogVisible] = useState(false);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [deckNameInputText, setDeckNameInputText] = useState('');
    const [deckIdToDelete, setDeckIdToDelete] = useState('');
    const [addButtonVisible, setAddButtonVisible] = useState(true);
    const [editDecksCount, setEditDecksCount] = useState(0);

    useEffect(() => {
        const getDecksFunc = async () => {
            try {
                const decks = await getDecks();
                setDecksArray(decks);
            } catch (err) {

            }
        };
        getDecksFunc();
    }, []);

    const nameRequired = () => {
        return deckNameInputText === '';
    }

    const handleDeckAdd = async () => {
        if (deckNameInputText !== '') {
            try {
                const newId = await addDeck(deckNameInputText);
                setDecksArray([...decksArray, {
                    DeckId: newId,
                    Name: deckNameInputText
                }])
                setDeckNameInputText('');
                setAddDialogVisible(false);
            } catch (err) {
                ToastAndroid.showWithGravity(
                    'An error occured!',
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM
                );
            }
        }
    }

    const handleDeckDelete = async () => {
        try {
            await deleteDeck(deckIdToDelete);
            setDecksArray((curr) => curr.filter((v) => v.DeckId !== deckIdToDelete));
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

    const openDeleteDialog = (deckId) => {
        setDeckIdToDelete(deckId);
        setDeleteDialogVisible(true);
    };

    return (
        <View style={styles.container}>
            <StatusBar style="auto"></StatusBar>
            <Portal>
                <Dialog visible={addDialogVisible} onDismiss={() => setAddDialogVisible(false)}>
                    <Dialog.Icon icon='plus' />
                    <Dialog.Title>Add new deck</Dialog.Title>
                    <Dialog.Content>
                        <TextInput label={'Name'} maxLength={255} onChangeText={(text) => setDeckNameInputText(text)} />
                        <HelperText type="error" visible={nameRequired()}>
                            Name required!
                        </HelperText>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setAddDialogVisible(false)}>Cancel</Button>
                        <Button onPress={handleDeckAdd}>Add</Button>
                    </Dialog.Actions>
                </Dialog>
                <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
                    <Dialog.Icon icon='delete' />
                    <Dialog.Title>Delete deck</Dialog.Title>
                    <Dialog.Content>
                        <Text variant="bodyMedium">Do you want to delete deck?</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setDeleteDialogVisible(false)}>No</Button>
                        <Button onPress={handleDeckDelete}>Yes</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            <FlatList
                data={decksArray}
                renderItem={(dataPiece) => <DeckCard deckId={dataPiece.item.DeckId} deckName={dataPiece.item.Name} openDialog={openDeleteDialog} setDecksArray={setDecksArray} navigation={navigation} setAddButtonVisible={setAddButtonVisible} setEditDecksCount={setEditDecksCount} editDecksCount={editDecksCount} />}
                contentContainerStyle={styles.fl}
            />
            <FAB
                icon="plus"
                onPress={() => setAddDialogVisible(true)}
                visible={addButtonVisible}
                style={styles.fab}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    fab: {
        margin: 16,
        position: 'absolute',
        right: 0,
        bottom: 0
    },
    fl: {
        paddingBottom: 120
    }
});