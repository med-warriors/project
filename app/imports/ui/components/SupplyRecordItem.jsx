import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

/** Renders a single row in the Patient Info table. See pages/PatientInformation.jsx. */
const SupplyRecordItem = ({ supply }) => (
  <Table.Row>
    <Table.Cell>{supply.action} - {supply.editDate.toDateString()}</Table.Cell>
    <Table.Cell>{supply.supplyName}</Table.Cell>
    <Table.Cell>{supply.receiveDate.toDateString()}</Table.Cell>
    <Table.Cell>{supply.sourceName}: {supply.acquire} - {supply.quantity} (${supply.cost}) </Table.Cell>
    <Table.Cell>{supply.state}</Table.Cell>
    <Table.Cell>{supply.change}</Table.Cell>
    <Table.Cell>{supply.employee}</Table.Cell>
  </Table.Row>
);
// Require a document to be passed to this component.
SupplyRecordItem.propTypes = {
  supply: PropTypes.shape({
    supplyName: PropTypes.string,
    quantity: PropTypes.number,
    sourceName: PropTypes.string,
    acquire: PropTypes.string,
    cost: PropTypes.number,
    receiveDate: PropTypes.instanceOf(Date),
    state: PropTypes.string,
    editDate: PropTypes.instanceOf(Date),
    employee: PropTypes.string,
    action: PropTypes.string,
    change: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(SupplyRecordItem);
