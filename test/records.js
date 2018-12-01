import { recordStore } from '../src/config/db';
import { RedFlag } from '../src/models/records';
import { ID, sampleRedFlagToAdd, sampleInvalidRedFlag } from './helpers';

export default ({ server, chai, expect, ROOT_URL }) => {
  describe('Red-flag records', () => {
    describe('Creation', () => {
      it('Records missing required field returns error response', () => {
        chai
          .request(server)
          .post(`${ROOT_URL}/red-flags`)
          .send(sampleInvalidRedFlag)
          .end((err, { body, status }) => {
            expect(status).eq(400);
            expect(body.errors[0]).eq('missing required title field');
          });
        chai
          .request(server)
          .post(`${ROOT_URL}/red-flags`)
          .send({ ...sampleInvalidRedFlag, ...{ comment: undefined } })
          .end((err, { body, status }) => {
            expect(status).eq(400);
            expect(body.errors[0]).eq(
              'missing required title and comment fields'
            );
          });
      });

      it('mismatched request data types should return error', () => {
        chai
          .request(server)
          .post(`${ROOT_URL}/red-flags`)
          .send({ ...sampleRedFlagToAdd, ...{ location: 'knowhere' } })
          .end((err, { body, status }) => {
            expect(status).eq(422);
            expect(body.errors[0]).to.be.a('string');
          });
      });

      it('Creates a valid red-flag record', () => {
        chai
          .request(server)
          .post(`${ROOT_URL}/red-flags`)
          .send(sampleRedFlagToAdd)
          .end((err, { body, status }) => {
            expect(status).eq(201);
            expect(body.data[0].message).eq('Created red-flag record');
          });
      });
    });

    describe('Fetching all', () => {
      it('Returns a not found response when no records exist', () => {
        recordStore.clear();
        chai
          .request(server)
          .get(`${ROOT_URL}/red-flags`)
          .end((err, { body, status }) => {
            expect(status).eq(404);
            expect(body.errors[0]).eq('No red-flag records found');
          });
      });

      it('Should fetch all available red-flag records', () => {
        new RedFlag(sampleRedFlagToAdd).save();
        chai
          .request(server)
          .get(`${ROOT_URL}/red-flags/`)
          .end((err, { body, status }) => {
            expect(status).eq(200);
            expect(body.data).to.be.an.instanceof(Array);
            expect(body.data[0]).to.be.an('object');
          });
      });

      it('Returns a not found response when specific record ID does not exist', () => {
        chai
          .request(server)
          .get(`${ROOT_URL}/red-flags/${ID.nonExistent}`)
          .end((err, { body, status }) => {
            expect(status).eq(404);
            expect(body.errors[0]).eq(
              `No order found with id '${ID.nonExistent}'`
            );
          });
      });

      it('Should fetch a specific red-flag record by ID', () => {
        chai
          .request(server)
          .get(`${ROOT_URL}/red-flags/${ID.valid}`)
          .end((err, { body, status }) => {
            expect(status).eq(200);
            expect(body.data).to.be.an.instanceof(Array);
            expect(body.data[0]).to.be.an('object');
          });
      });
    });
  });
};