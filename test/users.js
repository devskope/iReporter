import { sampleValidUser, sampleInvalidUser } from './helpers';

export default ({ server, chai, expect, ROOT_URL }) => {
  describe('Users', () => {
    describe('signup', () => {
      it('User creation requests missing required field returns error response', () => {
        chai
          .request(server)
          .post(`${ROOT_URL}/auth/signup`)
          .send(sampleInvalidUser)
          .end((err, { body, status }) => {
            expect(status).eq(400);
            expect(body.errors).to.be.an.instanceof(Array);
          });
      });
      it('Should create valid User', () => {
        chai
          .request(server)
          .post(`${ROOT_URL}/auth/signup`)
          .send(sampleValidUser)
          .end((err, { status }) => {
            expect(status).eq(201);
          });
      });
    });
  });
};
