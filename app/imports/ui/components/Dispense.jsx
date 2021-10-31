import React from 'react';
import { Form, Grid } from 'semantic-ui-react';
import { AutoForm, ErrorsField, LongTextField, SubmitField, TextField } from 'uniforms-semantic';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import { PAGE_IDS } from '../utilities/PageIDs';
import { MedicineSource } from '../../api/medSource/MedicineSourceCollection';

// Create a schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
  patientID: String,
  outputLocation: String,
  note: String,
});

const bridge = new SimpleSchema2Bridge(formSchema);

/** Renders the Page for adding a document. */
const Dispense = () => {

  // On submit, insert the data.
  const submit = (data, formRef) => {
    const { name, quantity, condition } = data;
    const owner = Meteor.user().username;
    const collectionName = MedicineSource.getCollectionName();
    const definitionData = { name, quantity, condition, owner };
    defineMethod.callPromise({ collectionName, definitionData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal('Success', 'Item added successfully', 'success');
        formRef.reset();
      });
  };

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  let fRef = null;
  return (
    <Grid id={PAGE_IDS.ADD_MEDICINE} container centered>
      <Grid.Column>
        <AutoForm ref={ref => {
          fRef = ref;
        }} schema={bridge} onSubmit={data => submit(data, fRef)}>
          <Form.Group widths='equal' >
            <TextField label='Patient ID' name='patientID' />
            <TextField label='Location' name='outputLocation' />
          </Form.Group>
          <LongTextField name='note' />
          <SubmitField value='Submit' />
          <ErrorsField/>
        </AutoForm>
      </Grid.Column>
    </Grid>
  );
};

export default Dispense;
