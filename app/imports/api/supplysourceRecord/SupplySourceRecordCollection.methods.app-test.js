import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import faker from 'faker';
import { SupplySourceRecord } from './SupplySourceCollectionRecord';
import { defineTestUser, withLoggedInUser, withSubscriptions } from '../../test-utilities/test-utilities';
import { defineMethod, updateMethod, removeItMethod } from '../base/BaseCollection.methods';

/* eslint prefer-arrow-callback: "off",  no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('SupplyCollection Meteor Methods', function testSuite() {
    it('Can define, update, and removeIt', async function test1() {
      const { username, password } = await defineTestUser.callPromise();
      await withLoggedInUser({ username, password });
      await withSubscriptions();
      const collectionName = SupplySourceRecord.getCollectionName();
      const definitionData = {};
      definitionData.name = faker.lorem.words();
      definitionData.location = faker.lorem.words();
      definitionData.quantity = faker.datatype.number({
        min: 1,
        max: 10,
      });
      definitionData.owner = username;
      // console.log(collectionName, definitionData);
      const docID = await defineMethod.callPromise({ collectionName, definitionData });
      expect(SupplySourceRecord.isDefined(docID)).to.be.true;
      let doc = SupplySourceRecord.findDoc(docID);
      expect(doc.name).to.equal(definitionData.name);
      expect(doc.quantity).to.equal(definitionData.quantity);
      expect(doc.location).to.equal(definitionData.location);
      const updateData = {};
      updateData.id = docID;
      updateData.name = faker.lorem.words();
      updateData.location = faker.lorem.words();
      updateData.quantity = faker.datatype.number({
        min: 1,
        max: 10,
      });
      await updateMethod.callPromise({ collectionName, updateData });
      doc = SupplySourceRecord.findDoc(docID);
      expect(doc.name).to.equal(updateData.name);
      expect(doc.quantity).to.equal(updateData.quantity);
      expect(doc.location).to.equal(updateData.location);
      await removeItMethod.callPromise({ collectionName, instance: docID });
      expect(SupplySourceRecord.isDefined(docID)).to.be.false;
    });
  });
}
