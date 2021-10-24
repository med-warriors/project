import React from 'react';
import { Button, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

// Changes text to red, yellow, or green, based on quantity of medicine
const getColor = (quantity) => {
  if (quantity >= 50) return '#25A18E';
  if (quantity > 10 && quantity < 50) return '#A18E25';
  return '#A12358';
};

/** Renders a single row in the List Medicine table. See pages/MedicineandSupplies.jsx. */
const CurrentMedicine = ({ medicine }) => {
  let highlight;
  if (medicine.quantity < 10) {
    highlight = 'error';
  } else
  if (medicine.quantity < 20) {
    highlight = 'warning';
  }
  return (<Table.Row error={highlight === 'error'} warning={highlight === 'warning'}>
    <Table.Cell>{medicine.name}</Table.Cell>
    <Table.Cell>{medicine.type}</Table.Cell>
    <Table.Cell>{medicine.lotNumber}</Table.Cell>
    <Table.Cell>{medicine.location}</Table.Cell>
    <Table.Cell style={{ color: getColor(medicine.quantity) }}>{medicine.quantity}</Table.Cell>
    <Table.Cell>
      <Button color='red' content='ADD'/>
      <Button color='green' content= 'UPDATE'/>
      <Button color='blue' icon= 'angle down' />
    </Table.Cell>
  </Table.Row>);
};

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
