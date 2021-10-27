import React from 'react';
import { Grid, Loader, Header, Segment, Form } from 'semantic-ui-react';
import swal from 'sweetalert';
import { AutoForm, ErrorsField, NumField, SelectField, SubmitField, TextField, DateField } from 'uniforms-semantic';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { useParams } from 'react-router';
import { Medicines } from '../../api/medicine/MedicineCollection';
import { updateMethod } from '../../api/base/BaseCollection.methods';
import { PAGE_IDS } from '../utilities/PageIDs';

const bridge = new SimpleSchema2Bridge(Medicines._schema);

/** Renders the Page for editing a single document. */
const EditMedicine = ({ doc, ready }) => {

  // On successful submit, insert the data.
  const submit = (data) => {
    const { name, quantity, lotNumber, expirationDate, _id } = data;
    const collectionName = Medicines.getCollectionName();
    const updateData = { id: _id, name, quantity, lotNumber, expirationDate };
    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => swal('Success', 'Item updated successfully', 'success'));
  };

  return (ready) ? (
    <Grid id={PAGE_IDS.EDIT_MEDICINE} container centered>
      <Grid.Column>
        <Header as="h2" textAlign="center">Edit Medicine</Header>
        <AutoForm schema={bridge} onSubmit={data => submit(data)} model={doc}>
          <Segment>
            <Form.Group>
              <TextField name='name' />
              <NumField name='quantity' decimal={false} />
              <TextField name='lotNumber' />
              <DateField name='expirationDate' />
            </Form.Group>
            <SubmitField value='Submit' />
            <ErrorsField />
            {/* <HiddenField name='owner' /> */}
          </Segment>
        </AutoForm>
      </Grid.Column>
    </Grid>
  ) : <Loader active>Getting data</Loader>;
};

// Require the presence of a Stuff document in the props object. Uniforms adds 'model' to the props, which we use.
EditMedicine.propTypes = {
  doc: PropTypes.object,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const { _id } = useParams();
  const documentId = _id;
  // Get access to Stuff documents.
  const subscription = Medicines.subscribeMedicine();
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the document
  const doc = Medicines.findDoc(documentId);
  return {
    doc,
    ready,
  };
})(EditMedicine);
