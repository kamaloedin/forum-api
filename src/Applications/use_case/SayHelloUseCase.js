const HelloWorlds = require('../../Domains/helloWorlds/entities/HelloWorlds');

class SayHelloUseCase {
  constructor({ helloWorldsRepository }) {
    this._helloWorldsRepository = helloWorldsRepository;
  }

  async execute(useCasePayload) {
    const helloWorlds = new HelloWorlds(useCasePayload);
    await this._helloWorldsRepository.sayHello(helloWorlds);
  }
}

module.exports = SayHelloUseCase;
