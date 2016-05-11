"use strict";

const amqp = require(`amqplib`);


class RabbitBroker {

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
        })
        // Asserting the direct exchange
        .then(() => {
          return this.channel.assertExchange(this.params.exchange, `direct`, {durable: false});
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

  send (routingKey, message) {
    console.log(`Broker sending message: ${message}`);
    return new Promise((resolve, reject) => {
      try {
        this.channel.publish(this.params.exchange, routingKey, new Buffer(message));
        resolve();
      }
      catch (err) {
        reject(err);
      }
    });
  }

}

module.exports = RabbitBroker;