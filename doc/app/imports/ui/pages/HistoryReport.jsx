import React from 'react';
import { Container, Table, Header, Loader } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { TransationHistories } from '../../api/transaction/TransationHistoriesCollection';
import HistoryItem from '../components/HistoryItem';
import { PAGE_IDS } from '../utilities/PageIDs';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
const HistoryReport = ({ ready, transationHistories }) => ((ready) ? (
  <Container id={PAGE_IDS.LIST_HISTORIES}>
    <Header as="h2" textAlign="center">History Report</Header>
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Date</Table.HeaderCell>
          <Table.HeaderCell>Transaction</Table.HeaderCell>
          <Table.HeaderCell>Medicine/Supply</Table.HeaderCell>
          <Table.HeaderCell>Patient ID</Table.HeaderCell>
          <Table.HeaderCell>Prescription</Table.HeaderCell>
          <Table.HeaderCell>Employee</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {transationHistories.map((transationHistory) => <HistoryItem key={transationHistory._id} transationHistory={transationHistory} />)}
      </Table.Body>
    </Table>
  </Container>
) : <Loader active>Getting data</Loader>);

// Require an array of Stuff documents in the props.
HistoryReport.propTypes = {
  transationHistories: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // Get access to Stuff documents.
  const subscription = TransationHistories.subscribeTransationHistory();
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the Stuff documents and sort them by name.
  const transationHistories = TransationHistories.find({}).fetch();
  return {
    transationHistories,
    ready,
  };
})(HistoryReport);
