import { StyleSheet } from "react-native";
import { Icon, Text, Card } from "react-native-paper";

export default HelpTopic = ({ id, title, openTopic }) => {

    return (
        <Card style={styles.container} onPress={() => openTopic(id)}>
            <Card.Content style={styles.cc}>
                <Text variant="bodyLarge">{title}</Text>
                <Icon source={'chevron-right'} size={20} />
            </Card.Content>
        </Card >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10
    },
    cc: {
        gap: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
});