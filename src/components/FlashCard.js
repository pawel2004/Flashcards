import { useState } from "react";
import { StyleSheet, ToastAndroid } from "react-native";
import { Card, Divider, IconButton, Text, TextInput } from "react-native-paper";
import Database from "../services/Database";

export default FlashCard = ({ flashId, front, rear, openDialog }) => {

    const [editMode, setEditMode] = useState(false);
    const [editedFront, setEditedFront] = useState(front);
    const [editedRear, setEditedRear] = useState(rear);

    const handleEdit = async () => {
        try {
            await Database.editFlashCard(flashId, editedFront, editedRear);
            setEditMode(false);
        } catch (err) {
            ToastAndroid.showWithGravity(
                'An error occured!',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM
            );
        }
    }

    return (
        <Card style={styles.container}>
            <Card.Content style={styles.cc}>
                {editMode ?
                    <TextInput label={'Front'} defaultValue={front} onChangeText={(text) => setEditedFront(text)} />
                    :
                    <Text variant="titleMedium">{front}</Text>
                }
                <Divider />
                {editMode ?
                    <TextInput label={'Rear'} defaultValue={rear} onChangeText={(text) => setEditedRear(text)} />
                    :
                    <Text variant="titleMedium">{rear}</Text>
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
                    <IconButton icon="delete" onPress={() => openDialog(flashId)} />
                }
            </Card.Actions>
        </Card>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10
    },
    cc: {
        gap: 10
    }
});