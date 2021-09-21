import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/**
 * The HistoryCollection. It encapsulates state and variable values for History.
 */
class HistoriesCollection {
  constructor() {
    // The name of this collection.
    this.name = 'HistoriesCollection';
    // Define the Mongo collection.
    this.collection = new Mongo.Collection(this.name);
    // Define the structure of each document in the collection.
    this.schema = new SimpleSchema({
      date: Date,
      transact: {
        type: String,
        allowedValues: ['In', 'Out'],
        defaultValue: 'In',
      },
      type: {
        type: String,
        allowedValues: ['Medicine', 'Supply'],
        defaultValue: 'Medicine',
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
 * The singleton instance of the HistoriesCollection.
 * @type {HistoriesCollection}
 */
export const Histories = new HistoriesCollection();
