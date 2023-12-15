const HelloWorldsRepository = require('../../../Domains/helloWorlds/HelloWorldsRepository');
const SayHelloUseCase = require('../SayHelloUseCase');

describe('SayHelloUseCase', () => {
  it('should orchestrate the say hello action correctly', async () => {
    const useCasePayload = {
      name: 'Kamal',
    };

    const mockHelloWorldsRepository = new HelloWorldsRepository();

    mockHelloWorldsRepository.sayHello = jest.fn().mockImplementation(() => Promise.resolve());

    const sayHelloUseCase = new SayHelloUseCase({
      helloWorldsRepository: mockHelloWorldsRepository,
    });

    await sayHelloUseCase.execute(useCasePayload);

    expect(mockHelloWorldsRepository.sayHello).toBeCalledWith(useCasePayload);
  });
});
