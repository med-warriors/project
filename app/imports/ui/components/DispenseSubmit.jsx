import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Form, Grid, Header, Segment } from 'semantic-ui-react';
import { AutoForm, ErrorsField, LongTextField, SubmitField, TextField } from 'uniforms-semantic';
import swal from 'sweetalert';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { defineMethod, updateMethod } from '../../api/base/BaseCollection.methods';
import { MedicineSource } from '../../api/medSource/MedicineSourceCollection';
import { SupplySource } from '../../api/supplysource/SupplySourceCollection';
import { Patients } from '../../api/patients/PatientCollection';
import { SupplySourceRecord } from '../../api/supplysourceRecord/SupplySourceRecordCollection';
import { MedicineSourceRecord } from '../../api/medsourceRecord/MedicineSourceRecordCollection';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

// Create a schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
  patientID: String,
  outputLocation: String,
  note: String,
});

const bridge = new SimpleSchema2Bridge(formSchema);

/** Renders the Page for adding a document. */

const DispenseSubmit = ({ cellDispense, setDispense }) => {

  const submitMedRecord = (data, outQuantity, quantity) => {
    const { lotNumber, medName, sourceName, acquire, cost, receiveDate, expDate, state } = data;
    const editDate = new Date();
    const action = 'Out';
    const change = `Dispensed ${outQuantity.toString()} ${medName}(${lotNumber})`;
    // Get the current employee ID number.
    const employee = Meteor.user() ? Meteor.user().username : '';
    const collectionName = MedicineSourceRecord.getCollectionName();
    const definitionData = { lotNumber, medName, quantity, sourceName, acquire, cost, expDate, receiveDate, state, editDate, employee, action, change };
    defineMethod.callPromise({ collectionName, definitionData });
  };

  const submitMed = (med, outQuantity) => {
    // eslint-disable-next-line prefer-const
    let { lotNumber, medName, quantity, sourceName, acquire, cost, receiveDate, expDate, state, _id } = med;
    // change value on submit the dispense.
    quantity -= outQuantity;
    if (state === 'Reserves') { state = 'Acted'; }
    const collectionName = MedicineSource.getCollectionName();
    const updateData = { id: _id, lotNumber, medName, quantity, sourceName, acquire, cost, receiveDate, expDate, state };
    // update the medicine.
    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        submitMedRecord(med, outQuantity, quantity);
      });
  };

  const submitSupRecord = (data, outQuantity, quantity) => {
    const { supplyName, sourceName, acquire, cost, receiveDate, state } = data;
    const editDate = new Date();
    const action = 'Out';
    const change = `Dispensed ${outQuantity.toString()} ${supplyName}`;
    // Get the current employee ID number.
    const employee = Meteor.user() ? Meteor.user().username : '';
    const collectionName = SupplySourceRecord.getCollectionName();
    const definitionData = { supplyName, quantity, sourceName, acquire, cost, receiveDate, state, editDate, employee, action, change };
    defineMethod.callPromise({ collectionName, definitionData });
  };

  const submitSup = (sup, outQuantity) => {
    // eslint-disable-next-line prefer-const
    let { supplyName, quantity, sourceName, acquire, cost, receiveDate, state, _id } = sup;
    // change value on submit the dispense.
    quantity -= outQuantity;
    if (state === 'Reserves') { state = 'Acted'; }
    const collectionName = SupplySource.getCollectionName();
    const updateData = { id: _id, supplyName, quantity, sourceName, acquire, cost, receiveDate, state };
    // update the medicine.
    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        submitSupRecord(sup, outQuantity, quantity);
      });
  };

  const submitDispense = (formRef) => {
    // Add record of dispense to patient.
    for (let i = 0; i < cellDispense.length; i++) {
      const outQuantity = cellDispense[i].prescriptionQuantity;
      if (cellDispense[i].type === 'Medicine') {
        const med = MedicineSource.findDoc(cellDispense[i].id);
        submitMed(med, outQuantity);
      }
      if (cellDispense[i].type === 'Supply') {
        const sup = SupplySource.findDoc(cellDispense[i].id);
        submitSup(sup, outQuantity);
      }
    }
    // empty the submit schema form.
    formRef.reset();
    setDispense([]);
  };

  // On submit, insert the data to Patient history.
  const submit = (data, formRef) => {
    const { patientID, outputLocation, note } = data;
    // Get the current date/time, location, medicine and supply.
    const date = new Date();
    const id = patientID;
    const location = outputLocation;
    const dispense = [];
    let passDispense = true;

    if ((cellDispense.length === 0)) {
      swal('Error', 'No dispense medicine and/or supply', 'error');
      passDispense = false;
    } else {
      for (let i = 0; i < cellDispense.length; i++) {
        const outQuantity = cellDispense[i].prescriptionQuantity;
        if ((outQuantity === 0)) {
          swal('Error', 'Item dispensing quantity is invalid', 'error');
          passDispense = false;
        } else {
          if (cellDispense[i].type === 'Medicine') {
            const med = MedicineSource.findDoc(cellDispense[i].id);
            dispense.push(med.lotNumber.concat(' - ', med.medName, ': ', outQuantity));
          }
          if (cellDispense[i].type === 'Supply') {
            const sup = SupplySource.findDoc(cellDispense[i].id);
            dispense.push(sup.supplyName.concat(': ', outQuantity));
          }
        }
      }
      if (passDispense) {
        // Get the current employee ID number.
        const employee = Meteor.user() ? Meteor.user().username : '';
        const collectionName = Patients.getCollectionName();
        const definitionData = { date, id, note, dispense, location, employee };
        // add prescription as new transaction.
        defineMethod.callPromise({ collectionName, definitionData })
          .catch(error => swal('Error', error.message, 'error'))
          .then(() => {
            swal('Success', 'Prescription output successfully', 'success');
            submitDispense(formRef);
          });
      }
    }
  };

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  let fRef = null;
  return (
    <Grid container centered>
      <Grid.Column>
        <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => submit(data, fRef)} >
          <Grid.Row>
            <Segment>
              <Header as="h3" textAlign="center">Patient Information</Header>
              <Form.Group widths='equal'>
                <TextField name='patientID'/>
                <TextField name='outputLocation'/>
              </Form.Group>
              <LongTextField name='note' className='note-dispense'/>
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
