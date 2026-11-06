import { API } from "../data";
import type { Course, CoursePayload } from "./type";

export async function createCourse(
  payload: CoursePayload,
  accessToken?: string,
): Promise<Course> {
  const response = await API.post<Course>("/api/academico/courses/", payload, {
    accessToken,
  });

  return response.data;
}
