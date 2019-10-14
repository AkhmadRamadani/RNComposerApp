import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    Image,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView, Keyboard,
} from 'react-native';
import { connect } from 'react-redux';
import { Color, LayoutConst } from '../../system/Collection';
import InputText from '../components/InputText';
import Button from '../components/Button';
import ImagePicker from 'react-native-image-picker';
import ImageCrop from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';

const { width, height } = Dimensions.get('window');


class CreatePage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataCategory: [
                {
                    category: 'Snack',
                },
                {
                    category: 'Food',
                },
                {
                    category: 'Drink',
                },
            ],
            image: null,
            expand: false,
            value: 'Select Category',
            modalVisibility: false,
            newCategory: '',
            compositionName: '',
            description: '',
            dropdownIndex: 0,
        };
        this.inputs = {};
        this.focusNextField = this.focusNextField.bind(this);

    }

    _modalAction = () => {
        this.setState({ modalVisibility: !this.state.modalVisibility });
    };

    _imagePicker = () => {
        ImagePicker.showImagePicker(image => {
            if (image.didCancel) {
                console.log('User cancelled image picker');
            } else if (image.error) {
                console.log('ImagePicker Error: ', image.error);
            } else {
                ImageCrop.openCropper({
                    path: `file://${image.path}`,
                    width: 480,
                    height: 480,
                    cropping: true,
                }).then(img => this.setState({ image: img.path })).catch(e => console.log(e.message));
            }
        });
    };

    focusNextField(id) {
        this.inputs[id].focus();
    }

    render() {
        return (
            <View style={styles().container}>

                {/* Modal */}

                <Modal
                    isVisible={this.state.modalVisibility}
                    onBackButtonPress={this._modalAction}
                    onBackdropPress={this._modalAction}
                >
                    <View style={styles().modal}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text
                                style={{
                                    color: Color.BLACK,
                                    fontSize: 16,
                                    fontFamily: 'Rubik-Bold',
                                    marginBottom: LayoutConst.regularSpacing,
                                }}
                                children="Add New Category"
                            />
                            <TouchableOpacity onPress={() => this._modalAction()}>
                                <Image style={styles().icon} source={require('../../assets/images/close.png')}/>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                <InputText
                                    placeholder={'Category name'}
                                    returnKeyType="next"
                                    background={Color.LIGHT_GREY}
                                    style={{ borderWidth: 1, borderColor: Color.COLOR_PRIMARY, minWidth: 190 }}
                                />

                            </View>

                            <Button value="Save"/>

                        </View>
                    </View>

                </Modal>

                {/* End of Modal */}

                {/* Main View */}

                <KeyboardAvoidingView style={{ flex: 1 }} behavior={'padding'} enabled>

                    <View style={{ alignItems: 'center', marginVertical: 20, width: '100%' }}>

                        <TouchableOpacity onPress={() => this._imagePicker()}>
                            <View style={styles().imageContainer}>
                                {
                                    this.state.image === null ?
                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            <Image source={require('../../assets/images/plus-dark.png')}/>
                                            <Text
                                                style={{
                                                    textAlign: 'center',
                                                    fontSize: 20,
                                                    fontFamily: 'Rubik-Bold',
                                                    color: '#444',
                                                }}
                                                children="Composition Image"
                                            />
                                        </View> :
                                        <Image style={{ flex: 1, borderRadius: 14 }}
                                               source={{ uri: this.state.image }}/>
                                }
                            </View>
                        </TouchableOpacity>

                    </View>

                    <InputText
                        placeholder={'Composition Name'}
                        placeholderTextColor={Color.GREY}
                        returnKeyType="next"
                        background={Color.LIGHT_GREY}
                        style={styles().textInput}
                        onSubmitEditing={() => {
                            this.focusNextField('description');
                        }}
                        onChangeText={(text) => this.setState({ compositionName: text })}
                    />

                    <InputText
                        hasRef={(ref) => {
                            this.inputs['description'] = ref;
                        }}
                        placeholder={'Description (optional)'}
                        placeholderTextColor={Color.GREY}
                        background={Color.LIGHT_GREY}
                        style={styles().textInput}
                        onChangeText={(text) => this.setState({ description: text })}
                        onSubmitEditing={Keyboard.dismiss}
                    />

                    {/* Dropdown */}

                    <View>
                        <TouchableOpacity
                            style={[this.props.style, dropdownStyles(this.state.expand).container, { alignItems: 'stretch' }]}
                            onPress={() => this.setState({
                                expand: !this.state.expand,
                            })}>

                            <Text
                                style={[dropdownStyles().buttonText, { fontFamily: 'OpenSans-SemiBold' }]}>{this.state.value}</Text>

                            <TouchableOpacity
                                onPress={() => this.setState({
                                    expand: !this.state.expand,
                                })}>
                                {
                                    this.state.expand === false ?
                                        <Image
                                            style={[dropdownStyles().rightIcon]}
                                            source={require('../../assets/images/dropdown.png')}
                                            resizeMode="center"/>
                                        :
                                        <Image
                                            style={dropdownStyles().rightIcon}
                                            source={require('../../assets/images/collapse.png')}
                                            resizeMode="center"/>
                                }
                            </TouchableOpacity>

                        </TouchableOpacity>
                        {
                            this.state.expand === true ?
                                <View style={[dropdownStyles(this.state.expand).expandContainer, {}]}>
                                    <FlatList
                                        data={this.state.dataCategory}
                                        renderItem={({ item, index }) =>
                                            <TouchableOpacity onPress={() => this.setState({
                                                expand: !this.state.expand,
                                                value: item.category,
                                                dropdownIndex: index.toString(),
                                            })}>

                                                <Text style={dropdownStyles().buttonText}>{item.category}</Text>

                                            </TouchableOpacity>
                                        }
                                        keyExtractor={(item, index) => index.toString()}
                                    />

                                    <View style={{ marginTop: LayoutConst.spacing }}>
                                        <TouchableOpacity style={{ flexDirection: 'row' }}
                                                          onPress={() => this._modalAction()}>
                                            <Image
                                                style={dropdownStyles().leftIcon}
                                                source={require('../../assets/images/plus-gold.png')}
                                                resizeMode="center"/>

                                            <Text style={[dropdownStyles().buttonText, { color: Color.COLOR_PRIMARY }]}>Add
                                                New Category</Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>
                                :
                                <View/>
                        }
                    </View>

                    {/* End of Dropdown */}

                    {/* Button Next */}

                    {/* <View style={{width: '100%' , minHeight: width/2, alignItems:'flex-end'}}> */}

                    <Button
                        onPress={() => this.props.navigation.navigate("AddMaterialPage")}
                        backgroundColor={
                            this.state.compositionName === '' || null || this.state.description === '' || null || this.state.dropdownIndex === 0 || null ?
                                Color.LIGHT_GREY :
                                Color.COLOR_PRIMARY
                        }
                        style={{ position: 'absolute', width: 100, bottom: 40, right: 20 }}
                        value={'Next'}
                    />

                    {/* </View> */}

                </KeyboardAvoidingView>

            </View>
        );
    }

}

