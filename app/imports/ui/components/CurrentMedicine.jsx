import React from 'react';
import { Button, Loader, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import AddMedicineInventory from './IncreaseMedication';
import Notice from './Notice';
import ListMedicine from './ListMedicine';
import { MedicineSource } from '../../api/medSource/MedicineSourceCollection';

// Changes text to red, yellow, or green, based on quantity of medicine
/*
const getColor = (quantity, threshold) => {
  if (quantity >= threshold) return '#25A18E';
  if (quantity < threshold) return '#A18E25';
  return '#A12358';
};
*/
/** Renders a single row in the List Medicine table. See pages/MedicineAndSupplies.jsx. */
const CurrentMedicine = ({ medicine, ready, source }) => {
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
    <Table.Row positive={highlight === 'positive'} warning={highlight === 'warning'} error={highlight === 'error'}>
      <Table.Cell>{medicine.name}</Table.Cell>
      <Table.Cell>{medicine.type}</Table.Cell>
      <Table.Cell>{medicine.location}</Table.Cell>
      <Table.Cell>{medicine.shouldHave}</Table.Cell>
      <Table.Cell>{totalQuantity}</Table.Cell>
      <Table.Cell>{medicine.note}</Table.Cell>
      <Table.Cell>
        <Button.Group vertical>
          <AddMedicineInventory mName={medicine.name}/>
          <Button color='green' content='UPDATE'/>
          <ListMedicine medicine={medicine}/>
          <Notice medicine={medicine}/>
        </Button.Group>
      </Table.Cell>
    </Table.Row>) : <Loader active>Getting data</Loader>);
};

// Require a document to be passed to this component.
CurrentMedicine.propTypes = {
  medicine: PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
    location: PropTypes.string,
    shouldHave: PropTypes.number,
    note: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
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
  const source = MedicineSource.find({ medName: medicine.name, state: { $in: ['Acted', 'Reserves'] } }, { sort: { name: 1 } }).fetch();
  return {
    source,
    ready,
  };
})(CurrentMedicine);
