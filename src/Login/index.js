import React, { Component } from 'react';
import { Form, Label, Button, Message, Header, Icon, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class Login extends Component {
  constructor() {
    super();

    this.state = {
      email: '',
      password: ''
    }
  }

  // Handling of form value change
  handleChange = (e) => {
    e.preventDefault();
    this.setState({
      [e.currentTarget.name]: e.currentTarget.value
    })
  }
  
  // Submission of login form
  handleSubmit = async (e) => {
    e.preventDefault();
    const loginUrl = `${process.env.REACT_APP_API_URL}/api/v1/user/login`; // localhost:8000/api/v1/user/register
    const loginResponse = await fetch(loginUrl, {
      method: 'POST',
      body: JSON.stringify(this.state),
      credentials: 'include', // Send a session cookie along with our request
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const parsedResponse = await  loginResponse.json();
  
    if (parsedResponse.status.code === 200) {
      console.log('Sign up successful');
      console.log(parsedResponse.data.id, 'userId');
      sessionStorage.clear();
      sessionStorage.setItem('sessionUserId', parsedResponse.data.id);
      this.props.history.push('/meals'); // Change url to /dogs programmatically with react-router
    } else {
      // Else display error message to the user
      this.setState({
        errorMsg: parsedResponse.status.message
      });
    }
  }

  render() {
    return (
      <div>
        <Header>
          <Segment style={{backgroundColor: '#339966', height: '60px'}}>
            <h1 className='appTitle'><Icon name='heart'/>Eat Smart</h1>
          </Segment>
        </Header>
        <div className='signUpForm'>
          <Form onSubmit={this.handleSubmit}>
            <h4>Login To Exisitng User</h4>
            <Icon style={{margin: '0 5px'}} className="signUpIcon" name='mail'>Email</Icon>
            <Form.Input style={{margin: '10px 0'}} type="email" name="email" placeholder='Email' onChange={this.handleChange} required />
            <Icon style={{margin: '0 5px'}} className="signUpIcon" name='lock'>Password</Icon>
            <Form.Input style={{margin: '10px 0'}} type="password" name="password" placeholder='Password' onChange={this.handleChange} required />
            <Button style={{margin: '10px 0'}} type="submit" color="green">Sign In</Button><br/>
            { this.state.errorMsg ? <Message negative>{this.state.errorMsg}</Message> : null }
            <Link to='/'>Register New Account Here</Link>
          </Form>
        </div>
      </div>
    )
  }
}

export default Login;
