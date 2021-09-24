import { Meteor } from 'meteor/meteor';
import { Stuffs } from '../../api/stuff/StuffCollection';
import { Patients } from '../../api/patients/PatientCollection';
// import { UserProfiles } from '../../api/profile/UserProfileCollection';
import { Profiles } from '../../api/profile/Profile';
import { SupplySourecs } from '../../api/source/SupplySourceCollection';
import { Medicines } from '../../api/medicine/MedicineCollection';
import { Supplies } from '../../api/supply/SupplyCollection';
import { Histories } from '../../api/history/HistoryCollection';
/* eslint-disable no-console */

// Initialize the database with a default data document.
function addData(data) {
  console.log(`  Adding: ${data.name} (${data.owner})`);
  Stuffs.define(data);
}

// Initialize the database with a default data document.
function addProfile(data) {
  console.log(`  Adding: ${data.name} (${data.owner})`);
  Profiles.collection.insert(data);
}

function addSource(data) {
  console.log(`  Adding: ${data.name} `);
  SupplySourecs.define(data);
}

// Initialize the database with a default data document.
function addPatients(data) {
  console.log(`  Adding patient: ${data.date} (${data.name})`);
  Patients.define(data);
}

// Initialize the database with a default data document.
function addMedicine(data) {
  console.log(`  Adding medicine: ${data.lotNumber} (${data.name})`);
  Medicines.define(data);
}

// Initialize the database with a default data document.
function addSupply(data) {
  console.log(`  Adding supply: ${data.name} `);
  Supplies.define(data);
}

// Initialize the database with a default data document.
function addHistory(data) {
  console.log(`  Adding history: ${data.date} (${data.transact})`);
  Histories.define(data);
}

// Initialize the StuffsCollection if empty.
if (Stuffs.count() === 0) {
  if (Meteor.settings.defaultData) {
    console.log('Creating default data.');
    Meteor.settings.defaultData.map(data => addData(data));
  }

}
// Initialize the ProfilesCollection if empty.
if (Profiles.collection.find().count() === 0) {
  if (Meteor.settings.defaultProfiles) {
    console.log('Creating default Profiles.');
    Meteor.settings.defaultProfiles.map(data => addProfile(data));
  }
}

if (SupplySourecs.count() === 0) {
  if (Meteor.settings.defaultSupplySource) {
    console.log('Creating default sources data.');
    Meteor.settings.defaultSupplySource.map(data => addSource(data));
  }
}

// Initialize the PatientCollection if empty.
if (Patients.count() === 0) {
  if (Meteor.settings.defaultPatientHistory) {
    console.log('Creating default patient data.');
    Meteor.settings.defaultPatientHistory.map(data => addPatients(data));
  }
}

// Initialize the MedicineCollection if empty.
if (Medicines.count() === 0) {
  if (Meteor.settings.defaultMedicines) {
    console.log('Creating default medicines data.');
    Meteor.settings.defaultMedicines.map(data => addMedicine(data));
  }
}

// Initialize the SupplyCollection if empty.
if (Supplies.count() === 0) {
  if (Meteor.settings.defaultSupplies) {
    console.log('Creating default supplies data.');
    Meteor.settings.defaultSupplies.map(data => addSupply(data));
  }
}

// Initialize the SupplyCollection if empty.
if (Histories.count() === 0) {
  if (Meteor.settings.defaultHistory) {
    console.log('Creating default history data.');
    Meteor.settings.defaultHistory.map(data => addHistory(data));
  }
}
