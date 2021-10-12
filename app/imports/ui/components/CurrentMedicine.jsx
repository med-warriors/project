import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

/** Renders a single row in the List Medicine table. See pages/MedicineandSupplies.jsx. */
const CurrentMedicine = ({ medicine }) => {

  let highlight;
  if (medicine.quantity < 5) {
    highlight = 'error';
  } else
  if (medicine.quantity < 20) {
    highlight = 'warning';
  }
  return (<Table.Row error={highlight === 'error'} warning={highlight === 'warning'}>
    <Table.Cell>{medicine.lotNumber}</Table.Cell>
    <Table.Cell>{medicine.name}</Table.Cell>
    <Table.Cell>{medicine.type}</Table.Cell>
    <Table.Cell>{medicine.location}</Table.Cell>
    <Table.Cell>{medicine.quantity}</Table.Cell>
    <Table.Cell>{medicine.expirationDate.toDateString()}</Table.Cell>
    <Table.Cell>{medicine.source}</Table.Cell>
    <Table.Cell>
      <Link className={COMPONENT_IDS.LIST_MEDICINE_EDIT} to={`/edit/${medicine._id}`}>Update</Link>
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
    expirationDate: PropTypes.instanceOf(Date),
    source: PropTypes.string,
    status: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(CurrentMedicine);
