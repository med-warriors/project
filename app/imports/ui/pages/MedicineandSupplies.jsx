import React, { useState } from 'react';
import { Container, Table, Header, Loader, Tab, Input, Dropdown, Grid } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { Medicines } from '../../api/medicine/MedicineCollection';
import CurrentMedicine from '../components/CurrentMedicine';
import CurrentSupplies from '../components/CurrentSupplies';
import { PAGE_IDS } from '../utilities/PageIDs';
import { Supplies } from '../../api/supply/SupplyCollection';

const medTypeOptions = [
  { key: 'allergy', value: 'allergy', text: 'Allergy and Cold Medicines' },
  { key: 'anal', value: 'anal', text: 'Analgesics/Antiinflammatory' },
  { key: 'antihyp', value: 'antihyp', text: 'Antihypertensives' },
  { key: 'antimic', value: 'antimic', text: 'Antimicrobials' },
];

const supplyLocationOptions = [
  { key: 'cabinet2', value: 'cabinet2', text: 'Cabinet 2' },
  { key: 'case4', value: 'case4', text: 'Case 4' },
  { key: 'closet', value: 'closet', text: 'Refrig Closet' },
  { key: 'refrig', value: 'refrig', text: 'Refrigerator' },
];

/** Renders a table containing all of the Medicine And Supplies documents. Use <MedicineAndSuppliesItem> to render each row. */
const MedicineAndSupplies = ({ readyM, medicines, readyS, supplies }) => {
  // state functions
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  let medSort = medicines;
  let supplySort = supplies;
  const handleChange = (e, data) => {
    e.preventDefault();
    setFilter(data.value);
  };
  const handleSearch = (e, data) => {
    e.preventDefault();
    setSearch(data.value);
  };
  const medSearch = (searchItem) => {
    const lowerCase = search.toLowerCase();
    return searchItem.name.toLowerCase().startsWith(lowerCase);
  };
  const supplySearch = (searchItem) => {
    const lowerCase = search.toLowerCase();
    return searchItem.name.toLowerCase().startsWith(lowerCase);
  };
  if (readyM) {
    if (filter === 'quantity') {
      medSort = _.sortBy(medicines, filter).reverse();
    } else {
      medSort = _.sortBy(medicines, filter);
    }
    if (search) {
      medSort = _.sortBy(medicines.filter(medicine => medSearch(medicine)), 'name');
    }
  }
  if (readyS) {
    if (filter === 'quantity') {
      supplySort = _.sortBy(supplies, filter).reverse();
    } else {
      supplySort = _.sortBy(supplies, filter);
    }
    if (search) {
      supplySort = _.sortBy(supplies.filter(supply => supplySearch(supply)), 'name');
    }
  }
  return ((readyM, readyS) ? (
    <Container id={PAGE_IDS.LIST_MEDICINES}>
      <Header as="h2" textAlign="center">Medicine and Supplies</Header>
      <Tab panes={[
        // eslint-disable-next-line react/display-name
        {
          menuItem: 'Medicine', render: () => <Tab.Pane>
            <Grid id='med-supply' centered stackable columns='equal'>
              <Dropdown placeholder='Choose a type' search selection options={medTypeOptions} onClick ={handleChange}/>
              <Input type='search' placeholder='Search by name' icon='search' onChange={handleSearch}/>
            </Grid>
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
                  <Table.HeaderCell>Status</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {medSort.map((medicine) => <CurrentMedicine key={medicine._id} medicine={medicine}/>)}
              </Table.Body>
            </Table>
          </Tab.Pane>,
        },
        // eslint-disable-next-line react/display-name
        {
          menuItem: 'Supplies', render: () => <Tab.Pane>
            <Grid id='med-supply' centered stackable columns='equal'>
              <Dropdown placeholder='Pick a location' search selection options={supplyLocationOptions} onChange={handleChange}/>
              <Input type='search' placeholder='Search by name' icon='search' onChange={handleSearch}/>
            </Grid>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Location</Table.HeaderCell>
                  <Table.HeaderCell>Quantity</Table.HeaderCell>
                  <Table.HeaderCell>Source</Table.HeaderCell>
                  <Table.HeaderCell>Status</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {supplySort.map((supply) => <CurrentSupplies key={supply._id} supply={supply}/>)}
              </Table.Body>
            </Table>
          </Tab.Pane>,
        }]}/>
    </Container>
  ) : <Loader active>Getting data</Loader>);
};

// Require an array of Medicine documents in the props.
MedicineAndSupplies.propTypes = {
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
})(MedicineAndSupplies);
