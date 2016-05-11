"use strict";

const RabbitBroker = require(`./RabbitBroker`);
const RabbitConsumer = require(`./RabbitConsumer`);
const sleep = require(`sleep`);

const URL = `amqp://192.168.99.100:32769`;

const broker = new RabbitBroker({
  url: URL,
  exchange: `storage-jobs`
});

const consumer1 = new RabbitConsumer({
  url: URL,
  exchange: `storage-jobs`,
  routingKey: `1`
});

const consumer2 = new RabbitConsumer({
  url: URL,
  exchange: `storage-jobs`,
  routingKey: `2`
});
const consumer2bis = new RabbitConsumer({
  url: URL,
  exchange: `storage-jobs`,
  routingKey: `2`
});


broker.initialize()
.then(() => {
  console.log(`Broker initialized.`);
})
.then(() => {
  return consumer1.initialize();
})
.then(() => {
  console.log(`Consumer1 initialized.`);
})
.then(() => {
  return consumer2.initialize();
})
.then(() => {
  console.log(`Consumer2 initialized.`);
})
.then(() => {
  return consumer2bis.initialize();
})
.then(() => {
  console.log(`Consumer2bis initialized.`);
})
.then(() => {
  return consumer1.listen(function(msg) {
    console.log(`Consumer 1 got message: ${msg.content.toString()}`);
  });
})
.then(() => {
  return consumer2.listen(function(msg) {
    console.log(`Consumer 2 got message: ${msg.content.toString()}`);
  });
})
.then(() => {
  return consumer2.listen(function(msg) {
    console.log(`Consumer 2bis got message: ${msg.content.toString()}`);
  });
})
.then(() => {
  console.log(`Everything is ready.`);
})
.then(() => {
  for (let i = 0; i < 99999; i++) {
    const random1 = Math.floor(Math.random() * 2) + 1;
    const random2 = Math.floor(Math.random() * 2000) + 100;
    broker.send(`${random1}`, `COUCOU${random1}`);
    sleep.usleep(random2);
  }
})
.catch((err) => {
  console.error(err);
});