import React from 'react';
import { Button, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import moment from 'moment';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
// bring should have value to highlight individual quantity
// ListMedicine connects to INFO Button
const MedicineItem = ({ inventories }) => {
  let highlight;
  let note;
  // variable for today's date
  const today = new Date().toDateString();
  // variable to compare today's date with expiration date
  const days = moment(inventories.expDate.toDateString()).diff(today, 'days');

  if (days <= 0) {
    // reminder when medicine has already expired
    note = `This item has expired ${days} days ago.`;
  } else if (days >= 1 && days <= 14) {
    // reminder when medicine is about to expire within two weeks
    note = `This item will expire in ${days} days.`;
  } else {
    note = 'This item is OK for now.';
  }

  if (days <= 0 || (inventories.quantity <= 10 || inventories.quantity === 0 || inventories.quantity === undefined)) {
    // highlights in red when quantity is between 0 and 10 or undefined or medicine has expired
    highlight = 'error';
  } else if ((days >= 1 && days <= 14) || (inventories.quantity <= 50 && inventories.quantity > 10)) {
    // highlights in yellow when quantity is between 11 and 50 or when medicine is about to expire
    highlight = 'warning';
  } else {
    // highlights in green when overall quantity of medicine is good (over 50)
    highlight = 'positive';
  }

  return (
    <Table.Row positive={highlight === 'positive'} warning={highlight === 'warning'} error={highlight === 'error'}>
      <Table.Cell>{inventories.lotNumber}</Table.Cell>
      <Table.Cell>{inventories.medName}</Table.Cell>
      <Table.Cell>{inventories.quantity}</Table.Cell>
      <Table.Cell>{inventories.expDate.toDateString()}</Table.Cell>
      <Table.Cell>{inventories.state}</Table.Cell>
      <Table.Cell>{note}</Table.Cell>
      <Button color='green' content='UPDATE'/>
    </Table.Row>);
};

// Require a document to be passed to this component.
MedicineItem.propTypes = {
  inventories: PropTypes.shape({
    lotNumber: PropTypes.string,
    medName: PropTypes.string,
    quantity: PropTypes.number,
    location: PropTypes.string,
    sourceName: PropTypes.string,
    acquire: PropTypes.string,
    cost: PropTypes.number,
    receiveDate: PropTypes.instanceOf(Date),
    expDate: PropTypes.instanceOf(Date),
    state: PropTypes.string,
    note: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(MedicineItem);
