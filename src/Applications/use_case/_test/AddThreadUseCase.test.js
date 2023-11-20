const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');
const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    const useCasePayload = {
      title: 'Dicoding',
      body: 'Dicoding is the best!',
      owner: 'user-123',
    };
    const mockCreatedThread = new CreatedThread({
      id: 'thread-h_W1Plfpj0TY7wyT2PUPX',
      title: 'Dicoding',
      owner: 'user-123',
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThread = jest.fn().mockImplementation(() => Promise.resolve(mockCreatedThread));

    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const createdThread = await getThreadUseCase.execute(useCasePayload);

    expect(createdThread).toStrictEqual(
      new CreatedThread({
        id: 'thread-h_W1Plfpj0TY7wyT2PUPX',
        title: 'Dicoding',
        owner: 'user-123',
      }),
    );
    expect(mockThreadRepository.addThread).toBeCalledWith(
      new CreateThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
        owner: useCasePayload.owner,
      }),
    );
  });
});
