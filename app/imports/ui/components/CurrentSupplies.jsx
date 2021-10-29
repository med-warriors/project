import React from 'react';
import { Button, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

// Changes text to red, yellow, or green, based on quantity of supplies
const getColor = (quantity) => {
  // colors text in green
  if (quantity >= 20) return '#25A18E';
  // colors text in yellow
  if (quantity >= 10 && quantity < 20) return '#A18E25';
  // colors text in red
  return '#A12358';
};

/** Renders a single row in the List Supplies table. See pages/MedicineandSupplies.jsx. */
const CurrentSupplies = ({ supply }) => {
  let highlight;
  if (supply.quantity >= 10 && supply.quantity < 20) {
    // highlights in yellow when supply quantity is between 10 and 19
    highlight = 'warning';
  } else if (supply.quantity < 10) {
    // highlights in red when supply quantity is less than 10
    highlight = 'error';
  } else {
    // highlights in green when supply quantity is over 20
    highlight = 'positive';
  }
  return (<Table.Row positive={highlight === 'positive'} warning={highlight === 'warning'} error={highlight === 'error'}>
    <Table.Cell>{supply.name}</Table.Cell>
    <Table.Cell>{supply.location}</Table.Cell>
    <Table.Cell style={{ color: getColor(supply.quantity) }}>{supply.quantity}</Table.Cell>
    <Table.Cell>
      <Button>
        <Link className={COMPONENT_IDS.LIST_SUPPLY_EDIT} to={`/update-sup/${supply._id}`}>Update</Link>
      </Button>
    </Table.Cell>
  </Table.Row>);
};

// Require a document to be passed to this component.
CurrentSupplies.propTypes = {
  supply: PropTypes.shape({
    name: PropTypes.string,
    quantity: PropTypes.number,
    location: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(CurrentSupplies);
