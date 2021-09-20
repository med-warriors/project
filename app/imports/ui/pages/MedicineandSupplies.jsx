import React from 'react';
import { Container, Table, Header, Loader, Tab } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Medicines } from '../../api/medicine/MedicineCollection';
import CurrentMedicine from '../components/CurrentMedicine';
import CurrentSupplies from '../components/CurrentSupplies';
import { PAGE_IDS } from '../utilities/PageIDs';

/** Renders a table containing all of the Medicine And Supplies documents. Use <MedicineAndSuppliesItem> to render each row. */
const MedicineAndSupplies = ({ ready, medicines }) => ((ready) ? (
  <Container id={PAGE_IDS.LIST_Medicines}>
    <Header as="h2" textAlign="center">Medicine and Supplies</Header>
    <Tab panes = {[
      // eslint-disable-next-line react/display-name
      { menuItem: 'Medicine', render: () => <Tab.Pane>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Lot #</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Location</Table.HeaderCell>
              <Table.HeaderCell>Quantity</Table.HeaderCell>
              <Table.HeaderCell>Exp Date</Table.HeaderCell>
              <Table.HeaderCell>Source</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {medicines.map((medicine) => <CurrentMedicine key={medicine._id} medicine={medicine}/>)}
          </Table.Body>
        </Table>
      </Tab.Pane> },
      // eslint-disable-next-line react/display-name
      { menuItem: 'Supplies', render: () => <Tab.Pane>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Location</Table.HeaderCell>
              <Table.HeaderCell>Quantity</Table.HeaderCell>
              <Table.HeaderCell>Source</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {medicines.map((medicine) => <CurrentSupplies key={medicine._id} medicine={medicine} />)}
          </Table.Body>
        </Table>
      </Tab.Pane> }]}/>
  </Container>
) : <Loader active>Getting data</Loader>);

// Require an array of Medicine documents in the props.
MedicineAndSupplies.propTypes = {
  medicines: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // Get access to Medicine and supplies documents.
  const subscription = Medicines.subscribeMedicine();
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the Medicine documents and sort them by name.
  const medicines = Medicines.find({}, { sort: { name: 1 } }).fetch();
  return {
    medicines,
    ready,
  };
})(MedicineAndSupplies);
