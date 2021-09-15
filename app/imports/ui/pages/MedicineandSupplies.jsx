import React from 'react';
import { Container, Table, Header, Loader, Tab } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Stuffs } from '../../api/stuff/StuffCollection';
import CurrentMedicine from '../components/CurrentMedicine';
import CurrentSupplies from '../components/CurrentSupplies';
import { PAGE_IDS } from '../utilities/PageIDs';

/** Renders a table containing all of the Medicine And Supplies documents. Use <MedicineAndSuppliesItem> to render each row. */
const MedicineAndSupplies = ({ ready, stuffs }) => ((ready) ? (
  <Container id={PAGE_IDS.LIST_STUFF}>
    <Header as="h2" textAlign="center">Medicine and Supplies</Header>
    <Tab panes = {[
      // eslint-disable-next-line react/display-name
      { menuItem: 'Medicine', render: () => <Tab.Pane>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Lot #</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Location</Table.HeaderCell>
              <Table.HeaderCell>Quantity</Table.HeaderCell>
              <Table.HeaderCell>Expiration Date</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {stuffs.map((stuff) => <CurrentMedicine key={stuff._id} stuff={stuff}/>)}
          </Table.Body>
        </Table>
      </Tab.Pane> },
      // eslint-disable-next-line react/display-name
      { menuItem: 'Supplies', render: () => <Tab.Pane>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Location</Table.HeaderCell>
              <Table.HeaderCell>Quantity</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {stuffs.map((stuff) => <CurrentSupplies key={stuff._id} stuff={stuff} />)}
          </Table.Body>
        </Table>
      </Tab.Pane> }]}/>
  </Container>
) : <Loader active>Getting data</Loader>);

// Require an array of Medicine documents in the props.
MedicineAndSupplies.propTypes = {
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
})(MedicineAndSupplies);
