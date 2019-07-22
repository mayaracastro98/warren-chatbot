import React, { Component } from 'react';
import { Button, Form } from 'react-bootstrap'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,

			buttons: [],
			input: '',
			inputs: [],
			questionId: '',
			chatHistory: [],
			answers: {},
			questionType: ''
		}
	}

	initApi = () => {
		const body = {
			"context": "suitability"
		};

		axios.post(`https://dev-api.oiwarren.com/api/v2/conversation/message`, body)
			.then(res => {
				console.log(res.data);
				this.setState({ questionId: res.data.id, buttons: res.data.buttons, inputs: res.data.inputs });

				res.data.messages.forEach(message => {
					let chatHistory = this.state.chatHistory
					let _message = message.value.replace(/\^1000 |\^500 /g, '');

					chatHistory.push(_message);
					this.setState({ chatHistory: chatHistory });
				});
			})
	}

	componentDidMount() {
		this.initApi();
	}

	render() {
		return (
			<div className="App">
				<div className="body">
					{this.renderChat()}
					<div className="inputs">
						{this.renderAnswer()}
					</div>
				</div>
			</div>
		);
	}

	renderChat() {
		let chatHistory = this.state.chatHistory.map(message => {
			return (
				<p>
					{message}
				</p>
			)
		})
		return chatHistory;
	}

	renderAnswer() {
		if (this.state.buttons.length > 0) {
			let buttons = this.state.buttons.map(button => {
				return (
					<div style={{ padding: '1rem' }}>
						<Button onClick={() => {
							this.setState({ input: button.value }, () => {
								this.saveQuestion();
							})
						}}>{button.label.title}
						</Button>
					</div>
				)
			})
			return buttons;
		} else if (this.state.inputs.length > 0) {
			return (
				<div>
					<Form.Control value={this.state.input}
						onChange={(event) => { this.setState({ input: event.target.value }) }}
						type="text"
						placeholder="digite aqui..." />
					<Button onClick={this.saveQuestion}>Enviar</Button>
				</div>
			)
		}
	}

	saveQuestion = () => {
		let answers = this.state.answers;
		answers[`${this.state.questionId}`] = this.state.input;
		this.setState({ answers: answers, chatHistory: [] }, () => {
			console.log(this.state.answers);
		});
		const body = {
			context: "suitability",
			id: this.state.questionId,
			answers: this.state.answers
		}
		axios.post(`https://dev-api.oiwarren.com/api/v2/conversation/message`, body)
			.then(res => {
				console.log(res.data);
				this.setState({ questionId: res.data.id, buttons: res.data.buttons, inputs: res.data.inputs });

				res.data.messages.forEach(message => {
					let chatHistory = this.state.chatHistory
					let _message = message.value.replace(/\^1000 |\^500 |\^1000|\^500|\^300 |\^300|<erase>/g, '');

					chatHistory.push(_message);
					this.setState({ chatHistory: chatHistory });
				});
			})
		this.setState({ input: '' });
		if (this.state.questionId === 'question_email') {
			const finalBody = {
				answers: this.state.answers
			}
			axios.post(`https://dev-api.oiwarren.com/api/v2/suitability/finish`, finalBody)
				.then(res => {
					console.log(res)
				})
		}
	}
}

export default App;
