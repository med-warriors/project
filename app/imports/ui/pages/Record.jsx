import React from 'react';
import { Container, Table, Header, Loader, Tab, Grid } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { PAGE_IDS } from '../utilities/PageIDs';
import { Patients } from '../../api/patients/PatientCollection';
import PatientItem from '../components/PatientItem';
import { MedicineSourceRecord } from '../../api/medsourceRecord/MedicineSourceRecordCollection';
import { SupplySourceRecord } from '../../api/supplysourceRecord/SupplySourceRecordCollection';
import SupplyRecordItem from '../components/SupplyRecordItem';
import MedicineRecordItem from '../components/MedicineRecordItem';

/** Renders a table containing all of the Medicine And Supplies documents. Use <MedicineAndSuppliesItem> to render each row. */

const Record = ({ readyM, medicines, readyS, supplies, readyP, patient }) => {

  return ((readyM, readyS, readyP) ? (
    <Container id={PAGE_IDS.LIST_RECORD}>
      <Header as="h2" textAlign="center">Record Log</Header>
      <Tab panes={[
        {
          // eslint-disable-next-line react/display-name
          menuItem: 'Medicine', render: () => <Tab.Pane>
            <Grid id='med-supply' centered doubling columns={2}>
            </Grid>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Date</Table.HeaderCell>
                  <Table.HeaderCell>Lot/Name</Table.HeaderCell>
                  <Table.HeaderCell>Receive Date</Table.HeaderCell>
                  <Table.HeaderCell>Source</Table.HeaderCell>
                  <Table.HeaderCell>State</Table.HeaderCell>
                  <Table.HeaderCell>Change</Table.HeaderCell>
                  <Table.HeaderCell>employee</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {medicines.map((medicine) => <MedicineRecordItem key={medicine._id} medicine={medicine}/>)}
              </Table.Body>
            </Table>
          </Tab.Pane>,
        },
        {
          // eslint-disable-next-line react/display-name
          menuItem: 'Supplies', render: () => <Tab.Pane>
            <Grid id='med-supply' centered doubling columns={2}>
            </Grid>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Date</Table.HeaderCell>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Receive Date</Table.HeaderCell>
                  <Table.HeaderCell>Source</Table.HeaderCell>
                  <Table.HeaderCell>State</Table.HeaderCell>
                  <Table.HeaderCell>Change</Table.HeaderCell>
                  <Table.HeaderCell>employee</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {supplies.map((supply) => <SupplyRecordItem key={supply._id} supply={supply}/>)}
              </Table.Body>
            </Table>
          </Tab.Pane>,
        }, {
          // eslint-disable-next-line react/display-name
          menuItem: 'Dispense', render: () => <Tab.Pane>
            <Grid id='med-supply' centered doubling columns={2}>
            </Grid>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Date</Table.HeaderCell>
                  <Table.HeaderCell>Patient ID</Table.HeaderCell>
                  <Table.HeaderCell>Dispense List</Table.HeaderCell>
                  <Table.HeaderCell>Note</Table.HeaderCell>
                  <Table.HeaderCell>Location</Table.HeaderCell>
                  <Table.HeaderCell>Employee</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {patient.map((patients) => <PatientItem key={patients._id} patient={patients}/>)}
              </Table.Body>
            </Table>
          </Tab.Pane>,
        }]}/>
    </Container>
  ) : <Loader active>Getting data</Loader>);
};

// Require an array of Medicine documents in the props.
Record.propTypes = {
  medicines: PropTypes.array.isRequired,
  readyM: PropTypes.bool.isRequired,
  supplies: PropTypes.array.isRequired,
  readyS: PropTypes.bool.isRequired,
  patient: PropTypes.array.isRequired,
  readyP: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // Get access to Medicine and supplies documents.
  const subscriptionM = MedicineSourceRecord.subscribeMedicineSource();
  const subscriptionS = SupplySourceRecord.subscribeSupplyRecord();
  const subscriptionP = Patients.subscribePatients();
  // Determine if the subscription is ready
  const readyM = subscriptionM.ready();
  const readyS = subscriptionS.ready();
  const readyP = subscriptionP.ready();
  // Get the Medicine documents and sort them by name.
  const medicines = MedicineSourceRecord.find({}, { sort: { editDate: -1 } }).fetch();
  // Get the Supply documents and sort them by name.
  const supplies = SupplySourceRecord.find({}, { sort: { editDate: -1 } }).fetch();
  // Get the Supply documents and sort them by name.
  const patient = Patients.find({}, { sort: { date: -1 } }).fetch();
  return {
    medicines,
    readyM,
    supplies,
    readyS,
    patient,
    readyP,
  };
})(Record);
