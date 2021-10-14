import React from 'react';
import { Grid, Form, Segment, Header } from 'semantic-ui-react';
import { AutoForm, ErrorsField, NumField, SelectField, SubmitField, TextField } from 'uniforms-semantic';
import swal from 'sweetalert';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Supplies } from '../../api/supply/SupplyCollection';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import { PAGE_IDS } from '../utilities/PageIDs';

// Create a schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
  name: {
    type: String,
    allowedValues: ['Benzonatate Capsules', 'Fluconazole 150 mg', 'Ibuprofen 800 mg tabs', 'Metoprolol 50 mg'] },
  type: {
    type: String,
    allowedValues: ['Allergy and Cold Medicines', 'Analgesics/Antiinflammatory', 'Antihypertensives', 'Antimicrobials', 'Cardiac/Cholesterol',
      'Dermatologic Preparations', 'Diabetes', 'Meds', 'Ear and Eye Preparations', 'Emergency Kit', 'GI Meds', 'GYN Meds', 'Pulmonary', 'Smoking Cessation',
      'Vitamins and Supplements'] },
  location: {
    type: String,
    allowedValues: ['Cabinet 2', 'Back Cabinet', 'Shower Closet', 'Refrig Closet', 'Refrigerator', 'Drawer 6', 'Drawer 9', 'Case 4'] },
  quantity: Number,
});

const bridge = new SimpleSchema2Bridge(formSchema);

/** Renders the Page for adding a document. */
const AddSupply = () => {

  // On submit, insert the data.
  const submit = (data, formRef) => {
    const { name, location, quantity } = data;
    const collectionName = Supplies.getCollectionName();
    const definitionData = { name, location, quantity };
    defineMethod.callPromise({ collectionName, definitionData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal('Success', 'Supply added successfully', 'success');
        formRef.reset();
      });
  };

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  let fRef = null;
  return (
    <Grid id={PAGE_IDS.ADD_SUPPLY} container centered>
      <Grid.Column>
        <Header as="h2" textAlign="center">Add Supplies</Header>
        <AutoForm ref={ref => {
          fRef = ref;
        }} schema={bridge} onSubmit={data => submit(data, fRef)}>
          <Segment>
            <Form.Group widths='equal'>
              <SelectField name='name' />
              <SelectField name='type' />
              <NumField name='quantity' decimal={false} />
              <SelectField name='location' />
            </Form.Group>
            <SubmitField value='Submit'/>
            <ErrorsField />
          </Segment>
        </AutoForm>
      </Grid.Column>
    </Grid>
  );
};

export default AddSupply;
