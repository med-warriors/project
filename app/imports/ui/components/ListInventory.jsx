import React from 'react';
import { Table, Modal, Loader, Button } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { MedicineSource } from '../../api/medSource/MedicineSourceCollection';
import InventoryItem from './InventoryItem';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
const ListInventory = ({ ready, inventory, medicine }) => {

  const [open, setOpen] = React.useState(false);

  return ((ready) ? (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size={'large'}
      trigger={<Button color='blue'>DI</Button>}
    >
      <Modal.Header>{medicine.name}</Modal.Header>
      <Modal.Content>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>lotNumber</Table.HeaderCell>
              <Table.HeaderCell>medName</Table.HeaderCell>
              <Table.HeaderCell>quantity</Table.HeaderCell>
              <Table.HeaderCell>location</Table.HeaderCell>
              <Table.HeaderCell>sourceName</Table.HeaderCell>
              <Table.HeaderCell>acquire</Table.HeaderCell>
              <Table.HeaderCell>cost</Table.HeaderCell>
              <Table.HeaderCell>receiveDate</Table.HeaderCell>
              <Table.HeaderCell>expDate</Table.HeaderCell>
              <Table.HeaderCell>state</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {inventory.map((inventories) => <InventoryItem key={inventories._id} inventories={inventories} />)}
          </Table.Body>
        </Table>
      </Modal.Content>
    </Modal>
  ) : <Loader active>Getting data</Loader>);
};

// Require an array of Stuff documents in the props.
ListInventory.propTypes = {
  medicine: PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
    should_have: PropTypes.number,
    note: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
  inventory: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(({ medicine }) => {
  // Get access to Stuff documents.
  const subscription = MedicineSource.subscribeMedicineSource();
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the Stuff documents and sort them by name.
  const inventory = MedicineSource.find({ medName: medicine.name }, { sort: { name: 1 } }).fetch();
  return {
    inventory,
    ready,
  };
})(ListInventory);