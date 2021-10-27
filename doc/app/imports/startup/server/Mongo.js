import { Meteor } from 'meteor/meteor';
import { Stuffs } from '../../api/stuff/StuffCollection';
import { Patients } from '../../api/patients/PatientCollection';
// import { UserProfiles } from '../../api/profile/UserProfileCollection';
import { Profiles } from '../../api/profile/Profile';
import { SupplySourecs } from '../../api/source/SupplySourceCollection';
import { Medicines } from '../../api/medicine/MedicineCollection';
import { MedicineSource } from '../../api/medSource/MedicineSourceCollection';
import { Supplies } from '../../api/supply/SupplyCollection';
import { TransationHistories } from '../../api/transaction/TransationHistoriesCollection';

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
  console.log(`  Adding medicine: ${data.name} `);
  Medicines.define(data);
}

// Initialize the database with a default data document.
function addMedicineInventory(data) {
  console.log(`  Adding inventory: ${data.lotNumber} (${data.name})`);
  MedicineSource.define(data);
}

// Initialize the database with a default data document.
function addSupply(data) {
  console.log(`  Adding supply: ${data.name} `);
  Supplies.define(data);
}

// Initialize the database with a default data document.
function addTransationHistory(data) {
  console.log(`  Adding history: ${data.date}`);
  TransationHistories.define(data);
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

// Initialize the MedicineCollection if empty.
if (MedicineSource.count() === 0) {
  if (Meteor.settings.defaultMedicineInventory) {
    console.log('Creating default medicines data.');
    Meteor.settings.defaultMedicineInventory.map(data => addMedicineInventory(data));
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
if (TransationHistories.count() === 0) {
  if (Meteor.settings.defaultTransationHistory) {
    console.log('Creating default history data.');
    Meteor.settings.defaultTransationHistory.map(data => addTransationHistory(data));
  }
}
