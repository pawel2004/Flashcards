import { Appbar, Menu } from "react-native-paper"
import { getHeaderTitle } from "@react-navigation/elements"
import { useState } from "react";

export default NavBar = ({ navigation, route, options, back, handleImport, handleExport }) => {
    const title = getHeaderTitle(options, route.name);
    const [visible, setVisible] = useState(false);
    return (
        <Appbar.Header>
            {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
            <Appbar.Content title={title} />
            {handleImport ? <Menu
                visible={visible}
                onDismiss={() => setVisible(false)}
                anchor={<Appbar.Action onPress={() => setVisible(true)} icon='dots-vertical' />}
                anchorPosition='bottom'>
                <Menu.Item leadingIcon='import' title='Import' onPress={() => { setVisible(false); handleImport() }} />
                <Menu.Item leadingIcon='export' title='Export' onPress={() => { setVisible(false); handleExport() }} />
            </Menu> : null}
        </Appbar.Header>
    )
}