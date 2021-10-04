import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

/** Renders a single row in the List Supplies table. See pages/MedicineandSupplies.jsx. */
const CurrentSupplies = ({ supply }) => (
  <Table.Row>
    <Table.Cell>{supply.name}</Table.Cell>
    <Table.Cell>{supply.location}</Table.Cell>
    <Table.Cell>{supply.quantity}</Table.Cell>
    <Table.Cell>{supply.source}</Table.Cell>
    <Table.Cell>{supply.status}</Table.Cell>
    <Table.Cell>
      <Link className={COMPONENT_IDS.LIST_SUPPLY_EDIT} to={`/edit/${supply._id}`}>Update</Link>
    </Table.Cell>
  </Table.Row>
);

// Require a document to be passed to this component.
CurrentSupplies.propTypes = {
  supply: PropTypes.shape({
    name: PropTypes.string,
    quantity: PropTypes.number,
    location: PropTypes.string,
    source: PropTypes.string,
    status: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(CurrentSupplies);
