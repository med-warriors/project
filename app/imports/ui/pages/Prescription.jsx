import React from 'react';
import { Grid, Segment, Header, Form } from 'semantic-ui-react';
import { AutoForm, ErrorsField, NumField, SubmitField, TextField, LongTextField } from 'uniforms-semantic';
import swal from 'sweetalert';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { TransationHistories } from '../../api/transaction/TransationHistoriesCollection';
import { defineMethod, updateMethod } from '../../api/base/BaseCollection.methods';
import { PAGE_IDS } from '../utilities/PageIDs';
import { Medicines } from '../../api/medicine/MedicineCollection';
import PrescriptionTable from '../components/PrescriptionTable';

// Create a schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
  patientID: String,
  outputLocation: String,
  prescriptionQuantity: Number,
  notes: String,
});

const bridge = new SimpleSchema2Bridge(formSchema);

/** Renders the Page for adding a document. */

const Prescription = () => {

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
  let med;

  const submitMed = (data, fRef) => {
    const { prescriptionQuantity } = data;
    const collectionName = Medicines.getCollectionName();
    const quantity = med.quantity - prescriptionQuantity;
    const updateData = { id: med._id, quantity };
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
    <Grid id={PAGE_IDS.PRESCRIPTION} container centered>
      <Grid.Column>
        <Header as="h2" textAlign="center">Prescription</Header>
        <AutoForm ref={ref => {
          fRef = ref;
        }} schema={bridge} onSubmit={data => submitMed(data, fRef)}>
          <Grid.Row>
            <Grid.Row>
              <PrescriptionTable medDispense={med}/>
            </Grid.Row>
            <Segment>
              <Header as="h5" textAlign="center">Patient Prescription</Header>
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

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default Prescription;
