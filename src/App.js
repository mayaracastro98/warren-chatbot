import React, { Component } from 'react';
import './App.scss';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
		}
	}

	render() {
		return (
			<div className="App">
				<header className="header">
					<p>
						Warren Chatbot
          			</p>
				</header>
			</div>
		);
	}
}

export default App;
