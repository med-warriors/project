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
import { Supplies } from '../../api/supply/SupplyCollection';

// Create a schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
  patientID: String,
  outputLocation: String,
  notes: String,
});

const bridge = new SimpleSchema2Bridge(formSchema);

/** Renders the Page for adding a document. */

const DispenseSubmit = ({ cellDispense, setDispense }) => {

  /*
  // todo: edit the following code to submit a Dispense record.
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

  const submitMed = (med, outQuantity) => {
    // eslint-disable-next-line prefer-const
    let { lotNumber, medName, location, quantity, sourceName, acquire, cost, receiveDate, expDate, state, _id } = med;
    // change value on submit the dispense.
    quantity -= outQuantity;
    if (state === 'Reserves') { state = 'Acted'; }
    const collectionName = MedicineSource.getCollectionName();
    const updateData = { id: _id, lotNumber, medName, location, quantity, sourceName, acquire, cost, receiveDate, expDate, state };
    // update the medicine.
    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal('Success', 'Item updated successfully', 'success');
      });
  };

  const submitSup = (sup, outQuantity) => {
    // eslint-disable-next-line prefer-const
    let { name, location, quantity, note, _id } = sup;
    // change value on submit the dispense.
    quantity -= outQuantity;
    const collectionName = Supplies.getCollectionName();
    const updateData = { id: _id, name, location, quantity, note };
    // update the medicine.
    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal('Success', 'Item updated successfully', 'success');
      });
  };

  const submit = (data, formRef) => {
    // Add record of dispense.
    // todo: change the follow line to add new collection of record dispense.
    const D = data;
    // update the each medicine on submit from the list.
    for (let i = 0; i < cellDispense.length; i++) {
      const outQuantity = cellDispense[i].prescriptionQuantity;
      if (cellDispense[i].type === 'Medicine') {
        const med = MedicineSource.findDoc(cellDispense[i].id);
        submitMed(med, outQuantity);
      }
      if (cellDispense[i].type === 'Supply') {
        const sup = Supplies.findDoc(cellDispense[i].id);
        submitSup(sup, outQuantity);
      }
    }
    // empty the submit schema form.
    formRef.reset();
    setDispense([]);
  };

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  let fRef = null;
  return (
    <Grid container centered>
      <Grid.Column>
        <AutoForm ref={ref => {
          fRef = ref;
        }} schema={bridge} onSubmit={data => submit(data, fRef)}>
          <Grid.Row>
            <Segment>
              <Header as="h3" textAlign="center">Patient Information</Header>
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
DispenseSubmit.propTypes = {
  cellDispense: PropTypes.array,
  setDispense: PropTypes.func,
};

export default withRouter(DispenseSubmit);
