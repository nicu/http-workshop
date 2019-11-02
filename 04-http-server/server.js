const express = require('express');
const bodyParser = require('body-parser');

const Cats = require('./db/cats');

const PORT = process.argv[2];
const app = express();

const isAuthorized = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).end('Not Authorized!');
  }

  const credentials = req.headers.authorization.substr(7);
  const buff = Buffer.from(credentials, 'base64');
  const [user, pass] = buff.toString('ascii').split(':');

  if (user !== 'aladdin' || pass !== 'opensesame') {
    return res.status(401).end('Not Authorized!');
  }

  next();
};

// configuration
app.set('view engine', 'ejs');

// middleware
app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

app.use((req, res, next) => {
  res.cookie('server', PORT);
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// GET /cats get all, returns 200
app.get('/cats', async (req, res) => {
  const paginated = await Cats.findAll({ page: req.query.page });

  res.format({
    'text/html': function() {
      res.render('cats', { data: paginated });
    },

    'application/json': function() {
      res.json(paginated);
    }
  });
});

// POST /cats	create, returns 201
app.post(
  '/cats',
  /*isAuthorized,*/ async (req, res) => {
    const cat = await Cats.create(req.body);
    res.status(201).json(cat);
  }
);

// GET /cats/1	read, returns 200
app.get('/cats/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const cat = await Cats.find({ id });
  res.json(cat);
});

// PUT /cats/1	edit (or path), returns 200
// DELETE /cats/1	delete, returns 200

// non existent page
app.use((req, res, next) => {
  res.send(`${req.method} ${req.path} does not exist`);
  next();
});

// error handler
app.use((err, req, res, next) => {
  res.status(500);
  res.end('Something broke');
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
