import React from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { Container, Form, Grid, Header, Message } from 'semantic-ui-react';
import { Accounts } from 'meteor/accounts-base';

/**
 * Signup component is similar to signin component, but we create a new user instead.
 */
class Signup extends React.Component {
  /* Initialize state fields. */
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      employeeID: '',
      password: '',
      confirmPassword: '',
      error: '',
      redirectToReferer: false,
    };
  }

  /* Update the form controls each time the user interacts with them. */
  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  }

  /* Handle Signup submission. Create user account and a profile entry, then redirect to the home page. */
  submit = () => {
    const { firstName, lastName, email, employeeID, password, confirmPassword } = this.state;
    if (password !== confirmPassword) {
      this.setState({ error: 'The passwords do not match.  Please try again.' });
    } else {
      Accounts.createUser({ firstName, lastName, email, employeeID, username: email, password }, (err) => {
        if (err) {
          this.setState({ error: err.reason });
        } else {
          this.setState({ error: '', redirectToReferer: true });
        }
      });
    }
  }

  /* Display the signup form. Redirect to add page after successful registration and login. */
  render() {
    const { from } = this.props.location.state || { from: { pathname: '/home' } };
    // if correct authentication, redirect to from: page instead of signup screen
    if (this.state.redirectToReferer) {
      return <Redirect to={from}/>;
    }
    return (
      <Container id="signup-page">
        <div className="ui grid">
          <Grid.Column>
            <Header as="h2" textAlign="center">SIGN UP</Header>
            <Form onSubmit={this.submit}>
              <div className="equal width fields">
                <div className="field">
                  <Form.Input
                    label="First Name"
                    id="signup-form-firstName"
                    icon="user"
                    iconPosition="left"
                    name="firstName"
                    placeholder="First Name"
                    type="firstName"
                    onChange={this.handleChange} required />
                </div>
                <div className="field">
                  <Form.Input
                    label="Last Name"
                    id="signup-form-lastName"
                    icon="user"
                    iconPosition="left"
                    name="lastName"
                    placeholder="Last Name"
                    type="lastName"
                    onChange={this.handleChange} required />
                </div>
              </div>
              <div className="equal width fields">
                <div className="field">
                  <Form.Input
                    label="Email"
                    id="signup-form-email"
                    icon="envelope"
                    iconPosition="left"
                    name="email"
                    type="email"
                    placeholder="E-mail address"
                    onChange={this.handleChange} required/>
                </div>
                <div className="field">
                  <Form.Input
                    label="Employee ID"
                    id="signup-form-id"
                    name="employeeID"
                    type="employeeID"
                    placeholder="Employee ID"
                    onChange={this.handleChange} required/>
                </div>
              </div>
              <div className="equal width fields">
                <div className="field">
                  <Form.Input
                    label="Password"
                    id="signup-form-password"
                    icon="lock"
                    iconPosition="left"
                    name="password"
                    placeholder="Password"
                    type="password"
                    onChange={this.handleChange} required/>
                </div>
                <div className="field">
                  <Form.Input
                    label="Confirm Password"
                    id="signup-form-confirmPassword"
                    icon="lock"
                    iconPosition="left"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    type="password"
                    onChange={this.handleChange} required/>
                </div>
              </div>
              <Form.Button id="signup-form-submit" content="SUBMIT"/>
              <div className="message">
                Already have an account? Login <Link to="/signin" className="link">here</Link>
              </div>
            </Form>
            {this.state.error === '' ? (
              ''
            ) : (
              <Message
                error
                header="Registration was not successful"
                content={this.state.error}
              />
            )}
          </Grid.Column>
        </div>
      </Container>
    );
  }
}

/* Ensure that the React Router location object is available in case we need to redirect. */
Signup.propTypes = {
  location: PropTypes.object,
};

export default Signup;
