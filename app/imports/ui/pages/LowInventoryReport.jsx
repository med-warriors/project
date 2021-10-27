import React from 'react';
import { Container, Table, Header, Loader } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Medicines } from '../../api/medicine/MedicineCollection';
import CurrentMedicine from '../components/CurrentMedicine';
import { PAGE_IDS } from '../utilities/PageIDs';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
const LowInventoryReport = ({ ready, medicines }) => ((ready) ? (
  <Container id={PAGE_IDS.LIST_MEDICINES}>
    <Header as="h2" textAlign="center">Low Inventory Report</Header>
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Type</Table.HeaderCell>
          <Table.HeaderCell>Lot#</Table.HeaderCell>
          <Table.HeaderCell>Location</Table.HeaderCell>
          <Table.HeaderCell>Quantity</Table.HeaderCell>
          <Table.HeaderCell>Should Have</Table.HeaderCell>
          <Table.HeaderCell>Misc.</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {medicines.map((medicine) => <CurrentMedicine key={medicine._id} medicine={medicine}/>)}
      </Table.Body>
    </Table>
  </Container>
) : <Loader active>Getting data</Loader>);

// Require an array of Stuff documents in the props.
LowInventoryReport.propTypes = {
  medicines: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // Get access to Stuff documents.
  const subscription = Medicines.subscribeMedicine();
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the Stuff documents and sort them by name.
  const medicines = Medicines.find({}, { sort: { name: 1 } }).fetch();
  return {
    medicines,
    ready,
  };
})(LowInventoryReport);
