import React from 'react';
import { Table, Modal, Loader, Button } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { MedicineSource } from '../../api/medSource/MedicineSourceCollection';
import MedicineItem from './MedicineItem';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
const ListMedicine = ({ ready, inventory, medicine, source }) => {
  let note;
  const [open, setOpen] = React.useState(false);

  // adds current quantity from way of acquiring medicine to default quantity
  const totalQuantity = source.reduce((prev, current) => (prev + current.quantity), 0);

  let highlight;

  if (totalQuantity / medicine.shouldHave <= 0.5 && totalQuantity / medicine.shouldHave > 0.1) {
    // highlights in yellow when percentage of total quantity and should have columns is between 11% and 50%
    highlight = 'warning';
  } else if (totalQuantity / medicine.shouldHave <= 0.1 || totalQuantity / medicine.shouldHave === 0 || totalQuantity / medicine.shouldHave === undefined) {
    // highlights in red when percentage of total quantity and should have columns is between 0% and 10% or undefined
    highlight = 'error';
  } else {
    // highlights in green when overall quantity of medicine is good (over 50%)
    highlight = 'positive';
  }

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
              <Table.HeaderCell>Lot #</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Quantity</Table.HeaderCell>
              <Table.HeaderCell>Exp Date</Table.HeaderCell>
              <Table.HeaderCell>State</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body positive={highlight === 'positive'} warning={highlight === 'warning'} error={highlight === 'error'}>
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
    type: PropTypes.string,
    location: PropTypes.string,
    shouldHave: PropTypes.number,
    note: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
  inventory: PropTypes.array.isRequired,
  source: PropTypes.array.isRequired,
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
  // Provides the Medicine Source documents and sorts them by name.
  const source = MedicineSource.find({ medName: medicine.name, state: { $in: ['Acted', 'Reserves'] } }, { sort: { name: 1 } }).fetch();
  return {
    inventory,
    source,
    ready,
  };
})(ListMedicine);
