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
import { MedicineSource } from '../../api/medSource/MedicineSourceCollection';
import { MedicineSourceRecord } from '../../api/medsourceRecord/MedicineSourceRecordCollection';

const bridge = new SimpleSchema2Bridge(MedicineSource._schema);

const UpdateMedicineInventory = ({ medicine }) => {

  const submitMedRecord = (data) => {
    const { lotNumber, medName, sourceName, quantity, acquire, cost, receiveDate, expDate, state } = data;
    const editDate = new Date();
    const action = 'Update';
    const change = 'Updated the information';
    // Get the current employee ID number.
    const employee = Meteor.user() ? Meteor.user().username : '';
    const collectionName = MedicineSourceRecord.getCollectionName();
    const definitionData = { lotNumber, medName, quantity, sourceName, acquire, cost, expDate, receiveDate, state, editDate, employee, action, change };
    defineMethod.callPromise({ collectionName, definitionData });
  };

  // On submit, insert the data.
  const submit = (data) => {
    const { lotNumber, medName, quantity, sourceName, acquire, cost, receiveDate, expDate, state, _id } = data;
    const collectionName = MedicineSource.getCollectionName();
    const updateData = { id: _id, lotNumber, medName, quantity, sourceName, acquire, cost, receiveDate, expDate, state };
    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal('Success', 'Supply Inventory update successfully', 'success');
        submitMedRecord(data);
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
      <Modal.Header>Update {medicine.medName} Inventory</Modal.Header>
      <Modal.Content>
        <AutoForm schema={bridge} onSubmit={data => submit(data)} model={medicine}>
          <TextField disabled label='Medicine Name' name='medName'/>
          <Form.Group widths='equal'>
            <TextField name='lotNumber'/>
            <TextField name='sourceName'/>
            <SelectField name='acquire'/>
          </Form.Group>
          <Form.Group widths='equal'>
            <NumField label='Amount Received' name='quantity'/>
            <NumField name='cost' />
          </Form.Group>
          <Form.Group widths='equal'>
            <TextField type='date' label='Expiration Date' name='expDate'/>
            <SelectField label='State' name='state'/>
          </Form.Group>
          <SubmitField value='Update' />
          <ErrorsField />
        </AutoForm>
      </Modal.Content>
    </Modal>
  );
};

UpdateMedicineInventory.propTypes = {
  medicine: PropTypes.shape({
    lotNumber: PropTypes.string,
    medName: PropTypes.string,
    quantity: PropTypes.number,
    sourceName: PropTypes.string,
    acquire: PropTypes.string,
    cost: PropTypes.number,
    receiveDate: PropTypes.instanceOf(Date),
    expDate: PropTypes.instanceOf(Date),
    state: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(UpdateMedicineInventory);
