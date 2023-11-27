const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const useCasePayload = {
      threadId: 'thread-321',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    mockCommentRepository.deleteComment = jest.fn().mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await deleteCommentUseCase.execute(useCasePayload);

    expect(mockThreadRepository.findThreadById).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentAccess).toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
    expect(mockCommentRepository.deleteComment).toBeCalledWith(useCasePayload.owner);
  });
});