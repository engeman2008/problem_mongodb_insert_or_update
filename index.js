import express from "express";
import mongoConnect, { getDb } from "./database.js";

const app = express();
app.use(express.json());

const user_id = 999;
const items = [
  {
    name: "item1",
    price: 50,
  },
  {
    name: "item2",
    price: 20,
  },
];
app.post("/add", (req, res, next) => {
  const db = getDb();

  let total_amount = items.reduce((accum, curr) => accum + curr.price, 0);

  const basket = {
    user_id: user_id,
    total_amount: total_amount,
    version: 1,
    created_at: Math.floor(Date.now() / 1000),
    items: items,
  };
  try {
    const doc = db
      .collection("basket")
      .insertOne(basket, { writeConcern: basket });
    return res.status(201).send();
  } catch (error) {
    console.log(error);
  }
});
app.post("/update", (req, res, next) => {
  const db = getDb();

  const query = { user_id: user_id };
  const new_items = [
    {
      name: "item3",
      price: 10,
    },
    {
      name: "item4",
      price: 15,
    },
  ];
  let total_amount = new_items.reduce((accum, curr) => accum + curr.price, 0);
  const update = {
    $push: { items: new_items },
    $inc: { total_amount: total_amount, version: 1 },
    $setOnInsert: {
      _id: "123",
      created_at: Math.floor(Date.now() / 1000),
    },
  };
  const options = { upsert: true };
  db.collection("basket").updateOne(query, update, options);
  return res.status(201).send();
});

mongoConnect(() => {
  app.listen(3000, () => {
    console.log("started");
  });
});
