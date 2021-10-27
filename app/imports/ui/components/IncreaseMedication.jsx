import React from 'react';
import swal from 'sweetalert';
import { Button, Form, Modal } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { SimpleSchema } from 'simpl-schema/dist/SimpleSchema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import {
  AutoForm,
  DateField,
  ErrorsField,
  NumField,
  SelectField,
  SubmitField,
  TextField,
} from 'uniforms-semantic';
import { MedicineSource } from '../../api/medSource/MedicineSourceCollection';
import { defineMethod } from '../../api/base/BaseCollection.methods';

const formSchema = new SimpleSchema({
  medName: String,
  quantityReceived: Number,
  sourceName: String,
  aquired: {
    type: String,
    allowedValues: ['Donated', 'Purchase'],
  },
  purchasedAmount: Number,
  expDate: Date,
});

const bridge = new SimpleSchema2Bridge(formSchema);

const AddMedicineInventory = ({ mName }) => {
  // On submit, insert the data.
  const submit = (data, formRef) => {
    const { medName, quantityReceived, sourceName, aquired, purchasedAmount, expDate } = data;
    const collectionName = MedicineSource.getCollectionName();
    const definitionData = { medName, quantityReceived, sourceName, aquired, purchasedAmount, expDate };
    defineMethod.callPromise({ collectionName, definitionData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal('Success', 'Medicine Inventory added successfully', 'success');
        formRef.reset();
      });
  };

  const [open, setOpen] = React.useState(false);
  let fRef = null;

  // To do -> Autofill the medName textfield with mName passec in.}
  // Autofill the medName textfield with mName passec in.
  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button color='red'>Add</Button>}
    >
      <Modal.Header>Add {mName} Inventory</Modal.Header>
      <Modal.Content>
        <AutoForm ref={ref => {
          fRef = ref;
        }} schema={bridge} onSubmit={data => submit(data, fRef)}>
          <Form.Group widths='equal'>
            <TextField label='Medicine Name' name='medName'/>
            <NumField label='Amount Received' name='quantityReceived'/>
          </Form.Group>
          <Form.Group widths='equal'>
            <TextField name='sourceName'/>
            <SelectField name='aquired'/>
            <NumField name='purchasedAmount' />
            <DateField name='expDate' />
          </Form.Group>
          <SubmitField value='Submit' />
          <ErrorsField />
        </AutoForm>
      </Modal.Content>
    </Modal>
  );
};

AddMedicineInventory.propTypes = {
  mName: PropTypes.string,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default AddMedicineInventory;

/* const formSchema = new SimpleSchema({
  medName: String,
  quantityReceived: Number,
  sourceName: String,
  aquired: {
    type: String,
    allowedValues: ['Donated', 'Purchase'],
  },
  purchasedAmount: Number,
  expDate: Date,
}); */

// const bridge = new SimpleSchema2Bridge(MedicineSource.Schema);

/*
  // On submit, insert the data.
  const submit = (data, formRef) => {
    const { quantityReceived, sourceName, aquired, purchasedAmount, expDate } = data;
    const collectionName = MedicineSource.getCollectionName();
    const medName = mName;
    const definitionData = { medName, quantityReceived, sourceName, aquired, purchasedAmount, expDate };
    defineMethod.callPromise({ collectionName, definitionData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal('Success', 'Medicine Inventory added successfully', 'success');
        formRef.reset();
      });
  };
 */

/*
 <Grid id={PAGE_IDS.ADD_MEDICINE} container centered>
          <Grid.Column>
            <Header as="h2" textAlign="center">Add New {mName} Inventory</Header>
            <AutoForm ref={ref => {
              fRef = ref;
            }} schema={bridge} onSubmit={data => submit(data, fRef)}>
              <Segment>
                <Form.Group widths='equal'>
                  <TextField label='Medicine Name' name='name' value={mName}/>
                  <NumField label='Amount Received' name='quantityReceived'/>
                </Form.Group>
                <Form.Group widths='equal'>
                  <TextField name='sourceName'/>
                  <SelectField name='aquired'/>
                  <NumField name='purchaseAmount' />
                  <DateField name='expDate' />
                </Form.Group>
                <SubmitField value='Submit' />
                <ErrorsField />
              </Segment>
            </AutoForm>
          </Grid.Column>
        </Grid>
 */