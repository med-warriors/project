import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

/** Renders a single row in the List Medicine table. See pages/MedicineandSupplies.jsx. */
const HistoryItem = ({ transationHistory }) => (
  <Table.Row>
    <Table.Cell>{transationHistory.date.toDateString()}</Table.Cell>
    <Table.Cell>{transationHistory.transact}</Table.Cell>
    <Table.Cell>{transationHistory.type}</Table.Cell>
    <Table.Cell>{transationHistory.patientName}</Table.Cell>
    <Table.Cell>{transationHistory.prescription}</Table.Cell>
    <Table.Cell>{transationHistory.employee}</Table.Cell>
  </Table.Row>
);

// Require a document to be passed to this component.
HistoryItem.propTypes = {
  transationHistory: PropTypes.shape({
    date: PropTypes.instanceOf(Date),
    transact: PropTypes.string,
    type: PropTypes.string,
    patientName: PropTypes.string,
    prescription: PropTypes.string,
    employee: PropTypes.number,
    _id: PropTypes.string,
  }).isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(HistoryItem);
