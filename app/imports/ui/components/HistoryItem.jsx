import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

/** Renders a single row in the List Medicine table. See pages/MedicineandSupplies.jsx. */
const HistoryItem = ({ history }) => (
  <Table.Row>
    <Table.Cell>{history.date.toDateString()}</Table.Cell>
    <Table.Cell>{history.transact}</Table.Cell>
    <Table.Cell>{history.type}</Table.Cell>
    <Table.Cell>{history.patientName}</Table.Cell>
    <Table.Cell>{history.prescription}</Table.Cell>
    <Table.Cell>{history.employee}</Table.Cell>
  </Table.Row>
);

// Require a document to be passed to this component.
HistoryItem.propTypes = {
  history: PropTypes.shape({
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
