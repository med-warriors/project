import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment, Header, Loader, Form, Search, Text } from 'semantic-ui-react';
import { AutoForm, ErrorsField, NumField, SubmitField, TextField, LongTextField, DateField } from 'uniforms-semantic';
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
  lotNumber: String,
  name: String,
  type: String,
  location: String,
  quantity: Number,
  expirationDate: Date,
  patientID: String,
  prescriptionQuantity: Number,
  notes: String,
});

const bridge = new SimpleSchema2Bridge(formSchema);

/** Renders the Page for adding a document. */

const Prescription = (ready, doc, currentUser) => {

  // On submit, insert the data to transaction history.
  const submitTran = (data, formRef) => {
    const { patientID, medicine } = data;
    // Get the current date, time, and default data.
    const date = new Date();
    const prescription = medicine;
    const transact = 'Out';
    const type = 'Medicine';
    // Get the current employee ID number.
    const employee = currentUser;
    const collectionName = TransationHistories.getCollectionName();
    const definitionData = { date, transact, type, patientID, prescription, employee };
    // add prescription as new transaction.
    defineMethod.callPromise({ collectionName, definitionData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal('Success', 'Prescription output successfully', 'success');
        formRef.reset();
      });
  };

  // On submit, edit Medicines the data.
  // Todo: subtract the output quantity of storage.
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
        <AutoForm ref={ref => {
          fRef = ref;
        }} schema={bridge} onSubmit={data => submitMed(data, fRef)}>
          <Grid.Row>
            <Grid.Row>
              <Search/>
              <Segment>
                {/*
               // Todo: Show the Searched output.
               // onClick: select the Medicine as output prescription.
               */}
                <Header as="h5" textAlign="center">Medicine Information</Header>
                <Form.Group widths='equal'>
                  <TextField name='lotNumber'/>
                  <TextField label='Medicine Name' name='name'/>
                </Form.Group>
                <Form.Group widths='equal'>
                  <TextField name='location'/>
                  <NumField name='quantity' decimal={false} />
                  <DateField name='expirationDate'/>
                </Form.Group>
              </Segment>
            </Grid.Row>
            <Segment>
              <Header as="h5" textAlign="center">Patient Prescription</Header>
              <Form.Group widths='equal'>
                <TextField name='patientID'/>
                <NumField name='prescriptionQuantity' decimal={false} />
              </Form.Group>
              <LongTextField name='notes'/>
              <SubmitField value='Submit'/>
              <ErrorsField />
            </Segment>
          </Grid.Row>
        </AutoForm>
      </Grid.Column>
    </Grid>
  ) : <Loader active>Getting data</Loader>;
};

// Require the presence of a Stuff document in the props object. Uniforms adds 'model' to the props, which we use.
Prescription.propTypes = {
  currentUser: PropTypes.string,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // Get access to Medicines documents.
  const subscription = Medicines.subscribeMedicine();
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the User document.
  // Todo: edit the following line to get user employee ID.
  const currentUser = '';
  // ---------------.
  return {
    currentUser,
    ready,
  };
})(Prescription);
