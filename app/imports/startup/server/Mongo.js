import { Meteor } from 'meteor/meteor';
import { Patients } from '../../api/patients/PatientCollection';
// import { UserProfiles } from '../../api/profile/UserProfileCollection';
import { Profiles } from '../../api/profile/Profile';
import { SupplySource } from '../../api/supplysource/SupplySourceCollection';
import { Medicines } from '../../api/medicine/MedicineCollection';
import { MedicineSource } from '../../api/medSource/MedicineSourceCollection';
import { Supplies } from '../../api/supply/SupplyCollection';

// variables to read off JSON files from /private directory
const medicines = JSON.parse(Assets.getText('medicine.json'));
const medInventory = JSON.parse(Assets.getText('medInventory.json'));
const supplies = JSON.parse(Assets.getText('supplies.json'));
const supSource = JSON.parse(Assets.getText('supplySource.json'));

// Initialize the database with profile document.
function addProfile(profile) {
  console.log(`  Adding: ${profile.name} (${profile.owner})`);
  Profiles.collection.insert(profile);
}

// Initialize the ProfilesCollection if empty.
if (Profiles.collection.find().count() === 0) {
  if (Meteor.settings.defaultProfiles) {
    console.log('Creating default Profiles.');
    Meteor.settings.defaultProfiles.map(profile => addProfile(profile));
  }
}

// Initialize the database with patient document.
function addPatients(patients) {
  console.log(`  Adding patient: ${patients.date} (${patients.id})`);
  Patients.define(patients);
}

// Initialize the PatientCollection if empty.
if (Patients.count() === 0) {
  if (Meteor.settings.defaultPatientHistory) {
    console.log('Creating default patient data.');
    Meteor.settings.defaultPatientHistory.map(patients => addPatients(patients));
  }
}

// Initialize the database with medicine document.
function addMedicine(medicine) {
  console.log(`  Adding medicine: ${medicine.name} `);
  Medicines.define(medicine);
}

// Initialize the MedicineCollection if empty.
if (Medicines.count() === 0) {
  if (medicines) {
    console.log('Creating default medicines data.');
    medicines.map(medicine => addMedicine(medicine));
  }
}

// Initialize the database with medicine inventory document.
function addMedicineInventory(medSource) {
  console.log(`  Adding inventory: ${medSource.lotNumber} (${medSource.medName})`);
  MedicineSource.define(medSource);
}

// Initialize the MedicineCollection if empty.
if (MedicineSource.count() === 0) {
  if (medInventory) {
    console.log('Creating default medicines data.');
    medInventory.map(medSource => addMedicineInventory(medSource));
  }
}

// Initialize the database with supply document.
function addSupply(supply) {
  console.log(`  Adding supply: ${supply.name} `);
  Supplies.define(supply);
}

// Initialize the SupplyCollection if empty.
if (Supplies.count() === 0) {
  if (supplies) {
    console.log('Creating default supplies data.');
    supplies.map(supply => addSupply(supply));
  }
}

// Initialize database with supply source document.
function addSource(supplysource) {
  console.log(`  Adding supply donated by ${supplysource.sourceName} `);
  SupplySource.define(supplysource);
}

// Initialize SupplySourceCollection if empty.
if (SupplySource.count() === 0) {
  if (supSource) {
    console.log('Creating default sources data.');
    supSource.map(supplysource => addSource(supplysource));
  }
}
