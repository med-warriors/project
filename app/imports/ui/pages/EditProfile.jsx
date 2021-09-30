import React from 'react';
import { Grid, Form, Loader, Header, Segment, Button, Icon } from 'semantic-ui-react';
import swal from 'sweetalert';
import { AutoForm, ErrorsField, SubmitField, TextField, HiddenField } from 'uniforms-semantic';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { NavLink } from 'react-router-dom';
import { Profiles } from '../../api/profile/Profile';

const bridge = new SimpleSchema2Bridge(Profiles.schema);

/** Renders the Page for editing a single document. */
class EditProfile extends React.Component {
  // On successful submit, insert the data.
  submit(data) {
    const { username, name, idnumber, role, image, _id } = data;

    Profiles.collection.update(_id, { $set: { username, name, idnumber, role, image } }, (error) => (error ?
      swal('Error', error.message, 'error') :
      swal('Success', 'Item updated successfully', 'success')));
  }

  // If the subscription(s) have been received, render the page, otherwise show a loading icon.
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  renderPage() {
    console.log(this.props.doc);
    return (
      <Grid id="edit-profile" container centered>
        <Grid.Column>
          <Header as="h2" textAlign="center">Edit Profile</Header>
          <AutoForm schema={bridge} onSubmit={data => this.submit(data) } model={this.props.doc}>
            <Segment>
              <Form.Group widths='equal'>
                <TextField id='input-name' name='name'/>
                <TextField id='input-username' name='username'/>
              </Form.Group>
              <TextField id='input-id' name='idnumber'/>
              <TextField id='input-image' name='image'/>
              <SubmitField id='submit' value='Submit'/>
              <ErrorsField/>
              <HiddenField name='owner' />
            </Segment>
          </AutoForm>
          <Button id="edit-prof">
            <Button.Content visible as={NavLink} activeClassName="active" exact to="/viewuser" key='viewuser'><Icon name='arrow left' />Back</Button.Content>
          </Button>
        </Grid.Column>
      </Grid>
    );
  }
}

// Require the presence of a Profile document in the props object. Uniforms adds 'model' to the props, which we use.
EditProfile.propTypes = {
  doc: PropTypes.object,
  model: PropTypes.object,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  const subscription = Meteor.subscribe(Profiles.userPublicationName);
  const user = Meteor.user();
  const username = Object(user).username;
  console.log(user);
  const document = Profiles.collection.findOne({ owner: username });
  return {
    doc: document,
    ready: subscription.ready(),
  };
})(EditProfile);
