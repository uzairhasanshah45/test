import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    useColorScheme,
    View,
    FlatList,
    Image,
    Modal,
    TouchableOpacity
} from 'react-native';


export default function App() {

    const [search, setSearch] = useState('');
    const [usersData, setUsersData] = useState([]);
    const [forSearch, setForSearch] = useState([]);
    const [modalView, setModalView] = useState(false);
    const [specificUser, setSpecificUser] = useState({})


    useEffect(() => {
        fetch('https://api.github.com/users')
            .then((response) => response.json())
            .then((responseJson) => {
                setUsersData(responseJson);
                setForSearch(responseJson);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const searchFilterFunction = (text) => {
        if (text) {
            const newData = forSearch.filter(
                function (item) {
                    const itemData = item.login
                        ? item.login.toUpperCase()
                        : ''.toUpperCase();
                    const textData = text.toUpperCase();
                    return itemData.indexOf(textData) > -1;
                });
                setUsersData(newData);
            setSearch(text);
        } else {

            setUsersData(forSearch);
            setSearch(text);
        }
    };


    const List = ({ item }) => {
        return (
            <View style={{ flexDirection: 'row' }} >
                <Image source={{ uri: item.avatar_url }} style={{ height: 40, width: 40 }} />
                <Text style={styles.itemStyle} onPress={() => { getItem(item), setModalView(true) }}> {item.login.toUpperCase()} , {item.url} </Text>
            </View >
        );
    };


    const getItem = (item) => {

        fetch(`https://api.github.com/users/${item.login}`)
            .then((response) => response.json())
            .then((json) => {
                setSpecificUser({ followers: json.followers, following: json.following, pic: json.avatar_url, location: json.location, name: json.name })
            })
            .catch((error) => {
                console.error(error);
            });
        
    };


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <TextInput
                    style={styles.textInputStyle}
                    onChangeText={(text) => searchFilterFunction(text)}
                    value={search}
                    underlineColorAndroid="transparent"
                    placeholder="Search Here"
                />
                <FlatList
                    data={usersData}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={List}
                />

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalView}
                    onRequestClose={() => setModalView(false)}>
                    <View style={[styles.container1, styles.modalBackgroundStyle]}>
                        <View style={styles.modalView}>
                            <View>
                                <Text style={{ fontSize: 18, marginVertical: 20}}>FOLLOWERS : {specificUser.followers}</Text>
                                <Text style={{ fontSize: 18, marginVertical: 20}}>FOLLOWING : {specificUser.following}</Text>
                                <View style={{ flexDirection: 'row', marginVertical: 20}}>
                                    <Text style={{ fontSize: 18}}>PROFILE PIC : {specificUser.following}</Text>
                                    <Image source={{ uri: specificUser.pic }} style={{ height: 40, width: 40 }} />
                                </View>
                                <Text style={{ fontSize: 18, marginVertical: 20}}>LOCATION :{specificUser.location}</Text>
                                <Text style={{ fontSize: 18, marginVertical: 20}}>NAME : {specificUser.name}</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.openButton}
                                onPress={() => setModalView(false)}>
                                <Text style={styles.textStyle}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    },
    itemStyle: {
        padding: 10,
    },
    textInputStyle: {
        height: 40,
        borderWidth: 1,
        paddingLeft: 20,
        margin: 5,
        borderColor: '#009688',
        backgroundColor: '#FFFFFF',
    },
    container1: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: "center",
        width: null,
        height: null,
    },
    modalBackgroundStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        backgroundColor: 'white',
        width: 300,
        height: 450,
        borderRadius: 20,
        padding: 30,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        alignItems: "center",
    },
    openButton: {
        backgroundColor: '#61a5c2',
        borderRadius: 10,
        height: 30,
        width: 100,
        elevation: 5,
        marginTop: 20
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 5
    },
});
