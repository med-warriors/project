import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter, NavLink } from 'react-router-dom';
import { Menu, Dropdown, Header, Select, Button, Input } from 'semantic-ui-react';
import { Medicines } from '../../api/medicine/MedicineCollection';

class Search extends React.Component {
  searchOptions = [
    { key: 'lotNumber', text: 'Lot Number', value: 'lotNumber' },
    { key: 'name', text: 'Name', value: 'name' },
    { key: 'location', text: 'Location', value: 'location' },
    { key: 'expirationDate', text: 'Exp Date', value: 'expirationDate' },
    { key: 'source', text: 'Source', value: 'source' },
  ];

  medicineChoice = 'lotNumber';

  handleChange = () => {medicineChoice = document.getElementById("medicineSelect").value};

  filterMedicines = (medicines, query) => {
    if (!query) {
      return medicines;
    }

    return medicines.filter((medicine) => {
      if (medicineChoice == 'name') {
        return medicine.name.includes(query);
      } else if (medicineChoice == 'lotNumber') {
        return medicine.lotNumber.includes(query);
      } else if (medicineChoice == 'location') {
        return medicine.location.includes(query);
      } else if (medicineChoice == 'expirationDate') {
        return medicine.expirationDate.includes(query);
      } else {
        return medicine.source.includes(query);
      }
    })
  }

  meds = Medicines;

  handleClick = () => {meds = filterMedicines(Medicines,query)};

  render() {
    return (
      <Input type='text' placeholder='Search...' action>
        <input />
        function() {
        <Select id="medicineSelect" compact options={searchOptions} defaultValue='lotNumber' onChange={handleChange} value={}/>
      }
        <Button type='submit' onClick={handleClick}>Search</Button>
      </Input>
    );
  }
}

export default Search;
