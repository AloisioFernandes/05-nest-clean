import { Entity } from "@/core/entities/entity.js";
import type { UniqueEntityID } from "@/core/entities/unique-entity-id.js";
import type { Optional } from "@/core/types/optional.js";

export interface AnswerCommentProps {
  authorId: UniqueEntityID;
  answerId: UniqueEntityID;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class AnswerComment extends Entity<AnswerCommentProps> {
  get authorId() {
    return this.props.authorId;
  }

  get answerId() {
    return this.props.answerId;
  }

  get content() {
    return this.props.content;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  set content(content: string) {
    this.props.content = content;
    this.touch();
  }

  static create(
    props: Optional<AnswerCommentProps, "createdAt">,
    id?: UniqueEntityID
  ) {
    const answerComment = new AnswerComment(
      { ...props, createdAt: props.createdAt ?? new Date() },
      id
    );

    return answerComment;
  }
}
