import chai from 'chai';
import chaiHttp from 'chai-http';
import debug from 'debug';
import server from '../src/server';
import isAllWell from './isallwellintestland';

chai.use(chaiHttp);
const { expect } = chai;
const logger = debug('iReporter::test:');
const testArgs = { server, chai, expect, logger };

isAllWell(testArgs);
