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
import { acquiredType, SupplySource } from '../../api/supplysource/SupplySourceCollection';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import { SupplySourceRecord } from '../../api/supplysourceRecord/SupplySourceRecordCollection';

const inputState = ['Acted', 'Reserves'];

const formSchema = new SimpleSchema({
  supplyName: String,
  quantity: Number,
  sourceName: String,
  acquire: {
    type: String,
    allowedValues: acquiredType,
  },
  cost: Number,
  state: {
    type: String,
    allowedValues: inputState,
    defaultValue: 'Reserves',
  },
});

const bridge = new SimpleSchema2Bridge(formSchema);

const AddSupplyInventory = ({ supName }) => {
  const submitRecord = (data, receiveDate) => {
    const { supplyName, quantity, sourceName, acquire, cost, state } = data;
    const editDate = new Date();
    const action = 'In';
    const change = '-';
    // Get the current employee ID number.
    const employee = Meteor.user() ? Meteor.user().username : '';
    const collectionName = SupplySourceRecord.getCollectionName();
    const definitionData = { supplyName, quantity, sourceName, acquire, cost, receiveDate, state, editDate, employee, action, change };
    defineMethod.callPromise({ collectionName, definitionData });
  };

  // On submit, insert the data.
  const submit = (data, formRef) => {
    const { supplyName, quantity, sourceName, acquire, cost, state } = data;
    const receiveDate = new Date();
    const collectionName = SupplySource.getCollectionName();
    const definitionData = { supplyName, quantity, sourceName, acquire, cost, receiveDate, state };
    defineMethod.callPromise({ collectionName, definitionData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal('Success', 'Supply Inventory added successfully', 'success');
        submitRecord(data, receiveDate);
        formRef.reset();
      });
  };

  const [open, setOpen] = React.useState(false);
  let fRef = null;

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button color='red'>Add</Button>}
    >
      <Modal.Header>Add {supName} Inventory</Modal.Header>
      <Modal.Content>
        <AutoForm ref={ref => {
          fRef = ref;
        }} schema={bridge} onSubmit={data => submit(data, fRef)}>
          <TextField disabled label='Supply Name' name='supplyName' value={supName}/>
          <Form.Group widths='equal'>
            <TextField name='sourceName'/>
            <SelectField name='acquire'/>
            <NumField name='cost' />
          </Form.Group>
          <Form.Group widths='equal'>
            <NumField label='Amount Received' name='quantity'/>
            <SelectField label='State' name='state'/>
          </Form.Group>
          <SubmitField value='Submit' />
          <ErrorsField />
        </AutoForm>
      </Modal.Content>
    </Modal>
  );
};

AddSupplyInventory.propTypes = {
  supName: PropTypes.string,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default AddSupplyInventory;
