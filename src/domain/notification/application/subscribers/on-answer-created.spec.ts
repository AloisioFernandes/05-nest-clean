import { makeAnswer } from "test/factories/make-answer";
import { makeQuestion } from "test/factories/make-question";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachements-repository";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { waitFor } from "test/utils/wait-for";
import type { MockInstance } from "vitest";
import { SendNotificationUseCase } from "../use-cases/send-notification";
import { OnAnswerCreated } from "./on-answer-created";

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryAnswersAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sendNotificationUseCase: SendNotificationUseCase;

let sendNotificationExecuteSpy: MockInstance;

describe("On Answer Created", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository
    );
    inMemoryAnswersAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswersAttachmentsRepository
    );
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();

    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository
    );

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, "execute");

    new OnAnswerCreated(inMemoryQuestionsRepository, sendNotificationUseCase);
  });

  it("should send a notification when an answer is created", async () => {
    const question = makeQuestion();
    const answer = makeAnswer({ questionId: question.id });

    inMemoryQuestionsRepository.create(question);
    inMemoryAnswersRepository.create(answer);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
