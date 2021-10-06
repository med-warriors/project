import React from 'react';
import { Form, Grid, Segment, Header } from 'semantic-ui-react';
import { AutoForm, ErrorsField, AutoField, NumField, DateField, SelectField, SubmitField, TextField } from 'uniforms-semantic';
import swal from 'sweetalert';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Medicines } from '../../api/medicine/MedicineCollection';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import { PAGE_IDS } from '../utilities/PageIDs';

// Create a schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
  lotNumber: String,
  name: String,
  type: String,
  location: String,
  quantity: Number,
  should_have: Number,
  expirationDate: Date,
  source: String,
});

const medicineNames = [
  ['Benzonatate Capsules'], ['Ibuprofen 800 mg tabs'], ['Metoprolol 50 mg'], ['Fluconazole 150 mg'],
];

const medicineTypes = [
  ['Antihypertensives'], ['Allergy & Cold Medicines'], ['Analgesics/Inflammatory'], ['Antimicrobials'],
];

const locations = [
  ['Case 1'], ['Case 2'], ['Case 3'], ['Case 4'], ['Case 5'], ['Case 6'], ['Case 7'], ['Case 8'], ['Freezer'],
];

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
            <Form.Group widths='equal'>
              <SelectField label='Medicine Name' name='name'
                allowedValues={medicineNames}/>
              <SelectField label='Medicine Type' name='type'
                allowedValues={medicineTypes}/>
              <NumField name='quantity' decimal={false} />
              <SelectField name='location'
                allowedValues={locations}/>
            </Form.Group>
            <Form.Group widths='equal'>
              <AutoField name='lotNumber'/>
              <DateField name='expirationDate'/>
              <NumField name='should_have' />
              <TextField name='source' />
            </Form.Group>
            <SubmitField value='Submit' />
            <ErrorsField />
          </Segment>
        </AutoForm>
      </Grid.Column>
    </Grid>
  );
};

export default AddMedicine;
