const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadDetails = require('../../../Domains/threads/entities/ThreadDetails');
const GetThreadDetailsUseCase = require('../GetThreadDetailsUseCase');

describe('GetThreadDetailsUseCase', () => {
  it('should orchestrating the get thread details action correctly', async () => {
    const threadId = 'thread-321';

    const mockThread = {
      id: 'thread-321',
      title: 'a thread',
      body: 'a thread body',
      date: expect.any(Date),
      username: 'dicoding',
    };

    const mockComments = [
      {
        id: 'comment-01',
        username: 'john-01',
        date: expect.any(Date),
        content: 'first comment',
      },
      {
        id: 'comment-02',
        username: 'john-02',
        date: expect.any(Date),
        content: 'second comment',
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentsByThreadId = jest.fn().mockImplementation(() => Promise.resolve(mockComments));

    const getThreadDetailsUseCase = new GetThreadDetailsUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const threadDetails = await getThreadDetailsUseCase.execute(threadId);

    expect(threadDetails).toStrictEqual(
      new ThreadDetails({
        id: 'thread-321',
        title: 'a thread',
        body: 'a thread body',
        date: expect.any(Date),
        username: 'dicoding',
        comments: [
          {
            id: 'comment-01',
            username: 'john-01',
            date: expect.any(Date),
            content: 'first comment',
          },
          {
            id: 'comment-02',
            username: 'john-02',
            date: expect.any(Date),
            content: 'second comment',
          },
        ],
      }),
    );
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(threadId);
  });
});
