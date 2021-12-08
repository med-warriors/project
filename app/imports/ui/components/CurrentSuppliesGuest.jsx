import React from 'react';
import { Loader, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { SupplySource } from '../../api/supplysource/SupplySourceCollection';
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
/** Renders a single row in the List Supplies table. See pages/MedicineAndSupplies.jsx. */
const CurrentSuppliesGuest = ({ supply, ready, source }) => {
  // adds current quantity from way of acquiring supplies to default quantity
// adds current quantity from way of acquiring medicine to default quantity
  const totalQuantity = source.reduce((prev, current) => (prev + current.quantity), 0);
  let highlight;

  if (totalQuantity <= 50 && totalQuantity > 10) {
    // highlights in yellow when total quantity column is between 11 and 50
    highlight = 'warning';
  } else if (totalQuantity <= 10 || totalQuantity === 0 || totalQuantity === undefined) {
    // highlights in red when percentage of total quantity column is between 0 and 10 or undefined
    highlight = 'error';
  } else {
    // highlights in green when overall quantity of supplies is good (over 50)
    highlight = 'positive';
  }
  return ((ready) ? (
    <Table.Row positive={highlight === 'positive'} warning={highlight === 'warning'} error={highlight === 'error'}>
      <Table.Cell>{supply.name}</Table.Cell>
      <Table.Cell>{supply.location}</Table.Cell>
      <Table.Cell>{totalQuantity}</Table.Cell>
      <Table.Cell>{supply.note}</Table.Cell>
    </Table.Row>) : <Loader active>Getting data</Loader>);
};

// Require a document to be passed to this component.
CurrentSuppliesGuest.propTypes = {
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
})(CurrentSuppliesGuest);
