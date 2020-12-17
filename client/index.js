import React, { Component } from 'react';
import { AppRegistry, Environment, StyleSheet, Text, View, VrButton } from 'react-360';
import io from 'socket.io-client';

// If app fails to start try the fix here: https://github.com/facebook/react-360/issues/802

class Background extends Component {
	constructor(props) {
		super();
		Environment.setBackgroundImage(props.uri, { format: props.format });
	}
	componentDidUpdate() {
		Environment.setBackgroundImage(this.props.uri, { format: this.props.format });
	}

	render() {
		return null;
	}
}

export default class Slideshow extends Component {
	state = {
		photos  : [],
		index   : 0,
		emitted : false
	};

	prevPhoto = () => {
		let next = this.state.index - 1;
		if (next < 0) {
			next += this.state.photos.length;
		}
		this.setState({
			index : next
		});
	};

	nextPhoto = () => {
		this.setState({
			index : this.state.index + 1
		});
	};

	setPhotos = (files) => {
		this.setState({
			photos : files
		});
	};

	render() {
		const socket = io('https://chapelzill.herokuapp.com');

		socket.on('connect', () => {
			if (!this.state.emitted) {
				socket.emit('vrConnected', Math.floor(Math.random() * 1000000));
				this.setState({ emitted: true });
			}
		});

		socket.on('files', (files) => {
			this.setPhotos(files);
		});

		const current = this.state.photos[this.state.index % this.state.photos.length];

		return this.state.photos.length === 0 ? null : (
			<View style={styles.wrapper}>
				<Background uri={current.uri} format={current.format} />
				<View style={styles.controls}>
					<VrButton onClick={this.prevPhoto} style={styles.button}>
						<Text style={styles.buttonText}>{'<'}</Text>
					</VrButton>
					<View>
						<Text style={styles.title}>{current.title}</Text>
					</View>
					<VrButton onClick={this.nextPhoto} style={styles.button}>
						<Text style={styles.buttonText}>{'>'}</Text>
					</VrButton>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	wrapper    : {
		flexDirection  : 'row',
		alignItems     : 'center',
		justifyContent : 'center',
		height         : 600,
		width          : 1000
	},
	controls   : {
		backgroundColor : 'rgba(0, 0, 0, 0.7)',
		flexDirection   : 'row',
		justifyContent  : 'space-between',
		alignItems      : 'center',
		width           : 600,
		padding         : 10
	},
	title      : {
		color      : '#ffffff',
		textAlign  : 'left',
		fontSize   : 36,
		fontWeight : 'bold'
	},
	button     : {
		backgroundColor : '#c0c0d0',
		borderRadius    : 5,
		width           : 40,
		height          : 44
	},
	buttonText : {
		textAlign  : 'center',
		color      : '#000000',
		fontSize   : 30,
		fontWeight : 'bold'
	},
	TitleText  : {
		textAlign  : 'center',
		color      : '#ffffff',
		fontSize   : 34,
		fontWeight : 'bold'
	}
});

AppRegistry.registerComponent('Slideshow', () => Slideshow);
