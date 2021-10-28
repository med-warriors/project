import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/**
 * The SuppliesCollection. It encapsulates state and variable values for stuff.
 */
class SuppliesCollection {
  constructor() {
    // The name of this collection.
    this.name = 'SuppliesCollection';
    // Define the Mongo collection.
    this.collection = new Mongo.Collection(this.name);
    // Define the structure of each document in the collection.
    this.schema = new SimpleSchema({
      name: String,
      location: {
        type: String,
        allowedValues: ['Cabinet 2', 'Back Cabinet', 'Shower Closet', 'Refrig Closet', 'Refrigerator', 'Drawer 6', 'Drawer 9', 'Case 4']
      },
      quantity: Number,
      source: String,
      status: String,
    }, { tracker: Tracker });
    // Attach the schema to the collection, so all attempts to insert a document are checked against schema.
    this.collection.attachSchema(this.schema);
    // Define names for publications and subscriptions
    this.userPublicationName = `${this.name}.publication.user`;
    this.adminPublicationName = `${this.name}.publication.admin`;
  }
}

/**
 * The singleton instance of the StuffsCollection.
 * @type {SuppliesCollection}
 */
export const Supplies = new SuppliesCollection();
