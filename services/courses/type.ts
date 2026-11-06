import type { Paginated } from "../data";

export type Course = {
  id: string;
  nome: string;
};

export type CourseListParams = {
  page?: number;
};

export type CoursePayload = {
  nome: string;
};

export type PaginatedCourses = Paginated<Course>;