const styles = props => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.WHITE,
        paddingHorizontal: LayoutConst.spacing,
    },
    imageContainer: {
        width: width / 2.5,
        height: width / 2.5,
        backgroundColor: Color.LIGHT_GREY,
        borderRadius: 14,
    },
    modal: {
        height: 120,
        backgroundColor: 'white',
        padding: LayoutConst.spacing,
        borderRadius: LayoutConst.roundedCorner,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    icon: {
        width: 15,
        height: 15,
    },
    textInput: {
        marginBottom: LayoutConst.spacing,
        color: Color.BLACK,
    },
});

const dropdownStyles = (props) => StyleSheet.create({
    container: {
        backgroundColor: Color.LIGHT_GREY,
        padding: LayoutConst.smallSpacing,
        paddingBottom: props === false ? LayoutConst.smallSpacing : 0,
        borderRadius: props === false ? 6 : 6,
        borderBottomStartRadius: props === false ? 6 : 0,
        borderBottomEndRadius: props === false ? 6 : 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    expandContainer: {
        backgroundColor: Color.LIGHT_GREY,
        padding: LayoutConst.smallSpacing,
        paddingTop: 0,
        borderRadius: 6,
        borderTopStartRadius: 0,
        borderTopEndRadius: 0,
    },
    rightIcon: {
        right: 0,
        top: 2,
        marginLeft: 20,
        width: 14,
        height: 14,
    },
    leftIcon: {
        left: 0,
        top: 2,
        marginRight: 5,
        width: 14,
        height: 14,
    },
    buttonText: {
        fontFamily: 'OpenSans-Regular',
        fontSize: LayoutConst.smallTextSize,
        color: Color.DARK_GREY,
    },
});

export default connect()(CreatePage);
