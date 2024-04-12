import { useState } from "react";
import { StyleSheet, ToastAndroid } from "react-native";
import { Card, IconButton, Text, TextInput, HelperText } from "react-native-paper";
import Database from "../services/Database";

export default DeckCard = ({ deckId, deckName, openDialog, setDecksArray, navigation }) => {

    const [editMode, setEditMode] = useState(false);
    const [editedName, setEditedName] = useState(deckName);

    const nameRequired = () => {
        return editedName === '';
    }

    const handleEdit = async () => {
        if (editedName !== '') {
            try {
                await Database.editDeck(deckId, editedName);
                setDecksArray((decksArray) => decksArray.map((v) => {
                    if (v.DeckId === deckId)
                        v.Name = editedName;
                    return v;
                }));
                setEditMode(false);
            } catch (err) {
                ToastAndroid.showWithGravity(
                    'An error occured!',
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM
                );
            }
        }
    }

    return (
        <Card style={styles.container} onPress={
            () => navigation.navigate('FlashCards', { deckId: deckId, deckName: deckName })
        }>
            <Card.Content>
                {editMode ?
                    <TextInput label={'Name'} defaultValue={deckName} maxLength={255} onChangeText={(text) => setEditedName(text)} />
                    :
                    <Text variant="titleMedium">{deckName}</Text>
                }
                {editMode ?
                    <HelperText type="error" visible={nameRequired()}>
                        Name required!
                    </HelperText>
                    : null
                }
            </Card.Content>
            <Card.Actions>
                {editMode ?
                    <IconButton icon="check" onPress={handleEdit} />
                    :
                    <IconButton icon="pencil" onPress={() => setEditMode(true)} />
                }
                {editMode ?
                    <IconButton icon="cancel" onPress={() => setEditMode(false)} />
                    :
                    <IconButton icon="delete" onPress={() => openDialog(deckId)} />
                }
            </Card.Actions>
        </Card>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10
    }
});