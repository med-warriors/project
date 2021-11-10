import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import faker from 'faker';
import { MedicineSource } from './MedicineSourceourceCollection';
import { defineTestUser, withLoggedInUser, withSubscriptions } from '../../../test-utilities/test-utilities';
import { defineMethod, updateMethod, removeItMethod } from '../../base/BaseCollection.methods';

/* eslint prefer-arrow-callback: "off",  no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('MedicineCollection Meteor Methods', function testSuite() {
    it('Can define, update, and removeIt', async function test1() {
      const { username, password } = await defineTestUser.callPromise();
      await withLoggedInUser({ username, password });
      await withSubscriptions();
      const collectionName = MedicineSource.getCollectionName();
      const definitionData = {};
      definitionData.lotNumber = faker.datatype.number({
        min: 1,
        max: 10,
      });
      definitionData.name = faker.lorem.words();
      definitionData.type = faker.lorem.words();
      definitionData.location = faker.lorem.words();
      definitionData.quantity = faker.datatype.number({
        min: 1,
        max: 10,
      });
      definitionData.should_have = faker.datatype.number({
        min: 1,
        max: 10,
      });
      definitionData.expirationDate = faker.lorem.words();
      definitionData.owner = username;
      // console.log(collectionName, definitionData);
      const docID = await defineMethod.callPromise({ collectionName, definitionData });
      expect(MedicineSource.isDefined(docID)).to.be.true;
      let doc = MedicineSource.findDoc(docID);
      expect(doc.lotNumber).to.equal(definitionData.lotNumber);
      expect(doc.name).to.equal(definitionData.name);
      expect(doc.type).to.equal(definitionData.type);
      expect(doc.location).to.equal(definitionData.location);
      expect(doc.quantity).to.equal(definitionData.quantity);
      expect(doc.should_have).to.equal(definitionData.should_have);
      expect(doc.expirationDate).to.equal(definitionData.expirationDate);
      const updateData = {};
      updateData.id = docID;
      updateData.lotNumber = faker.datatype.number({
        min: 1,
        max: 10,
      });
      updateData.name = faker.lorem.words();
      updateData.type = faker.lorem.words();
      updateData.location = faker.lorem.words();
      updateData.quantity = faker.datatype.number({
        min: 1,
        max: 10,
      });
      updateData.should_have = faker.datatype.number({
        min: 1,
        max: 10,
      });
      updateData.expirationDate = faker.lorem.words();
      await updateMethod.callPromise({ collectionName, updateData });
      doc = MedicineSource.findDoc(docID);
      expect(doc.lotNumber).to.equal(updateData.lotNumber);
      expect(doc.name).to.equal(updateData.name);
      expect(doc.type).to.equal(updateData.type);
      expect(doc.location).to.equal(updateData.location);
      expect(doc.quantity).to.equal(updateData.quantity);
      expect(doc.should_have).to.equal(updateData.should_have);
      expect(doc.expirationDate).to.equal(updateData.expirationDate);
      await removeItMethod.callPromise({ collectionName, instance: docID });
      expect(MedicineSource.isDefined(docID)).to.be.false;
    });
  });
}
