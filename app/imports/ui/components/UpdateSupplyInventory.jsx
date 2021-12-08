import React from 'react';
import swal from 'sweetalert';
import { Button, Form, Modal } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import {
  AutoForm,
  ErrorsField,
  NumField,
  SelectField,
  SubmitField,
  TextField,
} from 'uniforms-semantic';
import { withRouter } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { defineMethod, updateMethod } from '../../api/base/BaseCollection.methods';
import { SupplySource } from '../../api/supplysource/SupplySourceCollection';
import { SupplySourceRecord } from '../../api/supplysourceRecord/SupplySourceRecordCollection';

const bridge = new SimpleSchema2Bridge(SupplySource._schema);

const UpdateSupplyInventory = ({ supply }) => {

  const submitSupRecord = (data) => {
    const { supplyName, quantity, sourceName, acquire, cost, receiveDate, state } = data;
    const editDate = new Date();
    const action = 'Update';
    const change = 'Updated the information';
    // Get the current employee ID number.
    const employee = Meteor.user() ? Meteor.user().username : '';
    const collectionName = SupplySourceRecord.getCollectionName();
    const definitionData = { supplyName, quantity, sourceName, acquire, cost, receiveDate, state, editDate, employee, action, change };
    defineMethod.callPromise({ collectionName, definitionData });
  };

  // On submit, insert the data.
  const submit = (data) => {
    const { supplyName, quantity, sourceName, acquire, cost, state, receiveDate, _id } = data;
    const collectionName = SupplySource.getCollectionName();
    const updateData = { id: _id, supplyName, quantity, sourceName, acquire, cost, receiveDate, state };
    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal('Success', 'Supply Inventory update successfully', 'success');
        submitSupRecord(data);
      });
  };

  const [update, setUpdate] = React.useState(false);

  return (
    <Modal
      onClose={() => setUpdate(false)}
      onOpen={() => setUpdate(true)}
      open={update}
      trigger={<Button color='green'>UPDATE</Button>}
    >
      <Modal.Header>Update {supply.supplyName} Inventory</Modal.Header>
      <Modal.Content>
        <AutoForm schema={bridge} onSubmit={data => submit(data)} model={supply}>
          <TextField disabled label='Supply Name' name='supplyName'/>
          <Form.Group widths='equal'>
            <TextField name='sourceName'/>
            <SelectField name='acquire'/>
            <NumField name='cost' />
          </Form.Group>
          <Form.Group widths='equal'>
            <NumField label='Amount Received' name='quantity'/>
            <SelectField label='State' name='state'/>
          </Form.Group>
          <SubmitField value='Update' />
          <ErrorsField />
        </AutoForm>
      </Modal.Content>
    </Modal>
  );
};

UpdateSupplyInventory.propTypes = {
  supply: PropTypes.shape({
    supplyName: PropTypes.string,
    quantity: PropTypes.number,
    sourceName: PropTypes.string,
    acquire: PropTypes.string,
    cost: PropTypes.number,
    receiveDate: PropTypes.instanceOf(Date),
    state: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(UpdateSupplyInventory);
