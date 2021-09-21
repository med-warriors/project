// import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
// import { Tracker } from 'meteor/tracker';
import BaseCollection from '../base/BaseCollection';

/**
 * The HistoryCollection. It encapsulates state and variable values for History.
 */
class HistoriesCollection extends BaseCollection {
  constructor() {
    super('HistoriesCollection', new SimpleSchema({
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
    }));
    // Attach the schema to the collection, so all attempts to insert a document are checked against schema.
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
