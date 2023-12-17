import request from 'supertest';
import { expect } from 'chai';
import { PrismaClient } from '@prisma/client';

import app from '../../src/index'; 
import dotenv from 'dotenv';
const prisma = new PrismaClient();

describe('Config', () => {
  before(() => {
    dotenv.config(); // Load .env file
  });

  it('Server setup successfully', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).to.equal(200); // use the expect function
    expect(response.text).to.equal('Hello World!'); // use the expect function
  });

  it('Connects to the database', async () => {
    try {
      await prisma.$connect();
      expect(true).to.equal(true); // If we reach this line, the connection was successful
    } catch (error) {
      expect.fail('Could not connect to the database'); // If we catch an error, the connection failed
    } finally {
      await prisma.$disconnect(); // Always disconnect after the test
    }
  });

  it('All .env files are set up correctly', () => {
    const requiredEnvVariables = ['DATABASE_URL', 'PORT', 'SECRET_KEY'];
    const missingEnvVariables = requiredEnvVariables.filter((envVariable) => !process.env[envVariable]);

    expect(missingEnvVariables).to.deep.equal([]); // If the array is empty, all required env variables are set up correctly
  });
});