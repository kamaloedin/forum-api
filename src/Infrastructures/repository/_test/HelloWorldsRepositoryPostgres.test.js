const HelloWorlds = require('../../../Domains/helloWorlds/entities/HelloWorlds');
const HelloWorldsRepositoryPostgres = require('../HelloWorldsRepositoryPostgres');

describe('HelloWorlds Repository', () => {
  describe('sayHello function', () => {
    it('should log hello world script with the specified name', () => {
      const useCasePayload = {
        name: 'Kamal',
      };

      const helloWorlds = new HelloWorlds(useCasePayload);
      const helloWorldsRepositoryPostgres = new HelloWorldsRepositoryPostgres();
      console.log = jest.fn().mockImplementation(() => Promise.resolve());

      helloWorldsRepositoryPostgres.sayHello(helloWorlds);

      expect(console.log).toBeCalledWith('Kamal said Hello World!');
    });
  });
});
