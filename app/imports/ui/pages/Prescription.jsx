import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment, Header, Loader, Form } from 'semantic-ui-react';
import { AutoForm, ErrorsField, NumField, SelectField, SubmitField, TextField, LongTextField } from 'uniforms-semantic';
import { withTracker } from 'meteor/react-meteor-data';
import swal from 'sweetalert';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { TransationHistories } from '../../api/transaction/TransationHistoriesCollection';
import { defineMethod, updateMethod } from '../../api/base/BaseCollection.methods';
import { PAGE_IDS } from '../utilities/PageIDs';
import { Medicines } from '../../api/medicine/MedicineCollection';

// Create a schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
  medicine: {
    type: String,
    // set values to the medicines database [ '_id, medicines, quantity' ]
    allowedValues: ['Benzonatate Capsules', 'Fluconazole 150 mg', 'Ibuprofen 800 mg tabs'],
  },
  patientName: String,
  quantity: Number,
  notes: String,
});

const bridge = new SimpleSchema2Bridge(formSchema);

/** Renders the Page for adding a document. */

const Prescription = (ready, doc, currentUser) => {

  // On submit, insert the data to transaction history.
  const submitTran = (data, formRef) => {
    const { patientName, medicine } = data;
    // Get the current date, time, and default data.
    const date = new Date();
    const prescription = medicine;
    const transact = 'Out';
    const type = 'Medicine';
    // Get the current employee ID number.
    // Todo: edit the this following line.
    const employee = currentUser;
    // -------------.
    const collectionName = TransationHistories.getCollectionName();
    const definitionData = { date, transact, type, patientName, prescription, employee };
    // add prescription as new transaction.
    defineMethod.callPromise({ collectionName, definitionData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal('Success', 'Prescription output successfully', 'success');
        formRef.reset();
      });
  };

  // On submit, edit Medicines the data.
  const submitMed = (data) => {
    const { outQuantity } = data;
  const submitMed = (data, fRef) => {
    const { _id, quantity } = data;
    const collectionName = Medicines.getCollectionName();
    const updateData = { id: _id, quantity };
    // update the medicine.
    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal('Success', 'Item updated successfully', 'success');
        submitTran(data, fRef);
        fRef.reset();
      });
  };

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  let fRef = null;

  return (ready) ? (
    <Grid id={PAGE_IDS.PRESCRIPTION} container centered>
      <Grid.Column>
        <Header as="h2" textAlign="center">Prescription</Header>
        {currentUser}
        <AutoForm ref={ref => {
          fRef = ref;
        }} schema={bridge} onSubmit={data => submitMed(data, fRef)} model={doc}>
          <Segment>
            <Form.Group widths='equal'>
              <TextField name='patientName'/>
              <SelectField name='medicine'/>
              <NumField name='quantity' decimal={false} />
            </Form.Group>
            <LongTextField name='notes'/>
            <SubmitField value='Submit'/>
            <ErrorsField />
          </Segment>
        </AutoForm>
      </Grid.Column>
    </Grid>
  ) : <Loader active>Getting data</Loader>;
};

// Require the presence of a Stuff document in the props object. Uniforms adds 'model' to the props, which we use.
Prescription.propTypes = {
  currentUser: PropTypes.object,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // Get access to Medicines documents.
  const subscription = Medicines.subscribeMedicine();
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the User document.
  // Todo: edit the following line to get user Id.
  const currentUser = '';
  // ---------------.
  return {
    currentUser,
    ready,
  };
})(Prescription);
