import React from 'react';
import { Button, Loader, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import AddMedicineInventory from './IncreaseMedication';
import ListInventory from './ListInventory';
import { MedicineSource } from '../../api/medSource/MedicineSourceCollection';

// Changes text to red, yellow, or green, based on quantity of medicine
/*
const getColor = (quantity, threshold) => {
  if (quantity >= threshold) return '#25A18E';
  if (quantity < threshold) return '#A18E25';
  return '#A12358';
};
*/
/** Renders a single row in the List Medicine table. See pages/MedicineandSupplies.jsx. */
const CurrentMedicine = ({ medicine, ready, source }) => {
  const totalQuantity = source.reduce(function (prev, current) {
    return prev + current.quantity;
  }, 0);

  let highlight;
  if (medicine.shouldHave > totalQuantity) {
    highlight = 'error';
  } else
  if (medicine.shouldHave === totalQuantity) {
    highlight = 'warning';
  }
  return ((ready) ? (
    <Table.Row error={highlight === 'error'} warning={highlight === 'warning'}>
      <Table.Cell>{medicine.name}</Table.Cell>
      <Table.Cell>{medicine.type}</Table.Cell>
      <Table.Cell>{medicine.shouldHave}</Table.Cell>
      <Table.Cell>{totalQuantity}</Table.Cell>
      <Table.Cell>{medicine.note}</Table.Cell>
      <Table.Cell>
        <AddMedicineInventory mName={medicine.name}/>
        <Button color='green' content= 'UPDATE'/>
        <ListInventory medicine={medicine}/>
      </Table.Cell>
    </Table.Row>) : <Loader active>Getting data</Loader>);
};

// Require a document to be passed to this component.
CurrentMedicine.propTypes = {
  medicine: PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
    shouldHave: PropTypes.number,
    note: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
  source: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
// export default withRouter(CurrentMedicine);
// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(({ medicine }) => {
  // Get access to Stuff documents.
  const subscription = MedicineSource.subscribeMedicineSource();
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the Stuff documents and sort them by name.
  const source = MedicineSource.find({ medName: medicine.name }, { sort: { name: 1 } }).fetch();
  return {
    source,
    ready,
  };
})(CurrentMedicine);
