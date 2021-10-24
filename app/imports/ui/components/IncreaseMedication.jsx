import React from 'react';
import { Form, Grid, Header, Modal, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import swal from 'sweetalert';
import { SimpleSchema } from 'simpl-schema/dist/SimpleSchema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, DateField, ErrorsField, NumField, SelectField, SubmitField, TextField } from 'uniforms-semantic';
import { MedicineSource } from '../../api/medsource/MedicineSourceCollection';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import { PAGE_IDS } from '../utilities/PageIDs';

const aquiredType = ['Donated', 'Purchased'];

const fSchema = new SimpleSchema({
  medName: String,
  quantityReceived: Number,
  sourceName: String,
  aquired: {
    type: String,
    allowedValues: aquiredType,
  },
  purchasedAmount: {
    type: String,
    // Todo
    // allowedValues is defaulted to type: String ('Donated')
    // if aquired = 'Donated', else type: Number
    allowedValues: aquiredType,
    default: 'Donated',
  },
  inputDate: Date,
  expDate: Date,
});

const bridge = new SimpleSchema2Bridge(fSchema);

const IncreaseMedication = (name) => {
// On submit, insert the data.
  const submit = (data, formRef) => {
    const { quantityReceived, sourceName, aquired, purchasedAmount, inputDate, expDate } = data;
    const collectionName = MedicineSource.getCollectionName();
    const medName = name;
    const definitionData = { medName, quantityReceived, sourceName, aquired, purchasedAmount, inputDate, expDate };
    defineMethod.callPromise({ collectionName, definitionData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal('Success', 'Medicine added successfully', 'success');
        formRef.reset();
      });
  };

  // Renders a Modal Form.
  // Asked user to input new medication information regarding regarding source. Increments Medication quantity, with
  // respect to Medication name
  let fRef = null;
  return (
    <Modal>
      <Grid id={PAGE_IDS.ADD_MEDICINE} container centered>
        <Grid.Column>
          <Header as="h2" textAlign="center">Add New Medicine</Header>
          <AutoForm ref={ref => {
            fRef = ref;
          }} schema={bridge} onSubmit={data => submit(data, fRef)}>
            <Segment>
              <Form.Group widths='equal'>
                <TextField label='Medicine Name' name='name'/>
                <SelectField label='Medicine Type' name='type'/>
                <NumField name='quantity' decimal={false} />
                <SelectField name='location'/>
              </Form.Group>
              <Form.Group widths='equal'>
                <SelectField name='lotNumber'/>
                <DateField name='expirationDate'/>
                <NumField name='should_have' />
                <TextField name='source' />
              </Form.Group>
              <SubmitField value='Submit' />
              <ErrorsField />
            </Segment>
          </AutoForm>
        </Grid.Column>
      </Grid>
    </Modal>
  )
};

// Require a document to be passed to this component.
IncreaseMedication.propTypes = {
  medSource: PropTypes.shape({
    medName: PropTypes.string,
    quantityReceived: PropTypes.number,
    expDate: PropTypes.instanceOf(Date),
    sourceName: PropTypes.string,
    aquired: PropTypes.string,
    purchasedAmount: PropTypes.string,
    inputDate: PropTypes.instanceOf(Date),

  }).isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(IncreaseMedication);
