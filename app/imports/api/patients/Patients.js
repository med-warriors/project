import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/**
 * The PatientsCollection. It encapsulates state and variable values for patients.
 */
class PatientsCollection {
  constructor() {
    // The name of this collection.
    this.name = 'PatientsCollection';
    // Define the Mongo collection.
    this.collection = new Mongo.Collection(this.name);
    // Define the structure of each document in the collection.
    this.schema = new SimpleSchema({
      date: Date,
      name: String,
      email: String,
      phone_number: Number,
      prescription: String,
    }, { tracker: Tracker });
    // Attach the schema to the collection, so all attempts to insert a document are checked against schema.
    this.collection.attachSchema(this.schema);
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
