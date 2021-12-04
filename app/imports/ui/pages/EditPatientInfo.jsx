import React from 'react';
import { Grid, Loader, Header, Segment } from 'semantic-ui-react';
import swal from 'sweetalert';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-semantic';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { useParams } from 'react-router';
import { Patients } from '../../api/patients/PatientCollection';
import { updateMethod } from '../../api/base/BaseCollection.methods';

const bridge = new SimpleSchema2Bridge(Patients._schema);

/** Renders the Page for editing a single document. */
const EditPatientInfo = ({ doc, ready }) => {

  // On successful submit, insert the data.
  const submit = (data) => {
    const { date, location, employee, note, _id } = data;
    const collectionName = Patients.getCollectionName();
    const updateData = { id: _id, date, location, note, employee };
    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => swal('Success', 'Item updated successfully', 'success'));
  };

  return (ready) ? (
    <Grid container centered>
      <Grid.Column>
        <Header as="h2" textAlign="center">Edit Patient Log</Header>
        <AutoForm schema={bridge} onSubmit={data => submit(data)} model={doc}>
          <Segment>
            <TextField type='date' name='date' />
            <TextField name='id'/>
            <TextField name='location' />
            <TextField name='note' />
            <TextField name='employee' />
            <SubmitField value='Submit' />
            <ErrorsField />
          </Segment>
        </AutoForm>
      </Grid.Column>
    </Grid>
  ) : <Loader active>Getting data</Loader>;
};

// Require the presence of a Stuff document in the props object. Uniforms adds 'model' to the props, which we use.
EditPatientInfo.propTypes = {
  doc: PropTypes.object,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const { _id } = useParams();
  const documentId = _id;
  // Get access to Stuff documents.
  const subscription = Patients.subscribePatients();
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the document
  const doc = Patients.findDoc(documentId);
  return {
    doc,
    ready,
  };
})(EditPatientInfo);
