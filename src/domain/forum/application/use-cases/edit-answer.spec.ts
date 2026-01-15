import { UniqueEntityID } from "@/core/entities/unique-entity-id.js";
import { makeAnswerAttachment } from "test/factories/make-answer-attachment.js";
import { makeAnswer } from "test/factories/make-answer.js";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachements-repository.js";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository.js";
import { NotAllowedError } from "../../../../core/errors/errors/not-allowed-error.js";
import { EditAnswerUseCase } from "./edit-answer.js";

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: EditAnswerUseCase;

describe("Edit Answer", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository
    );

    sut = new EditAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerAttachmentsRepository
    );
  });

  it("should be able to edit a answer", async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID("author-1"),
      },
      new UniqueEntityID("answer-1")
    );

    await inMemoryAnswersRepository.create(newAnswer);

    inMemoryAnswerAttachmentsRepository.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID("1"),
      }),
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID("2"),
      })
    );

    await sut.execute({
      authorId: "author-1",
      answerId: newAnswer.id.toValue(),
      content: "Edited Answer Content",
      attachmentsIds: ["1", "3"],
    });

    expect(inMemoryAnswersRepository.items[0]).toMatchObject({
      content: "Edited Answer Content",
    });

    expect(
      inMemoryAnswersRepository?.items[0]?.attachments.currentItems
    ).toHaveLength(2);
    expect(
      inMemoryAnswersRepository?.items[0]?.attachments.currentItems
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID("1") }),
      expect.objectContaining({ attachmentId: new UniqueEntityID("3") }),
    ]);
  });

  it("should not be able to edit a answer from another user", async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID("author-1"),
      },
      new UniqueEntityID("answer-1")
    );

    await inMemoryAnswersRepository.create(newAnswer);

    const result = await sut.execute({
      authorId: "author-2",
      answerId: newAnswer.id.toValue(),
      content: "Edited Answer Content",
      attachmentsIds: [],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
