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
import { Supplies } from '../../api/supply/SupplyCollection';
import { updateMethod } from '../../api/base/BaseCollection.methods';

const bridge = new SimpleSchema2Bridge(Supplies._schema);

const UpdateSupply = ({ supply }) => {
  // On submit, insert the data.
  const submit = (data) => {
    const { name, location, note, _id } = data;
    const collectionName = Supplies.getCollectionName();
    const updateData = { id: _id, name, location, note };
    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal('Success', 'Supply update successfully', 'success');
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
      <Modal.Header>Update {supply.name}</Modal.Header>
      <Modal.Content>
        <AutoForm schema={bridge} onSubmit={data => submit(data)} model={supply}>
          <Form.Group widths='equal'>
            <TextField name='name'/>
            <SelectField name='location'/>
          </Form.Group>
          <TextField name='note'/>
          <TextField name='_id'/>
          <SubmitField value='Update' />
          <ErrorsField />
        </AutoForm>
      </Modal.Content>
    </Modal>
  );
};

UpdateSupply.propTypes = {
  supply: PropTypes.shape({
    name: PropTypes.string,
    location: PropTypes.string,
    note: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(UpdateSupply);
