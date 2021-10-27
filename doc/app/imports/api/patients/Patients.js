// import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
// import { Tracker } from 'meteor/tracker';
import BaseCollection from '../base/BaseCollection';

/**
 * The PatientsCollection. It encapsulates state and variable values for patients.
 */
class PatientsCollection extends BaseCollection {
  constructor() {
    super('PatientsCollection', new SimpleSchema({
      date: Date,
      id: String,
    }));

    // Define names for publications and subscriptions
    this.userPublicationName = `${this.name}.publication.user`;
    this.adminPublicationName = `${this.name}.publication.admin`;
  }
}

/**
 * The singleton instance of the PatientsCollection.
 * @type {PatientsCollection}
 */
export const Patients = new PatientsCollection();
