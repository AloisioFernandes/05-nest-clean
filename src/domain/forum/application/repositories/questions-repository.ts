import type { PaginationParams } from "@/core/repositories/pagination-params.js";
import type { Question } from "../../enterprise/entities/question.js";

export interface QuestionsRepository {
  findById(id: string): Promise<Question | null>;
  findBySlug(slug: string): Promise<Question | null>;
  findManyRecent(params: PaginationParams): Promise<Question[]>;
  create(question: Question): Promise<void>;
  delete(question: Question): Promise<void>;
  save(question: Question): Promise<void>;
}
