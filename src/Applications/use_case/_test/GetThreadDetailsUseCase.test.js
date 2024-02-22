const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
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
        is_delete: false,
        like_count: 1,
      },
      {
        id: 'comment-02',
        username: 'john-02',
        date: expect.any(Date),
        content: 'second comment',
        is_delete: true,
        like_count: 0,
      },
    ];

    const mockReplies = [
      {
        id: 'reply-01',
        username: 'john-01',
        date: expect.any(Date),
        content: 'first reply',
        is_delete: false,
        comment_id: 'comment-01',
      },
      {
        id: 'reply-02',
        username: 'john-02',
        date: expect.any(Date),
        content: 'second reply',
        is_delete: true,
        comment_id: 'comment-02',
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentsByThreadId = jest.fn().mockImplementation(() => Promise.resolve(mockComments));
    mockReplyRepository.getRepliesByThreadId = jest.fn().mockImplementation(() => Promise.resolve(mockReplies));

    const getThreadDetailsUseCase = new GetThreadDetailsUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const threadDetails = await getThreadDetailsUseCase.execute(threadId);

    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(threadId);
    expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(threadId);
    expect(threadDetails).toStrictEqual({
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
          likeCount: 1,
          replies: [
            {
              id: 'reply-01',
              username: 'john-01',
              date: expect.any(Date),
              content: 'first reply',
            },
          ],
        },
        {
          id: 'comment-02',
          username: 'john-02',
          date: expect.any(Date),
          content: '**komentar telah dihapus**',
          likeCount: 0,
          replies: [
            {
              id: 'reply-02',
              username: 'john-02',
              date: expect.any(Date),
              content: '**balasan telah dihapus**',
            },
          ],
        },
      ],
    });
  });
});
