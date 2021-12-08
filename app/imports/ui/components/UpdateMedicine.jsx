import React from 'react';
import swal from 'sweetalert';
import { Button, Form, Modal } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import {
  AutoForm,
  ErrorsField,
  SelectField,
  SubmitField,
  TextField,
} from 'uniforms-semantic';
import { withRouter } from 'react-router-dom';
import { Medicines } from '../../api/medicine/MedicineCollection';
import { updateMethod } from '../../api/base/BaseCollection.methods';

const bridge = new SimpleSchema2Bridge(Medicines._schema);

const UpdateMedicine = ({ medicine }) => {
  // On submit, insert the data.
  const submit = (data) => {
    const { name, type, location, note, _id } = data;
    const collectionName = Medicines.getCollectionName();
    const definitionData = { id: _id, name, type, location, note };
    updateMethod.callPromise({ collectionName, definitionData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal('Success', 'Medicine update successfully', 'success');
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
      <Modal.Header>Update {medicine.name}</Modal.Header>
      <Modal.Content>
        <AutoForm schema={bridge} onSubmit={data => submit(data)} model={medicine}>
          <Form.Group widths='equal'>
            <TextField name='name'/>
            <SelectField name='type'/>
            <SelectField name='location'/>
          </Form.Group>
          <TextField name='note'/>
          <SubmitField value='Update' />
          <ErrorsField />
        </AutoForm>
      </Modal.Content>
    </Modal>
  );
};

UpdateMedicine.propTypes = {
  medicine: PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
    location: PropTypes.string,
    note: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(UpdateMedicine);
