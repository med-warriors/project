import React from 'react';
import { Container, Table, Header, Loader } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Stuffs } from '../../api/stuff/StuffCollection';
import StuffItem from '../components/StuffItem';
import { PAGE_IDS } from '../utilities/PageIDs';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
const ListStuff = ({ ready, stuffs }) => ((ready) ? (
  <Container id={PAGE_IDS.LIST_STUFF}>
    <Header as="h2" textAlign="center">Low Inventory Report</Header>
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Lot #</Table.HeaderCell>
          <Table.HeaderCell>Medicine Name</Table.HeaderCell>
          <Table.HeaderCell>Type</Table.HeaderCell>
          <Table.HeaderCell>Location</Table.HeaderCell>
          <Table.HeaderCell>Quantity</Table.HeaderCell>
          <Table.HeaderCell>Expiration Date</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {stuffs.map((stuff) => <StuffItem key={stuff._id} stuff={stuff} />)}
        {/* Example */}
        <Table.Row negative>
          <Table.Cell>12456</Table.Cell>
          <Table.Cell>Ibuprofen</Table.Cell>
          <Table.Cell>Medicine</Table.Cell>
          <Table.Cell>Car 1</Table.Cell>
          <Table.Cell>0</Table.Cell>
          <Table.Cell>6-1-2023</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  </Container>
) : <Loader active>Getting data</Loader>);

// Require an array of Stuff documents in the props.
ListStuff.propTypes = {
  stuffs: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // Get access to Stuff documents.
  const subscription = Stuffs.subscribeStuff();
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the Stuff documents and sort them by name.
  const stuffs = Stuffs.find({}, { sort: { name: 1 } }).fetch();
  return {
    stuffs,
    ready,
  };
})(ListStuff);
