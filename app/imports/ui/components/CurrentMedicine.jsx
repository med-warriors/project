import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

/** Renders a single row in the List Medicine table. See pages/MedicineandSupplies.jsx. */
const CurrentMedicine = ({ stuff }) => (
  <Table.Row>
    <Table.Cell>{stuff.lotNumber}</Table.Cell>
    <Table.Cell>{stuff.name}</Table.Cell>
    <Table.Cell>{stuff.type}</Table.Cell>
    <Table.Cell>{stuff.location}</Table.Cell>
    <Table.Cell>{stuff.quantity}</Table.Cell>
    <Table.Cell>{stuff.expirationDate}</Table.Cell>
    <Table.Cell>{stuff.source}</Table.Cell>
    <Table.Cell>
      <Link className={COMPONENT_IDS.LIST_STUFF_EDIT} to={`/edit/${stuff._id}`}>Update</Link>
    </Table.Cell>
  </Table.Row>
);

// Require a document to be passed to this component.
CurrentMedicine.propTypes = {
  stuff: PropTypes.shape({
    lotNumber: PropTypes.number,
    name: PropTypes.string,
    type: PropTypes.string,
    location: PropTypes.string,
    quantity: PropTypes.number,
    expirationDate: PropTypes.string,
    source: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(CurrentMedicine);
