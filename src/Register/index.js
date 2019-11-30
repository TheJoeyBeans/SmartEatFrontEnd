import React, { Component } from 'react';
import { Form, Label, Button, Message } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class Register extends Component {
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
  
  // Submission of register in form
  handleSubmit = async (e) => {
    e.preventDefault();
    const registrationUrl = `${process.env.REACT_APP_API_URL}/api/v1/user/register`; // localhost:8000/api/v1/user/register
    console.log(registrationUrl)
    const registerResponse = await fetch(registrationUrl, {
      method: 'POST',
      body: JSON.stringify(this.state),
      credentials: 'include', // Send a session cookie along with our request
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const parsedResponse = await registerResponse.json();
  
    if (parsedResponse.status.code === 201) {
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
      <div className='signUpForm'>
        <Form onSubmit={this.handleSubmit}>
          <Link to='/login'>Sign in here</Link>
          <h4>Register New User</h4>
          <Label>Email</Label>
          <Form.Input type="email" name="email" onChange={this.handleChange} required />
          <Label>Password</Label>
          <Form.Input type="password" name="password" onChange={this.handleChange} required />
          <Button type="submit" color="green">Sign Up</Button><br/>
          { this.state.errorMsg ? <Message negative>{this.state.errorMsg}</Message> : null }
        </Form>
      </div>
    )
  }
}

export default Register;