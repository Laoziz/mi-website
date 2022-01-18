'use strict';

const Service = require('egg').Service;

class CacheService extends Service {
  async set(key, value, seconds) {
    value = JSON.stringify(value);
    if (this.app.redis) {
      console.log('redis set ', key);
      if (!seconds) {
        await this.app.redis.set(key, value);
      } else {
        await this.app.redis.set(key, value, 'EX', seconds);
      }
    }
  }

  async get(key) {
    if (this.app.redis) {
      console.log('redis get', key);
      let data = await this.app.redis.get(key);
      if (data) {
        try {
          data = JSON.parse(data);
          return data;
        } catch (err) {
          console.log(err);
        }
      }
    }
  }
}

module.exports = CacheService;
