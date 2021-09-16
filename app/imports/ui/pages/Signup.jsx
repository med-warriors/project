import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { Container, Form, Grid, Header, Message } from 'semantic-ui-react';
import { Accounts } from 'meteor/accounts-base';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

/**
 * Signup component is similar to signin component, but we create a new user instead.
 */
const Signup = ({ location }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [employeeID, setEmployeeID] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [redirectToReferer, setRedirectToReferer] = useState(false);

  // Update the form controls each time the user interacts with them.
  const handleChange = (e, { name, value }) => {
    switch (name) {
    case 'firstName':
      setFirstName(value);
      break;
    case 'lastName':
      setLastName(value);
      break;
    case 'email':
      setEmail(value);
      break;
    case 'employeeID':
      setEmployeeID(value);
      break;
    case 'password':
      setPassword(value);
      break;
    case 'confirmPassword':
      setConfirmPassword(value);
      break;
    default:
      // do nothing.
    }
  };

  /* Handle Signup submission. Create user account and a profile entry, then redirect to the home page. */
  const submit = () => {
    if (password !== confirmPassword) {
      this.setState({ error: 'The passwords do not match.  Please try again.' });
    } else {
      Accounts.createUser({ firstName, lastName, employeeID, email, username: email, password }, (err) => {
        if (err) {
          setError(err.reason);
        } else {
          setError('');
          setRedirectToReferer(true);
        }
      });
    }
  };

  /* Display the signup form. Redirect to add page after successful registration and login. */
  const { from } = location.state || { from: { pathname: '/add' } };
  // if correct authentication, redirect to from: page instead of signup screen
  if (redirectToReferer) {
    return <Redirect to={from} />;
  }
  return (
    <Container id={PAGE_IDS.SIGN_UP}>
      <Grid>
        <Grid.Column>
          <Header as="h2" textAlign="center">SIGN UP</Header>
          <Form onSubmit={submit}>
            <Form.Group widths='equal'>
              <Form.Input
                label="First Name"
                id={COMPONENT_IDS.SIGN_UP_FORM_FIRSTNAME}
                icon="user"
                iconPosition="left"
                name="firstName"
                placeholder="First Name"
                type="firstName"
                onChange={handleChange} />
              <Form.Input
                label="Last Name"
                id={COMPONENT_IDS.SIGN_UP_FORM_LASTNAME}
                icon="user"
                iconPosition="left"
                name="lastName"
                placeholder="Last Name"
                type="lastName"
                onChange={handleChange} />
            </Form.Group>
            <Form.Group widths='equal'>
              <Form.Input
                label="Email"
                id={COMPONENT_IDS.SIGN_UP_FORM_EMAIL}
                icon="user"
                iconPosition="left"
                name="email"
                type="email"
                placeholder="E-mail address"
                onChange={handleChange}
              />
              <Form.Input
                label="Employee ID"
                id={COMPONENT_IDS.SIGN_UP_FORM_EMPLOYEEID}
                name="employeeID"
                type="employeeID"
                placeholder="Employee ID"
                onChange={handleChange}/>
            </Form.Group>
            <Form.Group widths='equal'>
              <Form.Input
                label="Password"
                id={COMPONENT_IDS.SIGN_UP_FORM_PASSWORD}
                icon="lock"
                iconPosition="left"
                name="password"
                placeholder="Password"
                type="password"
                onChange={handleChange}
              />
              <Form.Input
                label="Confirm Password"
                id={COMPONENT_IDS.SIGN_UP_FORM_CONFIRMPASSWORD}
                icon="lock"
                iconPosition="left"
                name="confirmPassword"
                placeholder="Confirm Password"
                type="password"
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Button id={COMPONENT_IDS.SIGN_UP_FORM_SUBMIT} content="Submit" />
          </Form>
          <Message>
            Already have an account? Login <Link to="/signin">here</Link>
          </Message>
          {error === '' ? (
            ''
          ) : (
            <Message
              error
              header="Registration was not successful"
              content={error}
            />
          )}
        </Grid.Column>
      </Grid>
    </Container>
  );
};

/* Ensure that the React Router location object is available in case we need to redirect. */
Signup.propTypes = {
  location: PropTypes.object,
};

export default Signup;
