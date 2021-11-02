import React from 'react';
import { Form, Grid, Header, Segment } from 'semantic-ui-react';
import { AutoForm, ErrorsField, LongTextField, SubmitField, TextField } from 'uniforms-semantic';
import swal from 'sweetalert';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { defineMethod, updateMethod } from '../../api/base/BaseCollection.methods';
import { MedicineSource } from '../../api/medSource/MedicineSourceCollection';

// Create a schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
  patientID: String,
  outputLocation: String,
  notes: String,
});

const bridge = new SimpleSchema2Bridge(formSchema);

/** Renders the Page for adding a document. */

const Dispense = ({ cellDispense, dispenseList }) => {

  /*
  // On submit, insert the data to transaction history.
  const submitTran = (data, formRef) => {
    const { patientID, medicine } = data;
    // Get the current date, time, and default data.
    const date = new Date();
    const prescription = medicine;
    const transact = 'Out';
    const type = 'Medicine';
    // Get the current employee ID number.
    const employee = 'employee name';
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
  */

  const submitMed = (fRef) => {
    const { lotNumber, medName, quantity, sourceName, acquire,
      cost, receiveDate, expDate, state, _id } = MedicineSource.find(cellDispense[0].medId);
    const newQuantity = quantity - cellDispense[0].prescriptionQuantity;
    const collectionName = MedicineSource.getCollectionName();
    const updateData = { id: _id, lotNumber, medName, quantity: newQuantity, sourceName, acquire, cost, receiveDate, expDate, state };
    // update the medicine.
    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal('Success', 'Item updated successfully', 'success');
        fRef.reset();
      });
  };

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  let fRef = null;

  return (
    <Grid container centered>
      <Grid.Column>
        <AutoForm ref={ref => {
          fRef = ref;
        }} schema={bridge} onSubmit={data => submitMed(data, fRef)}>
          <Grid.Row>
            <Segment>
              <Header as="h3" textAlign="center">Patient Prescription</Header>
              <Form.Group widths='equal'>
                <TextField name='patientID'/>
                <TextField name='outputLocation'/>
              </Form.Group>
              <LongTextField name='notes'/>
              <SubmitField value='Submit'/>
              <ErrorsField />
            </Segment>
          </Grid.Row>
        </AutoForm>
      </Grid.Column>
    </Grid>
  );
};

// Require a document to be passed to this component.
Dispense.propTypes = {
  dispenseList: PropTypes.array,
  cellDispense: PropTypes.array,
};

export default withRouter(Dispense);
