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
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    };

    const mockComments = [
      {
        id: 'comment-01',
        username: 'john-01',
        date: '2021-08-08T07:22:33.555Z',
        content: 'first comment',
      },
      {
        id: 'comment-02',
        username: 'john-02',
        date: '2021-08-08T07:26:21.338Z',
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
        date: '2021-08-08T07:19:09.775Z',
        username: 'dicoding',
        comments: [
          {
            id: 'comment-01',
            username: 'john-01',
            date: '2021-08-08T07:22:33.555Z',
            content: 'first comment',
          },
          {
            id: 'comment-02',
            username: 'john-02',
            date: '2021-08-08T07:26:21.338Z',
            content: 'second comment',
          },
        ],
      }),
    );
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(threadId);
  });
});
