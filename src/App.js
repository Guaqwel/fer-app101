import React, { Component } from 'react';
import logo from './ferFace.png';
import './App.css';
import './respuestasList.js';
import TestsLogs from './tests.js';
// import 'skeleton-css';
import './css/skeleton.css'
var axios = require('axios');


class App extends Component {
  constructor (props) {
    super(props);
    console.log(this.props)
    this.state = {
      text:'',
      number: '',
      logs:[],
      statusColor: null
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleNumberChange = this.handleNumberChange.bind(this);
    this.createCORSRequest =this.createCORSRequest.bind(this);
    this.getTitle = this.getTitle.bind(this);
    this.makeCorsRequest =  this.makeCorsRequest.bind(this);
  }
  createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // XDomainRequest for IE.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported.
    xhr = null;
  }
  console.info(xhr)
  return xhr;
}

// Helper method to parse the title tag from the response.
 getTitle(text) {
  return text.match('<title>(.*)?</title>')[1];
}

// Make the actual CORS request.
 makeCorsRequest() {
  // This is a sample server that supports CORS.
  var url = 'https://glacial-plateau-98876.herokuapp.com/sms';

  var xhr = this.createCORSRequest('POST', url);
  console.info('Clish')

  if (!xhr) {
    alert('CORS not supported');
    return;
  }

  // Response handlers.
  console.info('Clish 1.2')

  xhr.onload = () => {
    console.info('Clish 2')

    var text = xhr.responseText;
    var title = this.getTitle(text);
    alert('Response from CORS request to ' + url + ': ' + title);
  };

  xhr.onerror = function() {
    alert('Woops, there was an error making the request.');
  };

  xhr.send();
}

  handleTextChange(evt) {
   this.setState({text: evt.target.value});
 }

 handleNumberChange (evt) {
   this.setState({number: evt.target.value});
 }

  handleSubmit (evt) {
    evt.preventDefault();
    let msgText = this.state.text;
    let telNumber = this.state.number;
    let tel = telNumber.toString();
    // this.createCORSRequest();
    // this.makeCorsRequest();

    axios({
      method: 'POST',
      url: 'https://glacial-plateau-98876.herokuapp.com/sms',
      headers: {
        'Content-Type': 'Apliccation/json',
      },
      data: {
        to: telNumber.toString(),
        body: msgText,
      },
      withCredentials: true,
       responseType: 'json'
    })
    .then((response) => {
          console.log(response);
          let newItem = {
            text: msgText,
            number: telNumber,
            date: response.data.date_sent,
            id: response.data.date_sent,
            status: response.data.status,
          };
          this.setState((prevState) => ({
            logs: prevState.logs.concat(newItem),
            text: '',
            number: '',
            statusColor: true
          }));
        }).catch((error) => {
          console.log(error);
          let newItemError = {
              id: Date.now(),
              status: 'Not a valid or register number'
          }
          this.setState((prevState) => ({
            logs: prevState.logs.concat(newItemError  ),
            text: '',
            number: '',
            statusColor: false
          }));
      });
  }

  render() {
    return (
      <div className="App ">
        <div className="App-header">
          <img src={logo} className="App-logo img-logo-fer" alt="logo" />
          <h3 className="head-title">Welcome to The Fern App for Messages</h3>
        </div>
        <div className='container'>
          <form className="form" onSubmit={this.handleSubmit}>
            <div className="row" style={{marginTop: 2 +'rem'}}>
              <div className="">
                <label> Tel </label>
                <input type="number" className="input-text" onChange={this.handleNumberChange} placeholder="📞 Number" value={this.state.number}></input>
              </div>
          </div>
          <div className="row">
            <div className="">
              <label> Text </label>
              <textarea type="text" className="input-text textTarea-box" onChange={this.handleTextChange} placeholder="Please type your text 🤖" value={this.state.text} />
            </div>
          </div>
            <input type="submit" value="Send"></input>
          </form>
        </div>
        <div className='container'>
          {this.state.logs.length > 0 && <TestsLogs items={this.state.logs} />}
        </div>
      </div>
    );
  }
}


App.propTypes = {
  // You can declare that a prop is a specific JS primitive. By default, these
  // are all optional.
  items: React.PropTypes.array
}

export default App;

//To-do:

// Creat custom input component
//
// {
//   "to": telNumber.toString(),
//   "body": msgText,
//   "Access-Control-Allow-Origin": '*',
//   withCredentials: true,
//   'Content-Type': 'application/jso'
// },
// {
//
//   // 'Content-Type': 'application/json'
// },
// {}
