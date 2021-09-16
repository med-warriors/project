import React from 'react';
import { Container, Table, Header, Loader } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { SupplySourecs } from '../../api/source/SupplySourceCollection';
import SupplySourceItem from '../components/SupplySourceItem';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
const SupplySource = ({ supplySources, ready }) => ((ready) ? (
  <Container>
    <Header as="h2" textAlign="center">Supply Source</Header>
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Location</Table.HeaderCell>
          <Table.HeaderCell>Phone Number</Table.HeaderCell>
          <Table.HeaderCell>Email</Table.HeaderCell>
          <Table.HeaderCell>Owner</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {supplySources.map((supplySource) => <SupplySourceItem key={supplySource._id} supplysource={ supplySource }/>)}
      </Table.Body>
    </Table>
  </Container>
) : <Loader active>Getting data</Loader>);

// Require an array of Stuff documents in the props.
SupplySource.propTypes = {
  supplySources: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // Get access to Stuff documents.
  const subscription = SupplySourecs.subscribeSupplySource();
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the Stuff documents and sort by owner then name
  const supplySources = SupplySourecs.find({}, { sort: { name: 1 } }).fetch();
  // console.log(stuffs, ready);
  return {
    supplySources,
    ready,
  };
})(SupplySource);
