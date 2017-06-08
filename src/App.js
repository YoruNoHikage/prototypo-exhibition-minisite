import React, { Component } from 'react';
import './App.css';

class Shell extends Component {
  render() {
    return (
      <div className="App">
        <span className="Logo" />
        <App />
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: false,
      loading: false,
      registered: false,
      counter: 0,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.decrementCounter = this.decrementCounter.bind(this);
  }

  decrementCounter(callback) {
    return setTimeout(() => {
      if (this.state.counter <= 0) {
        this.setState({ counter: 0 });
        return callback();
      }

      this.setState(({ counter }) => ({ counter: counter - 1 }));

      this.decrementCounter(callback);
    }, 1000);
  }

  async handleSubmit(e) {
    e.preventDefault();

    this.setState({ loading: true });

    const email = e.target.email.value.toLowerCase();

    const emails = JSON.parse(localStorage.getItem('emails')) || [];
    localStorage.setItem('emails', JSON.stringify(emails.concat(email)));

    const AWS = process.env.NODE_ENV === 'production'
      ? 'e4jpj60rk8'
      : 'tc1b6vq6o8';
    const env = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';
    const URL = `https://${AWS}.execute-api.eu-west-1.amazonaws.com/${env}/coupons/create`;
    const parameters = {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    };

    const response = await fetch(URL, parameters);

    if (!response.ok) {
      // try again
      const response2 = await fetch(URL, parameters);

      if (!response2.ok) {
        // give up
        this.setState({ error: true, loading: false });
      }
    }

    this.setState({
      loading: false,
      registered: true,
      counter: 10,
    });

    this.decrementCounter(() => this.setState({ registered: false }));
  }

  render() {
    if (this.state.error) {
      return (
        <div className="Card">
          <div className="Card-header">
            <p className="Card-title">Oups !</p>
            <p className="Card-subtitle">Un truc s'est mal passé...</p>
          </div>
          <button onClick={() => location.reload()} className="Button">
            Recharger la page
          </button>
        </div>
      );
    }

    if (this.state.registered) {
      return (
        <div className="Card">
          <p className="Card-title">Merci !</p>
          <p className="Card-subtitle">Profitez bien des Yellow Vibes !</p>
          <p>Rafraichissement dans {this.state.counter} secondes</p>
          <div
            style={{
              paddingBottom: '56%',
              position: 'relative',
              textAlign: 'left',
              marginTop: '20px',
            }}
          >
            <iframe
              src="//giphy.com/embed/fLK0eUlYZoB6E"
              style={{ position: 'absolute' }}
              className="giphy-embed"
              allowFullScreen
              width="100%"
              height="100%"
              frameBorder={0}
            />
          </div>
        </div>
      );
    }

    if (this.state.loading) {
      return (
        <div className="Card Card--loader">
          <div className="Loader">
            <div className="Spinner">
              <div className="Spinner-element Spinner-element--1" />
              <div className="Spinner-element Spinner-element--2" />
              <div className="Spinner-element Spinner-element--3" />
              <div className="Spinner-element Spinner-element--4" />
              <div className="Spinner-element Spinner-element--5" />
            </div>
            <p className="Loader-text">Fabrication d'un super coupon !</p>
          </div>
        </div>
      );
    }

    return (
      <div className="Card">
        <div className="Card-header">
          <p className="Card-title">
            Recevez 30% de remise
          </p>
          <p className="Card-subtitle">
            en vous inscrivant à la newsletter !
          </p>
        </div>
        <form className="RegisterForm" onSubmit={this.handleSubmit}>
          <input
            className="RegisterForm-input"
            type="email"
            name="email"
            placeholder="john.doe@example.com"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
          />
          <button className="Button">Recevoir mon coupon</button>
        </form>
      </div>
    );
  }
}

export default Shell;
