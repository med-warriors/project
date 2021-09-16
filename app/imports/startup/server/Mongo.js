import { Meteor } from 'meteor/meteor';
import { Stuffs } from '../../api/stuff/StuffCollection';
import { Patients } from '../../api/patients/PatientCollection';

/* eslint-disable no-console */

// Initialize the database with a default data document.
function addData(data) {
  console.log(`  Adding: ${data.name} (${data.owner})`);
  Stuffs.define(data);
}

// Initialize the StuffsCollection if empty.
if (Stuffs.count() === 0) {
  if (Meteor.settings.defaultData) {
    console.log('Creating default data.');
    Meteor.settings.defaultData.map(data => addData(data));
  }
}

// Initialize the database with a default data document.
function addPatients(data) {
  console.log(`  Adding patient: ${data.date} (${data.name})`);
  Patients.define(data);
}

// Initialize the PatientCollection if empty.
if (Patients.count() === 0) {
  if (Meteor.settings.defaultPatientHistory) {
    console.log('Creating default patient data.');
    Meteor.settings.defaultPatientHistory.map(data => addPatients(data));
  }
}
