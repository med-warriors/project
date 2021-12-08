import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import faker from 'faker';
import fc from 'fast-check';
import { removeAllEntities } from '../base/BaseUtilities';
import { GuestProfiles } from './GuestProfileCollection';

/* eslint prefer-arrow-callback: "off",  no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('DoctorProfileCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1(done) {
      fc.assert(
        fc.property(fc.lorem({ maxCount: 1 }), fc.lorem({ maxCount: 1 }),
          (firstName, lastName) => {
            const email = faker.internet.email();
            const docID = GuestProfiles.define({ email, firstName, lastName });
            expect(GuestProfiles.isDefined(docID)).to.be.true;
            GuestProfiles.removeIt(docID);
            expect(GuestProfiles.isDefined(docID)).to.be.false;
          }),
      );
      done();
    });

    it('Cannot define duplicates', function test2() {
      const email = faker.internet.email();
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      const docID1 = GuestProfiles.define({ email, firstName, lastName });
      const docID2 = GuestProfiles.define({ email, firstName, lastName });
      expect(docID1).to.equal(docID2);
    });

    it('Can update', function test3(done) {
      const email = faker.internet.email();
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      const password = faker.internet.password();
      const docID = GuestProfiles.define({ email, firstName, lastName, password });
      fc.assert(
        fc.property(fc.lorem(1), fc.lorem(1), (fName, lName) => {
          GuestProfiles.update(docID, { firstName: fName, lastName: lName });
          const doctor = GuestProfiles.findDoc(docID);
          expect(doctor.firstName).to.equal(fName);
          expect(doctor.lastName).to.equal(lName);
        }),
      );
      done();
    });
  });
}
