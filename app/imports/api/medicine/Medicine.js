import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/**
 * The MedicinesCollection. It encapsulates state and variable values for stuff.
 */
class MedicinesCollection {
  constructor() {
    // The name of this collection.
    this.name = 'MedicinesCollection';
    // Define the Mongo collection.
    this.collection = new Mongo.Collection(this.name);
    // Define the structure of each document in the collection.
    this.schema = new SimpleSchema({
      lotNumber: Number,
      name: String,
      type: String,
      location: String,
      quantity: Number,
      expirationDate: String,
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
 * @type {MedicinesCollection}
 */
export const Medicines = new MedicinesCollection();
