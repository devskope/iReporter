import tokenGen from '../src/helpers/tokenGen';

export const recordPatches = {
  comment: 'lorem ipsum dolor sit amet',
  location: '-94.68589980000002, 46.729553',
  status: 'resolved',
  invalidStatus: 'gibberish',
};

export const records = {
  sampleValidRedFlag: {
    title: 'funny business',
    type: 'red-flag',
    location: '101.68685499999992,3.139003',
    comment: 'I smell something fishy',
  },
  sampleInvalidRedFlag: {
    type: 'red-flag',
    location: '101.68685499999992,3.139003',
    comment: 'I smell something fishy',
  },
  sampleIntervention: {
    type: 'intervention',
    location: '50.68685499999992,3.89',
    title: 'need intervention',
    comment: 'more on the state of the nations roads',
  },
};

export const user = {
  invalid: {
    username: 'rollo',
    password: 'weaksauce',
    firstname: 'apollo',
    lastname: 'varga',
  },
  valid: {
    email: 'op@yi.him',
    username: 'rollo',
    password: 'creamsauce',
    firstname: 'apollo',
    lastname: 'varga',
  },
  token: {
    email: 'tokenedup@somedomain.ru',
    username: 'tokenduser',
    password: 'realsauce',
    firstname: 'some man',
    lastname: 'alonzi',
  },
};

export const token = {
  invalid: 'in.va@lid',
  unbound: tokenGen({ user: `non-existent` }),
};
