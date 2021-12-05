import React from 'react';
import { Icon, Loader, Table, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import { Patients } from '../../api/patients/PatientCollection';
import { removeItMethod } from '../../api/base/BaseCollection.methods';

/** Renders a single row in the Patient Info table. See pages/PatientInformation.jsx. */
const PatientItem = ({ patient, ready }) => {
  const handleChange = () => {
    const collectionName = Patients.getCollectionName();
    const instance = patient._id;
    removeItMethod.callPromise({ collectionName, instance });
  };
  return ((ready) ? (
    <Table.Row>
      <Table.Cell>{patient.date.toDateString()}</Table.Cell>
      <Table.Cell>{patient.id}</Table.Cell>
      <Table.Cell>
        <ul>{patient.dispense.map((item, i) => <li key={i}>{item}</li>)}</ul>
      </Table.Cell>
      <Table.Cell>{patient.note}</Table.Cell>
      <Table.Cell>{patient.location}</Table.Cell>
      <Table.Cell>{patient.employee}</Table.Cell>
      <Table.Cell>
        <Link to={`/edit/patient-info/${patient._id}`}><Icon name='edit'/></Link>
        <Link><Icon color='red' name='trash alternate' onClick={handleChange}/></Link>
      </Table.Cell>
    </Table.Row>) : <Loader active>Getting data</Loader>);
};

// Require a document to be passed to this component.
PatientItem.propTypes = {
  patient: PropTypes.shape({
    date: PropTypes.instanceOf(Date),
    id: PropTypes.string,
    dispense: PropTypes.array,
    note: PropTypes.string,
    location: PropTypes.string,
    employee: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
  ready: PropTypes.bool.isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withTracker(() => {
  // Get access to Patients documents.
  const subscription = Patients.subscribePatients();
  // Determine if the subscription is ready
  const ready = subscription.ready();
  const patients = Patients.find({}, { sort: { name: 1 } }).fetch();
  return {
    patients,
    ready,
  };
})(PatientItem);
