import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
// import { COMPONENT_IDS } from '../utilities/ComponentIDs';

/** Renders a single row in the Patient Info table. See pages/PatientInformation.jsx. */
const PatientItem = ({ patient }) => (
  <Table.Row>
    <Table.Cell>{patient.date.toDateString()}</Table.Cell>
    <Table.Cell>{patient.id}</Table.Cell>
    <Table.Cell>{patient.dispense}</Table.Cell>
    <Table.Cell>{patient.note}</Table.Cell>
    <Table.Cell>{patient.location}</Table.Cell>
    <Table.Cell>{patient.employee}</Table.Cell>

    <Table.Cell>
      <Link to={`/edit/${patient._id}`}>Edit</Link>
    </Table.Cell>
  </Table.Row>
);

// Require a document to be passed to this component.
PatientItem.propTypes = {
  patient: PropTypes.shape({
    date: PropTypes.instanceOf(Date),
    id: PropTypes.string,
    dispense: PropTypes.string,
    note: PropTypes.string,
    location: PropTypes.string,
    employee: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(PatientItem);
