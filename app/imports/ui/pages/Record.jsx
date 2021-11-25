import React from 'react';
import { Container, Table, Header, Loader, Tab, Grid } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Medicines } from '../../api/medicine/MedicineCollection';
import { PAGE_IDS } from '../utilities/PageIDs';
import { Supplies } from '../../api/supply/SupplyCollection';

/** Renders a table containing all of the Medicine And Supplies documents. Use <MedicineAndSuppliesItem> to render each row. */

const Record = (ready) => ((ready) ? (
  <Container id={PAGE_IDS.LIST_RECORD}>
    <Header as="h2" textAlign="center">Record</Header>
    <Tab panes={[
      {
        // eslint-disable-next-line react/display-name
        menuItem: 'Medicine', render: () => <Tab.Pane>
          <Grid id='med-supply' centered doubling columns={2}>
          </Grid>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Lot ID</Table.HeaderCell>
                <Table.HeaderCell>Quantity</Table.HeaderCell>
                <Table.HeaderCell>Source Name</Table.HeaderCell>
                <Table.HeaderCell>Received Date</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              Fill some medicine records
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
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Quantity</Table.HeaderCell>
                <Table.HeaderCell>Source Name</Table.HeaderCell>
                <Table.HeaderCell>Received Date</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              Fill some stuff
            </Table.Body>
          </Table>
        </Tab.Pane>,
      }]}/>
  </Container>
) : <Loader active>Getting data</Loader>);

// Require an array of Medicine documents in the props.
Record.propTypes = {
  medicines: PropTypes.array.isRequired,
  readyM: PropTypes.bool.isRequired,
  supplies: PropTypes.array.isRequired,
  readyS: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // Get access to Medicine and supplies documents.
  const subscriptionM = Medicines.subscribeMedicine();
  const subscriptionS = Supplies.subscribeSupply();
  // Determine if the subscription is ready
  const readyM = subscriptionM.ready();
  const readyS = subscriptionS.ready();
  // Get the Medicine documents and sort them by name.
  const medicines = Medicines.find({}, { sort: { name: 1 } }).fetch();
  // Get the Supply documents and sort them by name.
  const supplies = Supplies.find({}, { sort: { name: 1 } }).fetch();
  return {
    medicines,
    readyM,
    supplies,
    readyS,
  };
})(Record);
