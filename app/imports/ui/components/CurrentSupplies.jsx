import React from 'react';
import { Button, Loader, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { SupplySource } from '../../api/supplysource/SupplySourceCollection';
import ListSupply from './ListSupply';
import AddSupplyInventory from './AddSupplyInventory';
import { removeItMethod } from '../../api/base/BaseCollection.methods';
import { Supplies } from '../../api/supply/SupplyCollection';

/*
// Changes text to red, yellow, or green, based on quantity of supplies
const getColor = (quantity) => {
  // colors text in green
  if (quantity >= 20) return '#25A18E';
  // colors text in yellow
  if (quantity >= 10 && quantity < 20) return '#A18E25';
  // colors text in red
  return '#A12358';
};
*/
/** Renders a single row in the List Supplies table. See pages/MedicineandSupplies.jsx. */
const CurrentSupplies = ({ supply, ready, source }) => {
  const handleChange = () => {
    const collectionName = Supplies.getCollectionName();
    const instance = supply._id;
    removeItMethod.callPromise({ collectionName, instance });
  };
  // adds current quantity from way of acquiring medicine to default quantity
  const totalQuantity = source.reduce((prev, current) => (prev + current.quantity), 0);
  let highlight;

  if (totalQuantity <= 0.5 && totalQuantity > 0.1) {
    // highlights in yellow when percentage of total quantity and should have columns is between 11% and 50%
    highlight = 'warning';
  } else if (totalQuantity <= 0.1 || totalQuantity === 0 || totalQuantity === undefined) {
    // highlights in red when percentage of total quantity and should have columns is between 0% and 10% or undefined
    highlight = 'error';
  } else if (totalQuantity <= 0.1) {
    highlight = 'warning';
  } else {
    // highlights in green when overall quantity of medicine is good (over 50%)
    highlight = 'positive';
  }
  return ((ready) ? (
    <Table.Row positive={highlight === 'positive'} warning={highlight === 'warning'} error={highlight === 'error'}>
      <Table.Cell>{supply.name}</Table.Cell>
      <Table.Cell>{supply.location}</Table.Cell>
      <Table.Cell>{totalQuantity}</Table.Cell>
      <Table.Cell>{supply.note}</Table.Cell>
      <Table.Cell>
        <Button.Group vertical>
          <AddSupplyInventory supName={supply.name}/>
          <Button color='green' content='UPDATE'/>
          <ListSupply supply={supply}/>
          <Button color='orange' content='DELETE' onClick={handleChange}/>
        </Button.Group>
      </Table.Cell>
    </Table.Row>) : <Loader active>Getting data</Loader>);
};

// Require a document to be passed to this component.
CurrentSupplies.propTypes = {
  supply: PropTypes.shape({
    name: PropTypes.string,
    location: PropTypes.string,
    note: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
  source: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(({ supply }) => {
  // Get access to Stuff documents.
  const subscription = SupplySource.subscribeSupply();
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the Stuff documents and sort them by name.
  const source = SupplySource.find({ supplyName: supply.name, state: { $in: ['Acted', 'Reserves'] } }, { sort: { name: 1 } }).fetch();
  return {
    source,
    ready,
  };
})(CurrentSupplies);
