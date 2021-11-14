import React, { useState } from 'react';
import { Container, Table, Header, Loader, Tab, Input, Dropdown, Grid, Pagination } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { Medicines } from '../../api/medicine/MedicineCollection';
import CurrentMedicine from '../components/CurrentMedicine';
import CurrentSupplies from '../components/CurrentSupplies';
import { PAGE_IDS } from '../utilities/PageIDs';
import { Supplies } from '../../api/supply/SupplyCollection';

// Options for medicine types for medicine dropdown
const medTypeOptions = [
  { key: '', value: '', text: 'Choose a type' },
  { key: 'allergy', value: 'Allergy & Cold Medicines', text: 'Allergy & Cold Medicines' },
  { key: 'anal', value: 'Analgesics/Antiinflammatory', text: 'Analgesics/Antiinflammatory' },
  { key: 'antihyp', value: 'Antihypertensives', text: 'Antihypertensives' },
  { key: 'antimic', value: 'Antimicrobials', text: 'Antimicrobials' },
  { key: 'cardiac', value: 'Cardiac/Cholesterol', text: 'Cardiac/Cholesterol' },
  { key: 'derm', value: 'Dermatologic Preparations', text: 'Dermatologic Preparations' },
  { key: 'diabetes', value: 'Diabetes Meds', text: 'Diabetes Meds' },
  { key: 'eareye', value: 'Ear and Eye Preparations', text: 'Ear and Eye Preparations' },
  { key: 'emerg', value: 'Emergency Kit', text: 'Emergency Kit' },
  { key: 'gi', value: 'GI Meds', text: 'GI Meds' },
  { key: 'gyn', value: 'GYN Meds', text: 'GYN Meds' },
  { key: 'pulm', value: 'Pulmonary', text: 'Pulmonary' },
  { key: 'smoke', value: 'Smoking Cessation', text: 'Smoking Cessation' },
  { key: 'vita', value: 'Vitamins and Supplements', text: 'Vitamins and Supplements' },
];

// Options for supply locations for supply dropdown
const supplyLocationOptions = [
  { key: '', value: '', text: 'Pick a location' },
  { key: 'backcab', value: 'Back Cabinet', text: 'Back Cabinet' },
  { key: 'cabinet2', value: 'Cabinet 2', text: 'Cabinet 2' },
  { key: 'case4', value: 'Case 4', text: 'Case 4' },
  { key: 'closet', value: 'Refrig Closet', text: 'Refrig Closet' },
  { key: 'drawer6', value: 'Drawer 6', text: 'Drawer 6' },
  { key: 'drawer9', value: 'Drawer 9', text: 'Drawer 9' },
  { key: 'refrig', value: 'Refrigerator', text: 'Refrigerator' },
  { key: 'showerclos', value: 'Shower Closet', text: 'Shower Closet' },
];

