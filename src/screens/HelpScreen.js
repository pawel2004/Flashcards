import { FlatList, StatusBar, StyleSheet, View, Image } from "react-native";
import { Portal, Dialog, Text } from "react-native-paper";
import HelpTopic from "../components/HelpTopic";
import { useState } from "react";

export default HelpScreen = ({ navigation }) => {

    const helpTopics = [
        {
            title: 'Import',
            content:
                <Dialog.Content>
                    <Text>1. Imported file must be in CSV format</Text>
                    <Text>2. It shouldn't have a header row</Text>
                    <Text>3. It should have two columns in each record(semicolon delimiter recommended)</Text>
                    <Text>4. Data should be placed consistently. For example, the front side of a flashcard is in the first column, and the rear side is in the second</Text>
                </Dialog.Content>
        },
        {
            title: 'Export',
            content:
                <Dialog.Content>
                    <Text>It works only for Android 11+</Text>
                </Dialog.Content>
        }
    ];

    const [currentTopic, setCurrentTopic] = useState(0);
    const [dialogVisible, setDialogVisible] = useState(false);

    const openTopic = (id) => {
        setCurrentTopic(id);
        setDialogVisible(true);
    }

    return (
        <View style={styles.container}>
            <StatusBar style="auto"></StatusBar>
            <Portal>
                <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
                    <Dialog.Title>{helpTopics[currentTopic].title}</Dialog.Title>
                    {helpTopics[currentTopic].content}
                </Dialog>
            </Portal>
            <FlatList
                data={helpTopics}
                renderItem={(e) => <HelpTopic key={e.index} id={e.index} title={e.item.title} openTopic={openTopic} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});