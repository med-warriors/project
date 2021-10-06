import React from 'react';
import { Grid, Segment, Header } from 'semantic-ui-react';
import { AutoForm, ErrorsField, NumField, DateField, SubmitField, TextField, SelectField } from 'uniforms-semantic';
import swal from 'sweetalert';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Medicines } from '../../api/medicine/MedicineCollection';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import { PAGE_IDS } from '../utilities/PageIDs';

// Create a schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
  lotNumber: {
    type: Number,
    allowedValues: [1, 2, 3],
  },
  name: String,
  type: {
    type: String,
    allowedValues: ['Allergy and Cold Medicine', 'Analgesics/Antiinflammatory', 'Antihypertensives', 'Antimicrobials', 'Cardiac/Cholesterol', 'Dermatologic Preparations', 'Diabetes' +
    'Meds', 'Ear and Eye Preparations', 'Emergency Kit', 'GI Meds', 'GYN Meds', 'Pulmonary', 'Smoking Cessation', 'Vitamins and Supplements'],
  },
  location: String,
  quantity: Number,
  should_have: Number,
  expirationDate: Date,
  source: String,
});

const bridge = new SimpleSchema2Bridge(formSchema);

/** Renders the Page for adding a document. */
const AddMedicine = () => {

  // On submit, insert the data.
  const submit = (data, formRef) => {
    const { lotNumber, name, type, location, quantity, should_have, expirationDate, source } = data;
    const collectionName = Medicines.getCollectionName();
    const definitionData = { lotNumber, name, type, location, quantity, should_have, expirationDate, source };
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
        <Header as="h2" textAlign="center">Add Medicine</Header>
        <AutoForm ref={ref => {
          fRef = ref;
        }} schema={bridge} onSubmit={data => submit(data, fRef)}>
          <Segment>
            <TextField name='name' />
            <SelectField name='type' />
            <NumField name='quantity' decimal={false} />
            <TextField name='location' />
            <SelectField name='lotNumber' />
            <DateField name='expirationDate' />
            <NumField name='should_have' />
            <TextField name='source' />
            <SubmitField value='Submit' />
            <ErrorsField />
          </Segment>
        </AutoForm>
      </Grid.Column>
    </Grid>
  );
};

export default AddMedicine;
