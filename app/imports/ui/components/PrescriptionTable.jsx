import React, { useState } from 'react';
import { Grid, Segment, Header, Loader, Table, Input } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { MedicineSource } from '../../api/medSource/MedicineSourceCollection';
import DispenseItem from './DispenseItem';
import DispenseList from './DispenseList';

/** Renders the Page for adding a document. */
const PrescriptionTable = ({ ready, medicines, cellDispense, setDispense}) => {
  // state functions
  const [search, setSearch] = useState('');
  // variable to sort medicine
  let medSort = [];
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

  const addDispense = (data) => {
    // sets add Dispense state to added value
    const updateDispense = [...cellDispense, { medId: data, prescriptionQuantity: 0 }];
    setDispense(updateDispense);
  };

  const removeDispense = (data) => {
    // sets add Dispense state to added value
    setDispense(cellDispense.filter(item => item.medId !== data));
  };

  if (ready) {
    if (search) {
      // filters medicine items by search value and sorts them by name
      medSort = _.sortBy(medicines.filter(medicine => medSearch(medicine)), 'medName');
    }
    if (cellDispense) {
      for (let i = 0; i < cellDispense.length; i++) {
        const med = MedicineSource.findDoc(cellDispense[i].medId);
        dispenseList.push(med);
      }
    }
  }

  return ((ready) ? (
    <Grid container centered>
      <Segment>
        <Grid>
          <Grid.Row centered>
            <Grid.Row centered>
              <Input type='search' placeholder='Search by name' icon='search' onChange={handleSearch}/>
              <Header as="h4" textAlign="center">Medicine & Supplies Item</Header>
            </Grid.Row>
            <Table celled color='red'>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Lot #</Table.HeaderCell>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Quantity</Table.HeaderCell>
                  <Table.HeaderCell>location</Table.HeaderCell>
                  <Table.HeaderCell>ExpDate</Table.HeaderCell>
                  <Table.HeaderCell>State</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {medSort.map((inventories) => <DispenseItem
                  key={inventories._id} inventories={inventories} addDispense={addDispense}
                />)}
              </Table.Body>
            </Table>
          </Grid.Row>
          <Grid.Row centered>
            <Header as="h4" textAlign="center">Dispensing List</Header>
            <Table celled color='green'>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Lot #</Table.HeaderCell>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Quantity</Table.HeaderCell>
                  <Table.HeaderCell>location</Table.HeaderCell>
                  <Table.HeaderCell>ExpDate</Table.HeaderCell>
                  <Table.HeaderCell>State</Table.HeaderCell>
                  <Table.HeaderCell>Dispense Quantity</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {dispenseList.map((inventories) => <DispenseList
                  key={inventories._id} inventories={inventories} removeDispense={removeDispense}/>)}
              </Table.Body>
            </Table>
          </Grid.Row>
        </Grid>
      </Segment>
    </Grid>
  ) : <Loader active>Getting data</Loader>);
};

// Require the presence of a Stuff document in the props object. Uniforms adds 'model' to the props, which we use.
PrescriptionTable.propTypes = {
  medicines: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
  cellDispense: PropTypes.array,
  setDispense: PropTypes.func,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // Get access to Medicines documents.
  const subscription = MedicineSource.subscribeMedicineSource();
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the Medicine documents and sort them by name.
  const medicines = MedicineSource.find({ state: 'Acted' || 'Reserves' }, { sort: { name: 1 } }).fetch();
  return {
    medicines,
    ready,
  };
})(PrescriptionTable);
