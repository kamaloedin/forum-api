const HelloWorldsRepository = require('../HelloWorldsRepository');

describe('HelloWorldsRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    const helloWorldsRepository = new HelloWorldsRepository();

    await expect(helloWorldsRepository.sayHello({})).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
