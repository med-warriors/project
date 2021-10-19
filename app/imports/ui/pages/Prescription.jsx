import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Grid, Segment, Header, Loader, Form } from 'semantic-ui-react';
import { AutoForm, ErrorsField, NumField, SubmitField, TextField, LongTextField, SelectField } from 'uniforms-semantic';
import { withTracker } from 'meteor/react-meteor-data';
import swal from 'sweetalert';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { TransationHistories } from '../../api/transaction/TransationHistoriesCollection';
import { defineMethod, updateMethod } from '../../api/base/BaseCollection.methods';
import { PAGE_IDS } from '../utilities/PageIDs';
import { Medicines, medName } from '../../api/medicine/MedicineCollection';

// Create a schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
  name: {
    type: String,
    allowedValues: medName },
  med: Object,
  patientID: String,
  prescriptionQuantity: Number,
  notes: String,
});

const bridge = new SimpleSchema2Bridge(formSchema);

/** Renders the Page for adding a document. */

const Prescription = (ready, medicines) => {

  // On submit, insert the data to transaction history.
  const submitTran = (data, formRef) => {
    const { patientID, name } = data;
    // Get the current date, time, and default data.
    const date = new Date();
    const prescription = name;
    const transact = 'Out';
    const type = 'Medicine';
    // Get the current employee ID number.
    const employee = Meteor.user() ? Meteor.user().username : '';
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
              <Segment>
                <Header as="h5" textAlign="center">Medicine Information</Header>
                <SelectField label='Medicine Name' name='name'/>
                {/*
                // Todo: set a list of medicine from the selectField above.
                // with the onClick setting for select the output medicine.
                
                 */}
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

// Require the presence of a Prescription document in the props object. Uniforms adds 'model' to the props, which we use.
Prescription.propTypes = {
  medicines: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // Get access to Medicines documents.
  const subscription = Medicines.subscribeMedicine();
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the Medicine documents and sort them by name.
  const medicines = Medicines.find({}, { sort: { name: 1 } }).fetch();
  return {
    medicines,
    ready,
  };
})(Prescription);
