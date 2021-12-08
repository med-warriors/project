import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

/** Renders a single row in the Patient Info table. See pages/PatientInformation.jsx. */
const MedicineRecordItem = ({ medicine }) => (
  <Table.Row>
    <Table.Cell>{medicine.action} - {medicine.editDate.toDateString()}</Table.Cell>
    <Table.Cell>{medicine.lotNumber} - {medicine.medName}</Table.Cell>
    <Table.Cell>{medicine.receiveDate.toDateString()}</Table.Cell>
    <Table.Cell>{medicine.sourceName}: {medicine.acquire} - {medicine.quantity} (${medicine.cost}) </Table.Cell>
    <Table.Cell>{medicine.state} (EXP: {medicine.expDate.toDateString()})</Table.Cell>
    <Table.Cell>{medicine.change}</Table.Cell>
    <Table.Cell>{medicine.employee}</Table.Cell>
  </Table.Row>
);
// Require a document to be passed to this component.
MedicineRecordItem.propTypes = {
  medicine: PropTypes.shape({
    lotNumber: PropTypes.string,
    medName: PropTypes.string,
    quantity: PropTypes.number,
    sourceName: PropTypes.string,
    acquire: PropTypes.string,
    cost: PropTypes.number,
    receiveDate: PropTypes.instanceOf(Date),
    expDate: PropTypes.instanceOf(Date),
    state: PropTypes.string,
    editDate: PropTypes.instanceOf(Date),
    employee: PropTypes.string,
    action: PropTypes.string,
    change: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(MedicineRecordItem);
