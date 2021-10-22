import React from 'react';
import { Button, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

/** Renders a single row in the List Medicine table. See pages/MedicineandSupplies.jsx. */
const CurrentMedicine = ({ medicine }) => (
  <Table.Row>
    <Table.Cell>{medicine.lotNumber}</Table.Cell>
    <Table.Cell>{medicine.name}</Table.Cell>
    <Table.Cell>{medicine.type}</Table.Cell>
    <Table.Cell>{medicine.location}</Table.Cell>
    <Table.Cell>{medicine.quantity}</Table.Cell>
    <Table.Cell>
      <Button color='red' content='ADD'/>
      <Button color='green' content= 'UPDATE'/>
      <Button color='blue' icon= 'angle down' />
    </Table.Cell>
  </Table.Row>
);

// Require a document to be passed to this component.
CurrentMedicine.propTypes = {
  medicine: PropTypes.shape({
    lotNumber: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    location: PropTypes.string,
    quantity: PropTypes.number,
    _id: PropTypes.string,
  }).isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(CurrentMedicine);
