import React from 'react';
import { Grid, Form, Segment, Header } from 'semantic-ui-react';
import { AutoForm, ErrorsField, SelectField, SubmitField, TextField } from 'uniforms-semantic';
import swal from 'sweetalert';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Supplies } from '../../api/supply/SupplyCollection';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

// Create a schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
  name: String,
  location: {
    type: String,
    allowedValues: ['Cabinet 2', 'Back Cabinet', 'Shower Closet', 'Refrig Closet', 'Refrigerator', 'Drawer 6', 'Drawer 9', 'Case 4'] },
  note: String,
});

const bridge = new SimpleSchema2Bridge(formSchema);

/** Renders the Page for adding a document. */
const AddSupply = () => {

  // On submit, insert the data.
  const submit = (data, formRef) => {
    const { name, location, note } = data;
    const collectionName = Supplies.getCollectionName();
    const definitionData = { name, location, note };
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
        <Header as="h2" textAlign="center">Add New Supplies</Header>
        <AutoForm ref={ref => {
          fRef = ref;
        }} schema={bridge} onSubmit={data => submit(data, fRef)}>
          <Segment>
            <Form.Group widths='equal'>
              <TextField name='name' id={COMPONENT_IDS.ADD_SUPPLIES_FORM_NAME}/>
              <SelectField name='location' id={COMPONENT_IDS.ADD_SUPPLIES_FORM_LOCATION}/>
              <TextField name='note' id={COMPONENT_IDS.ADD_SUPPLIES_FORM_NOTE}/>
            </Form.Group>
            <SubmitField value='Submit' id={COMPONENT_IDS.ADD_SUPPLIES_FORM_SUBMIT}/>
            <ErrorsField />
          </Segment>
        </AutoForm>
      </Grid.Column>
    </Grid>
  );
};

export default AddSupply;
