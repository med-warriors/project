import React from 'react';
import { Container, Table, Header, Loader } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Patients } from '../../api/patients/PatientCollection';
import PatientItem from '../components/PatientItem';
import { PAGE_IDS } from '../utilities/PageIDs';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
const PatientInformation = ({ ready, patients }) => {
  console.log(patients);
  return ((ready) ? (

    <Container id={PAGE_IDS.LIST_STUFF}>
      <Header as="h2" textAlign="center">Patient History Information</Header>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Date</Table.HeaderCell>
            <Table.HeaderCell>Patient ID</Table.HeaderCell>
            <Table.HeaderCell>Edit</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {patients.map((patient) => <PatientItem key={patient._id} patient={patient} />)}
        </Table.Body>
      </Table>
    </Container>
  ) : <Loader active>Getting data</Loader>);
};

// Require an array of Stuff documents in the props.
PatientInformation.propTypes = {
  patients: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // Get access to Stuff documents.
  const subscription = Patients.subscribePatients();
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the Stuff documents and sort them by name.
  const patients = Patients.find({}).fetch();
  return {
    patients,
    ready,
  };
})(PatientInformation);
