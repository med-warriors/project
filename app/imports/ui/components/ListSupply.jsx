import React from 'react';
import { Table, Modal, Loader, Button } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { SupplySource } from '../../api/supplysource/SupplySourceCollection';
import SupplyItem from './SupplyItem';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
const ListSupply = ({ ready, inventory, supply }) => {

  const [open, setOpen] = React.useState(false);

  return ((ready) ? (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size={'large'}
      trigger={<Button color='blue'>DI</Button>}
    >
      <Modal.Header>{supply.name}</Modal.Header>
      <Modal.Content>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Quantity</Table.HeaderCell>
              <Table.HeaderCell>State</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {inventory.map((inventories) => <SupplyItem key={inventories._id} inventories={inventories} />)}
          </Table.Body>
        </Table>
      </Modal.Content>
    </Modal>
  ) : <Loader active>Getting data</Loader>);
};

// Require an array of Stuff documents in the props.
ListSupply.propTypes = {
  supply: PropTypes.shape({
    name: PropTypes.string,
    location: PropTypes.string,
    note: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
  inventory: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(({ supply }) => {
  // Get access to Stuff documents.
  const subscription = SupplySource.subscribeSupply();
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the Stuff documents and sort them by name.
  const inventory = SupplySource.find({ supplyName: supply.name }, { sort: { name: 1 } }).fetch();
  return {
    inventory,
    ready,
  };
})(ListSupply);
