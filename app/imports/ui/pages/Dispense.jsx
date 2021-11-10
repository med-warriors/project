import React, { useState } from 'react';
import { Grid, Segment, Header, Loader, Table, Input, Tab } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { MedicineSource } from '../../api/medSource/MedicineSourceCollection';
import DispenseList from '../components/DispenseList';
import DispenseSubmit from '../components/DispenseSubmit';
import { PAGE_IDS } from '../utilities/PageIDs';
import DispenseSupply from '../components/DispenseSupply';
import DispenseMedicine from '../components/DispenseMedicine';
import { SupplySource } from '../../api/supplysource/SupplySourceCollection';

/** Renders the Page for adding a document. */
const Dispense = ({ readyM, medicines, readyS, supplies }) => {
  // state functions
  const [search, setSearch] = useState('');
  const [cellDispense, setDispense] = useState([]);
  // variable to sort medicine
  let medSort = [];
  let supSort = [];
  const dispenseList = [];

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
    return searchItem.medName.toLowerCase().startsWith(lowerCase);
  };

  // variable used to help find name of supply
  const supplySearch = (searchItem) => {
    // allows user to type name of supply in lowercase
    const lowerCase = search.toLowerCase();
    // searches supply item based on name
    return searchItem.supplyName.toLowerCase().startsWith(lowerCase);
  };

  // add variable id and type into state array
  const addDispense = (data, type) => {
    // map all variable id in the state array
    const iD = cellDispense.map(item => item.id);
    // check if variable is/is not includes in the array
    const found = iD.includes(data);
    // create a new object and add to state array
    if (!found) {
      // sets add Dispense state to added value
      const updateDispense = [...cellDispense, { id: data, type: type, prescriptionQuantity: 0 }];
      setDispense(updateDispense);
    }
  };

  // define output quantity of dispense
  const outDispenseQuantity = (data, outQuantity) => {
    // Search variable index
    const index = cellDispense.findIndex(item => item.id === data);
    const newCellDispense = [...cellDispense];
    // change output quantity of the set variable
    newCellDispense[index].prescriptionQuantity = outQuantity;
    setDispense(newCellDispense);
  };

  // remove the variable from state array
  const removeDispense = (data) => {
    // sets Dispense state to remove value
    setDispense(cellDispense.filter(item => item.id !== data));
  };

  if ((readyM, readyS)) {
    if (search) {
      // filters medicine items by search value and sorts them by name
      medSort = _.sortBy(medicines.filter(medicine => medSearch(medicine)), 'medName');
      supSort = _.sortBy(supplies.filter(supply => supplySearch(supply)), 'supplyName');
    }
    if (cellDispense) {
      for (let i = 0; i < cellDispense.length; i++) {
        if (cellDispense[i].type === 'Medicine') {
          const med = MedicineSource.findDoc(cellDispense[i].id);
          dispenseList.push(med);
        }
        if (cellDispense[i].type === 'Supply') {
          const sup = SupplySource.findDoc(cellDispense[i].id);
          dispenseList.push(sup);
        }
      }
    }
  }

  return ((readyM, readyS) ? (
    <Grid id={PAGE_IDS.DISPENSE} container centered>
      <Grid.Column>
        <Header as="h2" textAlign="center">Dispense</Header>
        <Segment>
          <Grid>
            <Grid.Row centered>
              <Grid.Column>
                <Grid.Row centered>
                  <Input type='search' placeholder='Search by name' icon='search' onChange={handleSearch}/>
                  <Header as="h3" textAlign="center">Medicine & Supplies Item</Header>
                </Grid.Row>
                <Tab grid={{ paneWidth: 14, tabWidth: 2 }}
                  menu={{ fluid: true, vertical: true, tabular: true }}
                  panes={[
                  // eslint-disable-next-line react/display-name
                    { menuItem: 'Medicine', render: () => <Tab.Pane>
                      <Table celled color='red'>
                        <Table.Header>
                          <Table.Row>
                            <Table.HeaderCell>Lot #</Table.HeaderCell>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Quantity</Table.HeaderCell>
                            <Table.HeaderCell>ExpDate</Table.HeaderCell>
                            <Table.HeaderCell>State</Table.HeaderCell>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {medSort.map((inventories) => <DispenseMedicine
                            key={inventories._id} inventories={inventories} addDispense={addDispense}
                          />)}
                        </Table.Body>
                      </Table>
                    </Tab.Pane>,
                    }, {
                    // eslint-disable-next-line react/display-name
                      menuItem: 'Supplies', render: () => <Tab.Pane>
                        <Table celled color='red'>
                          <Table.Header>
                            <Table.Row>
                              <Table.HeaderCell>Name</Table.HeaderCell>
                              <Table.HeaderCell>Quantity</Table.HeaderCell>
                              <Table.HeaderCell>State</Table.HeaderCell>
                            </Table.Row>
                          </Table.Header>
                          <Table.Body>
                            {supSort.map((inventories) => <DispenseSupply
                              key={inventories._id} inventories={inventories} addDispense={addDispense}
                            />)}
                          </Table.Body>
                        </Table>
                      </Tab.Pane>,
                    }]}/>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row centered>
              <Header as="h3" textAlign="center">Dispensing List</Header>
              <Table celled color='green'>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell/>
                    <Table.HeaderCell>Lot #</Table.HeaderCell>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Quantity</Table.HeaderCell>
                    <Table.HeaderCell>ExpDate</Table.HeaderCell>
                    <Table.HeaderCell>State</Table.HeaderCell>
                    <Table.HeaderCell>Dispense Quantity</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {dispenseList.map((inventories) => <DispenseList
                    key={inventories._id} inventories={inventories}
                    removeDispense={removeDispense} outDispenseQuantity={outDispenseQuantity}
                  />)}
                </Table.Body>
              </Table>
            </Grid.Row>
          </Grid>
        </Segment>
        <Grid.Row>
          <Segment color='blue'>
            <DispenseSubmit cellDispense={cellDispense} setDispense={setDispense}/>
          </Segment>
        </Grid.Row>
      </Grid.Column>
    </Grid>
  ) : <Loader active>Getting data</Loader>);
};

// Require the presence of a Stuff document in the props object. Uniforms adds 'model' to the props, which we use.
Dispense.propTypes = {
  medicines: PropTypes.array.isRequired,
  readyM: PropTypes.bool.isRequired,
  supplies: PropTypes.array.isRequired,
  readyS: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // Get access to Medicines documents.
  const subscriptionM = MedicineSource.subscribeMedicineSource();
  const subscriptionS = SupplySource.subscribeSupply();
  // Determine if the subscription is ready
  const readyM = subscriptionM.ready();
  const readyS = subscriptionS.ready();
  const today = new Date();
  // Get the Medicine documents and sort them by name.
  const medicines = MedicineSource.find(
    { state: { $in: ['Acted', 'Reserves'] }, quantity: { $gt: 0 }, expDate: { $gt: today } },
    { sort: { medName: 1 } },
  ).fetch();
  // Get the Supply documents and sort them by name.
  const supplies = SupplySource.find(
    { quantity: { $gt: 0 } },
    { sort: { supplyName: 1 } },
  ).fetch();
  return {
    medicines,
    readyM,
    supplies,
    readyS,
  };
})(Dispense);
