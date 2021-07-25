const express = require('express');

const app = express();

function buildNode(id, label, children = []) {
  const newNode = {};
  newNode[id] = { label, children };
  return newNode;
}

// const ant = buildNode(2, 'ant');
// const root = { 1: { label: 'root', children: [ant] } };
const tree = [buildNode(1, 'root', [buildNode(2, 'ant'), buildNode(3, 'bear', [buildNode(4, 'cat'), buildNode(5, 'dog', [buildNode(6, 'elephant')])]), buildNode('7', 'frog')])];

app.get('/', (_, res) => {
  res.send('<h1>Welcome to the Hinge Health tree printer</h1>');
});

app.get('/api/tree', (_, res) => {
  res.set('Content-Type', 'text/json');
  res.send(JSON.stringify(tree));
});

module.exports = app;
