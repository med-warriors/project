import React from 'react';
import { Meteor } from 'meteor/meteor';
import swal from 'sweetalert';
import { Button, Form, Modal } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { SimpleSchema } from 'simpl-schema/dist/SimpleSchema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import {
  AutoForm,
  ErrorsField,
  NumField,
  SelectField,
  SubmitField,
  TextField,
} from 'uniforms-semantic';
import { acquiredType, MedicineSource } from '../../api/medSource/MedicineSourceCollection';
import { MedicineSourceRecord } from '../../api/medsourceRecord/MedicineSourceRecordCollection';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

const inputState = ['Acted', 'Reserves'];

const formSchema = new SimpleSchema({
  lotNumber: String,
  medName: String,
  quantity: Number,
  sourceName: String,
  acquire: {
    type: String,
    allowedValues: acquiredType,
  },
  cost: Number,
  expDate: Date,
  state: {
    type: String,
    allowedValues: inputState,
    defaultValue: 'Reserves',
  },
});

const bridge = new SimpleSchema2Bridge(formSchema);

const AddMedicineInventory = ({ mName }) => {
  const submitRecord = (data, receiveDate) => {
    const { lotNumber, medName, quantity, sourceName, acquire, cost, expDate, state } = data;
    const editDate = new Date();
    const action = 'In';
    const change = '-';
    // Get the current employee ID number.
    const employee = Meteor.user() ? Meteor.user().username : '';
    const collectionName = MedicineSourceRecord.getCollectionName();
    const definitionData = { lotNumber, medName, quantity, sourceName, acquire, cost, expDate, receiveDate, state, editDate, employee, action, change };
    defineMethod.callPromise({ collectionName, definitionData });
  };

  // On submit, insert the data.
  const submit = (data, formRef) => {
    const { lotNumber, medName, quantity, sourceName, acquire, cost, expDate, state } = data;
    const receiveDate = new Date();
    const collectionName = MedicineSource.getCollectionName();
    const definitionData = { lotNumber, medName, quantity, sourceName, acquire, cost, receiveDate, expDate, state };
    defineMethod.callPromise({ collectionName, definitionData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal('Success', 'Medicine Inventory added successfully', 'success');
        submitRecord(data, receiveDate);
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
      trigger={<Button color='red' id={COMPONENT_IDS.MEDICINE_AND_SUPPLIES_MED_ADD}>ADD</Button>}
    >
      <Modal.Header>Add {mName} Inventory</Modal.Header>
      <Modal.Content>
        <AutoForm ref={ref => {
          fRef = ref;
        }} schema={bridge} onSubmit={data => submit(data, fRef)}>
          <Form.Group widths='equal'>
            <TextField disabled label='Medicine Name' name='medName' value={mName}/>
            <TextField label='Lot Number' name='lotNumber' id={COMPONENT_IDS.MED_ADD_LOT_NUMBER}/>
          </Form.Group>
          <Form.Group>
            <SelectField label='State' name='state' id={COMPONENT_IDS.MED_ADD_STATE}/>
            <TextField type='date' label='Expiration Date' name='expDate' id={COMPONENT_IDS.MED_ADD_EXP_DATE}/>
          </Form.Group>
          <Form.Group widths='equal'>
            <TextField name='sourceName' id={COMPONENT_IDS.MED_ADD_SOURCE_NAME}/>
            <SelectField name='acquire' id={COMPONENT_IDS.MED_ADD_ACQUIRE}/>
          </Form.Group>
          <Form.Group>
            <NumField name='cost' id={COMPONENT_IDS.MED_ADD_COST}/>
            <NumField label='Amount Received' name='quantity' id={COMPONENT_IDS.MED_ADD_QUANTITY}/>
          </Form.Group>
          <SubmitField value='Submit' id={COMPONENT_IDS.MED_ADD_SUBMIT}/>
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

// Ignore content below for now. Main purpose below was to copy-paste if needed

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
