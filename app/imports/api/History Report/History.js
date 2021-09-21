import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/**
 * The HistoryCollection. It encapsulates state and variable values for History.
 */
class HistoryCollection {
  constructor() {
    // The name of this collection.
    this.name = 'HistoryCollection';
    // Define the Mongo collection.
    this.collection = new Mongo.Collection(this.name);
    // Define the structure of each document in the collection.
    this.schema = new SimpleSchema({
      date: Date,
      transact: {
        type: String,
        allowedValues: ['In', 'Out'],
        defaultValue: '',
      },
      type: {
        type: String,
        allowedValues: ['Medicine', 'Supply'],
        defaultValue: '',
      },
      patientName: String,
      prescription: String,
      employee: Number,
    }, { tracker: Tracker });
    // Attach the schema to the collection, so all attempts to insert a document are checked against schema.
    this.collection.attachSchema(this.schema);
    // Define names for publications and subscriptions
    this.userPublicationName = `${this.name}.publication.user`;
    this.adminPublicationName = `${this.name}.publication.admin`;
  }
}

/**
 * The singleton instance of the HistoryCollection.
 * @type {HistoryCollection}
 */
export const History = new HistoryCollection();
