const supertest = require('supertest');
const app = require('./app');

const request = supertest(app);

describe('/', () => {
  let response;

  beforeEach(async () => {
    response = await request.get('/');
  });

  it('responds successfully', () => {
    expect(response.status).toBe(200);
  });

  it('shows the welcome message', () => {
    expect(response.text).toContain('Hinge Health');
  });
});

describe('/api/tree', () => {
  let response;

  beforeEach(async () => {
    response = await request.get('/api/tree');
  });

  it('responds successfully', () => {
    expect(response.status).toBe(200);
  });

  it('returns a current tree', () => {
    const basicTree = [{
      1: {
        label: 'root',
        children: [
          { 2: { label: 'ant', children: [] } },
          {
            3: {
              label: 'bear',
              children: [
                { 4: { label: 'cat', children: [] } },
                {
                  5: {
                    label: 'dog',
                    children: [
                      { 6: { label: 'elephant', children: [] } },
                    ],
                  },
                },
              ],
            },
          },
          { 7: { label: 'frog', children: [] } },
        ],
      },
    }];

    expect(JSON.parse(response.text)).toEqual(basicTree);
  });
});
