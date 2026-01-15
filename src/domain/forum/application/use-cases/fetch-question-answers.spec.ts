import { UniqueEntityID } from "@/core/entities/unique-entity-id.js";
import { makeAnswer } from "test/factories/make-answer.js";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachements-repository.js";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository.js";
import { FetchQuestionAnswersUseCase } from "./fetch-question-answers.js";

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: FetchQuestionAnswersUseCase;

describe("Fetch Question Answers", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository
    );
    sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository);
  });

  it("should be able to fetch question answers", async () => {
    await inMemoryAnswersRepository.create(
      makeAnswer({ questionId: new UniqueEntityID("question-1") })
    );
    await inMemoryAnswersRepository.create(
      makeAnswer({ questionId: new UniqueEntityID("question-1") })
    );
    await inMemoryAnswersRepository.create(
      makeAnswer({ questionId: new UniqueEntityID("question-1") })
    );

    const result = await sut.execute({
      questionId: "question-1",
      page: 1,
    });

    expect(result.value?.answers).toHaveLength(3);
  });

  it("should be able to fetch paginated question answers", async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswersRepository.create(
        makeAnswer({ questionId: new UniqueEntityID("question-1") })
      );
    }

    const result = await sut.execute({
      questionId: "question-1",
      page: 2,
    });

    expect(result.value?.answers).toHaveLength(2);
  });
});
