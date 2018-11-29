import { sampleRedFlagToAdd, sampleInvalidRedFlag } from './helpers';

export default ({ server, chai, expect, ROOT_URL, logger }) => {
  describe('Red-flag records', () => {
    describe('Creation', () => {
      it('Records missing required field returns error response', () => {
        chai
          .request(server)
          .post(`${ROOT_URL}/red-flags`)
          .send(sampleInvalidRedFlag)
          .end((err, { body, status }) => {
            logger(body);
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
  });
};
