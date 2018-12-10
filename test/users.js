import { sampleValidUser, sampleInvalidUser } from './helpers';

export default ({ server, chai, expect, ROOT_URL }) => {
  describe('Users', () => {
    describe('signup', () => {
      it('User creation requests missing required field returns error response', done => {
        chai
          .request(server)
          .post(`${ROOT_URL}/auth/signup`)
          .send(sampleInvalidUser)
          .end((err, { body, status }) => {
            expect(status).eq(400);
            expect(body.errors).to.be.an.instanceof(Array);
            done();
          });
      });

      it('Should create valid User', done => {
        chai
          .request(server)
          .post(`${ROOT_URL}/auth/signup`)
          .send(sampleValidUser)
          .end((err, { body, status }) => {
            expect(status).eq(201);
            expect(body.data[0]).have.own.property('user');
            expect(body.data[0]).to.have.own.property('token');
            done();
          });
      });

      it('Should not create duplicate User', done => {
        chai
          .request(server)
          .post(`${ROOT_URL}/auth/signup`)
          .send(sampleValidUser)
          .end((err, { status }) => {
            expect(status).eq(409);
            done();
          });
      });
    });

    describe('Login', () => {
      it('should not login user with missing requirements', done => {
        chai
          .request(server)
          .post(`${ROOT_URL}/auth/login`)
          .send({ ...sampleValidUser, ...{ username: undefined } })
          .end((err, { body, status }) => {
            expect(status).eq(400);
            expect(body.errors).to.be.an.instanceof(Array);
            done();
          });
      });

      it('Should log valid User in', done => {
        chai
          .request(server)
          .post(`${ROOT_URL}/auth/login`)
          .send(sampleValidUser)
          .end((err, { body, status }) => {
            expect(status).eq(200);
            expect(body.data[0]).have.own.property('user');
            expect(body.data[0]).to.have.own.property('token');
            done();
          });
      });
    });
  });
};
