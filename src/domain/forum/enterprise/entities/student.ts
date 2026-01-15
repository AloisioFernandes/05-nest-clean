import { Entity } from "@/core/entities/entity.js";
import type { UniqueEntityID } from "@/core/entities/unique-entity-id.js";

interface StudentProps {
  name: string;
}

export class Student extends Entity<StudentProps> {
  static create(props: StudentProps, id?: UniqueEntityID) {
    const student = new Student(props, id);

    return student;
  }
}