/** Renders a table containing all of the Medicine And Supplies documents. Use <MedicineAndSuppliesItem> to render each row. */
const MedicineAndSupplies = ({ readyM, medicines, readyS, supplies }) => {
  // state functions for search and filter
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  // state functions for pagination
  const [activePage, setActivePage] = useState(1);
  // variables for rows of medicines from start to end
  const medStart = (activePage * 15 - 15);
  const medEnd = (activePage * 15);
  // variables for rows of supplies from start to end
  const supplyStart = (activePage * 6 - 6);
  const supplyEnd = (activePage * 6);
  // variable to let user go to different page
  const onChange = (e, pageInfo) => {
    setActivePage(Number(pageInfo.activePage));
  };
  // variable to sort medicine
  let medSort = medicines;
  // variable to sort supplies
  let supplySort = supplies;
  // variable that lets user choose value in dropdown
  const handleChange = (e, data) => {
    e.preventDefault();
    // sets filter state to filter value
    setFilter(data.value);
  };
  // variable that lets user to type name of medicine/supply in search bar
  const handleSearch = (e, data) => {
    e.preventDefault();
    // sets search state to search value
    setSearch(data.value);
  };
  // variable used to help find name of medicine
  const medSearch = (searchItem) => {
    // allows user to type name of medicine in lowercase
    const lowerCase = search.toLowerCase();
    // searches medicine item based on name
    return searchItem.name.toLowerCase().startsWith(lowerCase);
  };
  // variable used to help find name of supply
  const supplySearch = (searchItem) => {
    // allows user to type name of supply in lowercase
    const lowerCase = search.toLowerCase();
    // searches supply item based on name
    return searchItem.name.toLowerCase().startsWith(lowerCase);
  };
  if (readyM) {
    if (filter) {
      // sorts items via filter value in medicine tab
      medSort = medicines.filter(medicine => medicine.type === filter);
    }
    if (search) {
      // filters medicine items by search value and sorts them by name
      medSort = _.sortBy(medicines.filter(medicine => medSearch(medicine)), 'name');
    }
  }
  if (readyS) {
    if (filter) {
      // sorts items via filter value in supply tab
      supplySort = supplies.filter(supply => supply.location === filter);
    }
    if (search) {
      // filters supply items by search value and sorts them by name
      supplySort = _.sortBy(supplies.filter(supply => supplySearch(supply)), 'name');
    }
  }
  return ((readyM, readyS) ? (
    <Container id={PAGE_IDS.LIST_MEDICINES}>
      <Header as="h2" textAlign="center">Medicine and Supplies</Header>
      <Tab panes={[
        {
          // eslint-disable-next-line react/display-name
          menuItem: 'Medicine', render: () => <Tab.Pane>
            <Grid id='med-supply' centered doubling columns={2}>
              <Grid.Column>
                <Dropdown placeholder='Choose a type' search selection options={medTypeOptions} onChange={handleChange}/>
              </Grid.Column>
              <Grid.Column>
                <Input type='search' placeholder='Search by name' icon='search' onChange={handleSearch}/>
              </Grid.Column>
            </Grid>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Type</Table.HeaderCell>
                  <Table.HeaderCell>Location</Table.HeaderCell>
                  <Table.HeaderCell>Required Quantity</Table.HeaderCell>
                  <Table.HeaderCell>Total Quantity</Table.HeaderCell>
                  <Table.HeaderCell>Note</Table.HeaderCell>
                  <Table.HeaderCell colSpan={4}>Misc.</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {medSort.map((medicine) => <CurrentMedicine key={medicine._id} medicine={medicine}/>).slice(medStart, medEnd)}
              </Table.Body>
            </Table>
            <Pagination
              activePage={activePage}
              onPageChange={onChange}
              totalPages={Math.ceil(medSort.length / 15)}
              ellipsisItem={null}
            />
          </Tab.Pane>,
        },
        {
          // eslint-disable-next-line react/display-name
          menuItem: 'Supplies', render: () => <Tab.Pane>
            <Grid id='med-supply' centered doubling columns={2}>
              <Grid.Column>
                <Dropdown placeholder='Pick a location' search selection options={supplyLocationOptions} onChange={handleChange}/>
              </Grid.Column>
              <Grid.Column>
                <Input type='search' placeholder='Search by name' icon='search' onChange={handleSearch}/>
              </Grid.Column>
            </Grid>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Location</Table.HeaderCell>
                  <Table.HeaderCell>Total Quantity</Table.HeaderCell>
                  <Table.HeaderCell>Note</Table.HeaderCell>
                  <Table.HeaderCell colSpan={3}>Misc.</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {supplySort.map((supply) => <CurrentSupplies key={supply._id} supply={supply}/>).slice(supplyStart, supplyEnd)}
              </Table.Body>
            </Table>
            <Pagination
              activePage={activePage}
              onPageChange={onChange}
              totalPages={Math.ceil(supplySort.length / 6)}
              ellipsisItem={null}
            />
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
