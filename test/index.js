import chai from 'chai';
import chaiHttp from 'chai-http';
import debug from 'debug';
import server from '../src/server';
import records from './records';
import users from './users';
import tokenAuth from './tokenAuth';
import mailer from './mailer';

chai.use(chaiHttp);

const { expect } = chai;
const logger = debug('iReporter::test:');
const ROOT_URL = `/api/v1`;
const testArgs = { server, chai, expect, ROOT_URL, logger };

tokenAuth(testArgs);
records(testArgs);
users(testArgs);
mailer(testArgs);
