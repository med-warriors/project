import React from 'react';
import { Form, Grid, Segment, Header } from 'semantic-ui-react';
import { AutoForm, ErrorsField, NumField, SubmitField, TextField, SelectField } from 'uniforms-semantic';
import swal from 'sweetalert';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { locSpot, Medicines } from '../../api/medicine/MedicineCollection';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

// Create a schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
  name: String,
  type: {
    type: String,
    allowedValues: [
      'Allergy & Cold Medicines',
      'Analgesics/Antiinflammatory',
      'Antihypertensives',
      'Antimicrobials',
      'Cardiac/Cholesterol',
      'Dermatologic Preparations',
      'Diabetes Meds',
      'Ear and Eye Preparations',
      'Emergency Kit',
      'GI Meds',
      'GYN Meds',
      'Pulmonary',
      'Smoking Cessation',
      'Vitamins and Supplements'],
  },
  location: {
    type: String,
    allowedValues: locSpot,
  },
  shouldHave: Number,
  note: String,
});

const bridge = new SimpleSchema2Bridge(formSchema);

/** Renders the Page for adding a document. */
const AddMedicine = () => {

  // On submit, insert the data.
  const submit = (data, formRef) => {
    const { name, type, shouldHave, location, note } = data;
    const collectionName = Medicines.getCollectionName();
    const definitionData = { name, type, shouldHave, location, note };
    defineMethod.callPromise({ collectionName, definitionData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal('Success', 'Medicine added successfully', 'success');
        formRef.reset();
      });
  };

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  let fRef = null;
  return (
    <Grid id={PAGE_IDS.ADD_MEDICINE} container centered>
      <Grid.Column>
        <Header as="h2" textAlign="center">Add New Medicine</Header>
        <AutoForm ref={ref => {
          fRef = ref;
        }} schema={bridge} onSubmit={data => submit(data, fRef)}>
          <Segment>
            <Form.Group widths='equal'>
              <TextField label='Medicine Name' name='name' id={COMPONENT_IDS.ADD_MEDICINE_FORM_NAME}/>
              <SelectField label='Medicine Type' name='type' id={COMPONENT_IDS.ADD_MEDICINE_FORM_TYPE}/>
              <NumField label='Required Quantity' name='shouldHave' decimal={false} min={0} id={COMPONENT_IDS.ADD_MEDICINE_FORM_QUANTITY}/>
            </Form.Group>
            <Form.Group widths='equal'>
              <SelectField label='Location' name='location' id={COMPONENT_IDS.ADD_MEDICINE_FORM_LOCATION}/>
              <TextField name='note' id={COMPONENT_IDS.ADD_MEDICINE_FORM_NOTE}/>
            </Form.Group>
            <SubmitField value='Submit' id={COMPONENT_IDS.ADD_MEDICINE_FORM_SUBMIT}/>
            <ErrorsField/>
          </Segment>
        </AutoForm>
      </Grid.Column>
    </Grid>
  );
};

export default AddMedicine;
