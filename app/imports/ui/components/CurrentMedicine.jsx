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
  if (medicine.should_have < 10) {
    highlight = 'error';
  } else
  if (medicine.should_have < 20) {
    highlight = 'warning';
  }
  return (<Table.Row error={highlight === 'error'} warning={highlight === 'warning'}>
    <Table.Cell>{medicine.name}</Table.Cell>
    <Table.Cell>{medicine.type}</Table.Cell>
    <Table.Cell>{medicine.should_have}</Table.Cell>
    <Table.Cell>{medicine.note}</Table.Cell>
    <Table.Cell style={{ color: getColor(medicine.should_have) }}>{medicine.should_have}</Table.Cell>
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
    name: PropTypes.string,
    type: PropTypes.string,
    should_have: PropTypes.number,
    note: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(CurrentMedicine);
