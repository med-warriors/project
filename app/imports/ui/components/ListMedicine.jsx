import React from 'react';
import { Table, Modal, Loader, Button } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { MedicineSource } from '../../api/medSource/MedicineSourceCollection';
import MedicineItem from './MedicineItem';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
const ListMedicine = ({ ready, inventory, medicine }) => {
  const [open, setOpen] = React.useState(false);

  return ((ready) ? (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size={'large'}
      trigger={<Button color='blue'>INFO</Button>}
    >
      <Modal.Header>{medicine.name}</Modal.Header>
      <Modal.Content>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Lot #</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Quantity</Table.HeaderCell>
              <Table.HeaderCell>Exp Date</Table.HeaderCell>
              <Table.HeaderCell>State</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {inventory.map((inventories) => <MedicineItem key={inventories._id} inventories={inventories}/>)}
          </Table.Body>
        </Table>
      </Modal.Content>
    </Modal>
  ) : <Loader active>Getting data</Loader>);
};

// Require an array of Stuff documents in the props.
ListMedicine.propTypes = {
  medicine: PropTypes.shape({
    name: PropTypes.string,
    quantity: PropTypes.number,
    type: PropTypes.string,
    location: PropTypes.string,
    shouldHave: PropTypes.number,
    expDate: PropTypes.instanceOf(Date),
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
})(ListMedicine);
