const sqlite3 = require('sqlite3');
const express = require('express');

const app = express();
app.use(express.json());
const db = new sqlite3.Database('./database.sqlite');

async function insertNode(id, label, parent) {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO items (id, label, parent) VALUES (?, ?, ?)', id, label, parent, (result, error) => {
      if (error) {
        reject(error);
      }

      resolve(result);
    });
  });
}

function insertRows() {
  insertNode(1, 'root');
  insertNode(2, 'ant', 1);
  insertNode(3, 'bear', 1);
  insertNode(4, 'cat', 3);
  insertNode(5, 'dog', 3);
  insertNode(6, 'elephant', 5);
  insertNode(7, 'frog', 1);
}

db.each("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='items'", (_, row) => {
  if (row['count(*)'] === 0) {
    db.run('CREATE TABLE items (id INTEGER PRIMARY KEY AUTOINCREMENT, label TEXT, parent INTEGER)', insertRows);
  }
});

async function fetchChildren(id) {
  const findChildren = (new Promise((resolve, reject) => {
    const children = [];

    db.each(`SELECT id, label, parent FROM items WHERE parent = ${id}`, (err, row) => {
      if (err) {
        reject(err);
      }

      children.push(row);
    }, () => {
      resolve(children);
    });
  }));

  let children = await findChildren;

  children = await Promise.all(children.map(async (child) => {
    const childItem = await formatItem(child);
    return childItem;
  }));

  return children;
}

async function formatItem(record) {
  const newRecord = {};
  const currentChildren = await fetchChildren(record.id);
  newRecord[record.id] = { label: record.label, children: currentChildren };

  return newRecord;
}

async function buildTree() {
  const findRoot = () => (new Promise((resolve, reject) => {
    let root;

    db.each('SELECT id, label, parent FROM items WHERE parent IS NULL LIMIT 1', (err, row) => {
      if (err) {
        reject(err);
      }

      root = row;
    }, () => {
      if (root === undefined) {
        throw new Error('unable to find root');
      }

      resolve(root);
    });
  }));

  const root = await formatItem(await findRoot());

  return root;
}

app.get('/', (_, res) => {
  res.send('<h1>Welcome to the Hinge Health tree printer</h1>');
});

app.get('/api/tree', async (_, res) => {
  res.set('Content-Type', 'text/json');

  const tree = await buildTree();

  res.send(JSON.stringify([tree]));
});

app.post('/api/tree', async (req, res) => {
  await insertNode(null, req.body.label, req.body.parent);

  const tree = await buildTree();

  res.send(JSON.stringify(tree));
});

module.exports = app;
