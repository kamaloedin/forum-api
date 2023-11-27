const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CreateComment = require('../../../Domains/comments/entities/CreateComment');
const CreatedComment = require('../../../Domains/comments/entities/CreatedComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    const useCasePayload = {
      content: 'this is a comment',
      owner: 'user-123',
      threadId: 'thread-321',
    };
    const mockCreatedComment = new CreatedComment({
      id: 'comment-_pby2_tmXV6bcvcdev8xk',
      content: 'this is a comment',
      owner: 'user-123',
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.findThreadById = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn().mockImplementation(() => Promise.resolve(mockCreatedComment));

    const getCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const createdComment = await getCommentUseCase.execute(useCasePayload);

    expect(createdComment).toStrictEqual(
      new CreatedComment({
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        content: 'this is a comment',
        owner: 'user-123',
      }),
    );
    expect(mockThreadRepository.findThreadById).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.addComment).toBeCalledWith(
      new CreateComment({
        content: useCasePayload.content,
        owner: useCasePayload.owner,
        threadId: useCasePayload.threadId,
      }),
    );
  });
});
