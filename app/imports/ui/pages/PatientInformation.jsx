import React from 'react';
import { Grid, Loader, Header, Divider, Container, Segment } from 'semantic-ui-react';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
// import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { Stuffs } from '../../api/stuff/Stuff';

// const bridge = new SimpleSchema2Bridge(Stuffs.schema);

/** Renders the Page for editing a single document. */
class PatientInformation extends React.Component {

  // On successful submit, insert the data.
  submit(data) {
    const { name, quantity, condition, _id } = data;
    Stuffs.collection.update(_id, { $set: { name, quantity, condition } }, (error) => (error ?
      swal('Error', error.message, 'error') :
      swal('Success', 'Item updated successfully', 'success')));
  }

  // If the subscription(s) have been received, render the page, otherwise show a loading icon.
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  renderPage() {
    return (
      <Grid container centered>
        <Grid.Column>
          <Header as="h2" textAlign="center">Patient Information</Header>
          <Container>
            <Segment>
              <p>
                <b>Date:</b> 8/26/21<br/>
                <b>Patient Name:</b> John Smith<br/>
                <b>Email:</b> email@gmail.com <br/>
                <b>Phone Number:</b> (808)123-4567<br/>
                <b>Prescription:</b> <br/>
                <ul>
                  <li>Tylenol 500mg</li>
                  <li>lot #1234</li>
                  <li>Exp. date: 6/5/2023</li>
                </ul>
              </p>
              <Divider section/>
              <p>
                <b>Date:</b> 8/26/21<br/>
                <b>Patient Name:</b> Jane Doe<br/>
                <b>Email:</b> email@gmail.com <br/>
                <b>Phone Number:</b> (808)123-4567<br/>
                <b>Prescription:</b> <br/>
                <ul>
                  <li>Tylenol 500mg</li>
                  <li>lot #1234</li>
                  <li>Exp. date: 6/5/2023</li>

                </ul>
              </p>
            </Segment>
          </Container>
        </Grid.Column>
      </Grid>
    );
  }
}

// Require the presence of a Stuff document in the props object. Uniforms adds 'model' to the props, which we use.
PatientInformation.propTypes = {
  doc: PropTypes.object,
  model: PropTypes.object,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const documentId = match.params._id;
  // Get access to Stuff documents.
  const subscription = Meteor.subscribe(Stuffs.userPublicationName);
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the document
  const doc = Stuffs.collection.findOne(documentId);
  return {
    doc,
    ready,
  };
})(PatientInformation);
