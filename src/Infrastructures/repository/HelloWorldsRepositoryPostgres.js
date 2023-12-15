const HelloWorldsRepository = require('../../Domains/helloWorlds/HelloWorldsRepository');

class HelloWorldsRepositoryPostgres extends HelloWorldsRepository {
  sayHello({ name }) {
    console.log(`${name} said Hello World!`);
  }
}

module.exports = HelloWorldsRepositoryPostgres;
