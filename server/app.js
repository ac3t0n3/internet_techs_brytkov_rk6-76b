require('dotenv').config();

const ObjectId = require('mongodb').ObjectId; 
const express = require('express');
const bodyParser = require('body-parser')

const app = express();
const dbo = require('./db/connection');

const port = process.env.APP_PORT;

dbo.connectToServer(() => {
  app.listen(port, function () {
    console.log(`listening on ${port}`)
  })
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// CREATE auto
app.post('/autos', (req, res) => {
  const dbConnect = dbo.getDb();
  const autoDocument = {
    brand: req.body.brand || '',
    model: req.body.model || '',
    registration_number: req.body.registration_number || null,
    percent_of_fuel: req.body.percent_of_fuel || 0,
    coordinates: req.body.coordinates || [],
    refueler_id: req.body.refueler_id || ''
  };

  dbConnect
    .collection('auto')
    .insertOne(autoDocument, function (err, result) {
      if (err) {
        res.status(400).send("Error inserting auto!");
      } else {
        console.log(`Added a new auto with id ${result.insertedId}`);
        res.status(204).send();
      }
    });
})

// READ auto
app.get('/autos', (_, res) => {
  const dbConnect = dbo.getDb();

  dbConnect.collection('auto').find().toArray()
    .then(results => {
      console.log(results);
      res.json(results);
    })
    .catch(error => {
      console.error(error);
      res.status(400).send("Error fetching autos!");
    })
})

app.get('/autos/:id', (req, res) => {
  const dbConnect = dbo.getDb();

  try {
    dbConnect.collection('auto').findOne({ _id: new ObjectId(req.params.id) })
      .then(results => {
        console.log(results);
        res.json(results);
    })
  } catch(error) {
    console.error(error);
    res.status(400).send("Error fetching auto!");
  }
})

// UPDATE auto
app.put('/autos', (req, res) => {
  const dbConnect = dbo.getDb();
  const { _id: autoId,  brand, model, registration_number, percent_of_fuel, coordinates, refueler_id} = req.body;
  const updates = {
    $set: {
      brand,
      model,
      registration_number,
      percent_of_fuel,
      coordinates,
      refueler_id: new ObjectId(refueler_id)
    }
  };

  try {
    dbConnect
      .collection("auto")
      .findOneAndUpdate({ _id: new ObjectId(autoId) }, updates).then(() => res.status(204).send());
  } catch (error) {
    console.error(error);
    res.status(400).send(`Error updating auto on listing with id ${autoId}!`);
  }
});

// DELETE auto
app.delete('/autos/:id', (req, res) => {
  const dbConnect = dbo.getDb();
  const autoId = req.params.id

  try {
    dbConnect
      .collection("auto")
      .deleteOne({ _id: new ObjectId(autoId)}).then(() => res.status(204).send());
  } catch (error) {
    console.error(error);
    res.status(400).send(`Error deleting listing with id ${autoId}!`);
  }
});

// CREATE refueler
app.post('/refuelers', (req, res) => {
  const dbConnect = dbo.getDb();
  const refuelerDocument = {
    name: req.body.name,
  };

  dbConnect
    .collection('refueler')
    .insertOne(refuelerDocument, function (err, result) {
      if (err) {
        res.status(400).send("Error inserting refueler!");
      } else {
        console.log(`Added a new refueler with id ${result.insertedId}`);
        res.status(204).send();
      }
    });
})

// READ refueler
app.get('/refuelers', (_, res) => {
  const dbConnect = dbo.getDb();

  dbConnect.collection('refueler').find().toArray()
    .then(results => {
      console.log(results);
      res.json(results);
    })
    .catch(error => {
      console.error(error);
      res.status(400).send("Error fetching autos!");
    })
})

app.get('/refuelers/:id', (req, res) => {
  const dbConnect = dbo.getDb();

  try {
    dbConnect.collection('refueler').findOne({ _id: new ObjectId(req.params.id) })
      .then(results => {
        console.log(results);
        res.json(results);
    })
  } catch(error) {
    console.error(error);
    res.status(400).send("Error fetching refueler!");
  }
})

// UPDATE refueler
app.put('/refuelers', (req, res) => {
  const dbConnect = dbo.getDb();
  const { _id: refuelerId,  brand, model, registration_number, percent_of_fuel, coordinates} = req.body;
  const updates = {
    $inc: {
      brand,
      model,
      registration_number,
      percent_of_fuel,
      coordinates
    }
  };

  try {
    dbConnect
      .collection("refueler")
      .findOneAndUpdate({ _id: new ObjectId(refuelerId) }, updates).then(() => res.status(204).send());;
  } catch(error) {
    console.error(error);
    res.status(400).send("Error fetching refueler!");
  }


});

// DELETE refueler
app.delete('/refuelers/:id', (req, res) => {
  const dbConnect = dbo.getDb();
  const refuelerId = req.params.id;

  try {
    dbConnect
      .collection("refueler")
      .findOneAndDelete({ _id:  new ObjectId(refuelerId)}).then(() => res.status(204).send());;
  } catch (error) {
    console.error(error);
    res.status(400).send(`Error deleting listing with id ${refuelerId}!`);
  }
});