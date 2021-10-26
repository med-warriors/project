import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import faker from 'faker';
import { Medicines } from './MedicineCollection';
import { defineTestUser, withLoggedInUser, withSubscriptions } from '../../test-utilities/test-utilities';
import { defineMethod, updateMethod, removeItMethod } from '../base/BaseCollection.methods';

/* eslint prefer-arrow-callback: "off",  no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('MedicineCollection Meteor Methods', function testSuite() {
    it('Can define, update, and removeIt', async function test1() {
      const { username, password } = await defineTestUser.callPromise();
      await withLoggedInUser({ username, password });
      await withSubscriptions();
      const collectionName = Medicines.getCollectionName();
      const definitionData = {};
      definitionData.name = faker.lorem.words();
      definitionData.type = faker.lorem.words();
      definitionData.form = faker.lorem.words();
      definitionData.unity = faker.lorem.words();
      definitionData.note = faker.lorem.words();
      definitionData.should_have = faker.datatype.number({
        min: 1,
        max: 10,
      });
      definitionData.owner = username;
      // console.log(collectionName, definitionData);
      const docID = await defineMethod.callPromise({ collectionName, definitionData });
      expect(Medicines.isDefined(docID)).to.be.true;
      let doc = Medicines.findDoc(docID);
      expect(doc.name).to.equal(definitionData.name);
      expect(doc.type).to.equal(definitionData.type);
      expect(doc.form).to.equal(definitionData.form);
      expect(doc.unity).to.equal(definitionData.unity);
      expect(doc.should_have).to.equal(definitionData.should_have);
      expect(doc.note).to.equal(definitionData.note);
      const updateData = {};
      updateData.id = docID;
      updateData.name = faker.lorem.words();
      updateData.type = faker.lorem.words();
      updateData.form = faker.lorem.words();
      updateData.should_have = faker.datatype.number({
        min: 1,
        max: 10,
      });
      updateData.unity = faker.lorem.words();
      updateData.note = faker.lorem.words();
      await updateMethod.callPromise({ collectionName, updateData });
      doc = Medicines.findDoc(docID);
      expect(doc.name).to.equal(updateData.name);
      expect(doc.type).to.equal(updateData.type);
      expect(doc.form).to.equal(updateData.form);
      expect(doc.unity).to.equal(updateData.unity);
      expect(doc.should_have).to.equal(updateData.should_have);
      expect(doc.note).to.equal(updateData.note);
      await removeItMethod.callPromise({ collectionName, instance: docID });
      expect(Medicines.isDefined(docID)).to.be.false;
    });
  });
}
