import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

// Changes text to red, yellow, or green, based on quantity of supplies
const getColor = (quantity) => {
  if (quantity >= 20) return '#25A18E';
  if (quantity > 10 && quantity < 20) return '#A18E25';
  return '#A12358';
};

/** Renders a single row in the List Supplies table. See pages/MedicineAndSupplies.jsx. */
const CurrentSupplies = ({ supply }) => (
  <Table.Row>
    <Table.Cell>{supply.name}</Table.Cell>
    <Table.Cell>{supply.location}</Table.Cell>
    <Table.Cell style={{ color: getColor(supply.quantity) }}>{supply.quantity}</Table.Cell>
    <Table.Cell>{supply.source}</Table.Cell>
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
    _id: PropTypes.string,
  }).isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(CurrentSupplies);
