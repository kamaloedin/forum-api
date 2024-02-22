const ToggleCommentLikeUseCase = require('../ToggleCommentLikeUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentLikes = require('../../../Domains/comments/entities/CommentLikes');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('ToggleCommentLikeUseCase', () => {
  it('should orchestrating the toggle comment like action correctly if comment likes does not exist yet', async () => {
    const useCasePayload = {
      userId: 'user-123',
      commentId: 'comment-123',
      threadId: 'thread-321',
    };

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockCommentRepository.findCommentById = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadRepository.findThreadById = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.findCommentLike = jest.fn().mockImplementation(() => Promise.resolve(undefined));
    mockCommentRepository.deleteCommentLike = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.addCommentLike = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.updateLikeCount = jest.fn().mockImplementation(() => Promise.resolve());

    const toggleCommentLikeUseCase = new ToggleCommentLikeUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await toggleCommentLikeUseCase.execute(useCasePayload);

    expect(mockCommentRepository.findCommentById).toBeCalledWith(useCasePayload.commentId);
    expect(mockThreadRepository.findThreadById).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.updateLikeCount).toBeCalledWith(useCasePayload.commentId, false);
    expect(mockCommentRepository.findCommentLike).toBeCalledWith(
      new CommentLikes({
        userId: useCasePayload.userId,
        commentId: useCasePayload.commentId,
      }),
    );
    expect(mockCommentRepository.addCommentLike).toBeCalledWith(
      new CommentLikes({
        userId: useCasePayload.userId,
        commentId: useCasePayload.commentId,
      }),
    );
  });
  it('should orchestrating the toggle comment like action correctly if comment likes already exist', async () => {
    const useCasePayload = {
      userId: 'user-123',
      commentId: 'comment-123',
    };

    const mockCommentLikeId = 'comment_like-123';

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockCommentRepository.findCommentById = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadRepository.findThreadById = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.findCommentLike = jest.fn().mockImplementation(() => Promise.resolve(mockCommentLikeId));
    mockCommentRepository.deleteCommentLike = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.addCommentLike = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.updateLikeCount = jest.fn().mockImplementation(() => Promise.resolve());

    const toggleCommentLikeUseCase = new ToggleCommentLikeUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await toggleCommentLikeUseCase.execute(useCasePayload);

    expect(mockCommentRepository.findCommentById).toBeCalledWith(useCasePayload.commentId);
    expect(mockThreadRepository.findThreadById).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.updateLikeCount).toBeCalledWith(useCasePayload.commentId, true);
    expect(mockCommentRepository.findCommentLike).toBeCalledWith(
      new CommentLikes({
        userId: useCasePayload.userId,
        commentId: useCasePayload.commentId,
      }),
    );
    expect(mockCommentRepository.deleteCommentLike).toBeCalledWith(
      new CommentLikes({
        userId: useCasePayload.userId,
        commentId: useCasePayload.commentId,
      }),
    );
  });
});
