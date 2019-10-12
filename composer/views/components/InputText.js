import React, { Component } from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native'
import { LayoutConst } from '../../system/Collection';
import PropTypes from 'prop-types';

type Props = {
    hasRef?: () => void
};

export default class InputText extends React.Component<TextInputProps, Props> {

    constructor(props) {
        super(props)

    }

    componentDidMount() {
        if (this.props.hasRef != null) this.props.hasRef(this);
    }

    onSubmitEditing() {
        this.props.onSubmitEditing();
    }

    focus() {
        this.inputRef.focus()
    }

    render() {
        return <TextInput
            {...this.props}
            ref={ref => (this.inputRef = ref)}
            style={[styles(this.props).container, this.props.style]}
            placeholder={this.props.placeholder}
            onSubmitEditing={this.onSubmitEditing.bind(this)} />
    }
}

InputText.propTypes = {
    background: PropTypes.string
}

const styles = (props) => StyleSheet.create({
    container: {
        backgroundColor: props.background,
        padding: LayoutConst.smallSpacing,
        borderRadius: LayoutConst.roundedCorner,
        fontFamily: 'OpenSans-Regular'
    }
})
