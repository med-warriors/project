import React from 'react';
import { Grid, Loader, Header, Segment, Button, Icon } from 'semantic-ui-react';
import swal from 'sweetalert';
import { AutoForm, ErrorsField, NumField, SelectField, SubmitField, TextField } from 'uniforms-semantic';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import { Supplies } from '../../api/supply/SupplyCollection';
import { updateMethod } from '../../api/base/BaseCollection.methods';
import { PAGE_IDS } from '../utilities/PageIDs';

const bridge = new SimpleSchema2Bridge(Supplies._schema);

const supplyLocation = [
  { label: 'Cabinet 2', value: 'Cabinet 2' },
  { label: 'Case 4', value: 'Case 4' },
  { label: 'Refrigerator', value: 'Refrigerator' },
  { label: 'Refrig Closet', value: 'Refrig Closet' },
];

/** Renders the Page for editing supply document. */
const EditSupply = ({ doc, ready }) => {

  // On successful submit, insert the data.
  const submit = (data) => {
    const { name, location, quantity, source, status, _id } = data;
    const collectionName = Supplies.getCollectionName();
    const updateData = { id: _id, name, location, quantity, source, status };
    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => swal('Success', 'Item updated successfully', 'success'));
  };

  // need to add drop down fields for source, status, name. and use quantity to remove not update?
  return (ready) ? (
    <Grid id={PAGE_IDS.EDIT_STUFF} container centered>
      <Grid.Column>
        <Header as="h2" textAlign="center">Update Supply</Header>
        <AutoForm schema={bridge} onSubmit={data => submit(data)} model={doc}>
          <Segment>
            <TextField name='name' />
            <NumField name='quantity' decimal={false} />
            <SelectField name='location' options={supplyLocation} />
            <TextField name='source' />
            <TextField name='status' />
            <SubmitField value='Submit' />
            <ErrorsField />
          </Segment>
          <Button id="edit-prof">
            <Button.Content visible as={NavLink} activeClassName="active" exact to="/medicine-and-supplies" key='medicine-and-supplies'><Icon name='arrow left' />Back</Button.Content>
          </Button>
        </AutoForm>
      </Grid.Column>
    </Grid>
  ) : <Loader active>Getting data</Loader>;
};

// Require the presence of a Supply document in the props object. Uniforms adds 'model' to the props, which we use.
EditSupply.propTypes = {
  doc: PropTypes.object,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const { _id } = useParams();
  const documentId = _id;
  // Get access to Supply documents.
  const subscription = Supplies.subscribeSupply();
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the document
  const doc = Supplies.findDoc(documentId);
  return {
    doc,
    ready,
  };
})(EditSupply);
