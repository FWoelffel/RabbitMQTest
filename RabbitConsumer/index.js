"use strict";

const amqp = require(`amqplib`);


class RabbitConsumer {

  constructor (params) {
    // TODO Check parameters
    this.params = params;
  }

  /**
   *
   * @returns {Promise}
   */
  initialize () {
    return new Promise((resolve, reject) => {
      // Creating the connection
      amqp.connect(this.params.url)
        // Setting the connection attribute
        .then((connection) => {
          this.connection = connection;
        })
        // Creating the channel
        .then(() => {
          return this.connection.createChannel();
        })
        // Setting the channel attribute
        .then((channel) => {
          this.channel = channel;
          this.channel.prefetch(1);
        })
        // Asserting the exchange
        .then(() => {
          return this.channel.assertExchange(this.params.exchange, `direct`, {durable: false});
        })
        // Asserting the queue (same name as the routing key, could be anything else)
        .then(() => {
          return this.channel.assertQueue(this.params.routingKey);
        })
        // Setting the queue attribute
        .then((queue) => {
          this.queue = queue;
        })
        // Binding the queue
        .then(() => {
          return this.channel.bindQueue(this.queue.queue, this.params.exchange, this.params.routingKey);
        })
        .then(resolve)
        .catch(reject);

    });
  }

  /**
   *
   * @returns {Object}
   */
  get params () {
    return this._params || {};
  }

  /**
   *
   * @param {Object} params
   */
  set params (params) {
    this._params = params || {};
  }

  /**
   *
   * @returns {Object}
   */
  get connection () {
    return this._connection;
  }

  /**
   *
   * @param {Object} connection
   */
  set connection (connection) {
    this._connection = connection;
  }

  /**
   *
   * @returns {Object}
   */
  get channel () {
    return this._channel;
  }

  /**
   *
   * @param {Object} channel
   */
  set channel (channel) {
    this._channel = channel;
  }

  /**
   *
   * @returns {Object}
   */
  get queue () {
    return this._queue;
  }

  /**
   *
   * @param {Object} queue
   */
  set queue (queue) {
    this._queue = queue;
  }

  listen(fn) {
    this.channel.consume(this.queue.queue, (msg) => {
      fn(msg);
    }, {noAck: true});
  }

}

module.exports = RabbitConsumer;