const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CreatedReply = require('../../../Domains/replies/entities/CreatedReply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const AddReplyUseCase = require('../AddReplyUseCase');
const CreateReply = require('../../../Domains/replies/entities/CreateReply');

describe('AddReplyUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    const useCasePayload = {
      content: 'this is a reply',
      owner: 'user-123',
      commentId: 'comment-321',
      threadId: 'thread-321',
    };
    const mockCreatedReply = new CreatedReply({
      id: 'reply-321',
      content: 'this is a reply',
      owner: 'user-123',
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.findThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.findCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.addReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockCreatedReply));

    const addReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const createdReply = await addReplyUseCase.execute(useCasePayload);

    expect(createdReply).toStrictEqual(
      new CreatedReply({
        id: 'reply-321',
        content: 'this is a reply',
        owner: 'user-123',
      }),
    );
    expect(mockThreadRepository.findThreadById).toBeCalledWith(
      useCasePayload.threadId,
    );
    expect(mockCommentRepository.findCommentById).toBeCalledWith(
      useCasePayload.commentId,
    );
    expect(mockReplyRepository.addReply).toBeCalledWith(
      new CreateReply({
        content: useCasePayload.content,
        owner: useCasePayload.owner,
        commentId: useCasePayload.commentId,
        threadId: useCasePayload.threadId,
      }),
    );
  });
});
