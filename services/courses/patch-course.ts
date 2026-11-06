import { API } from "../data";
import type { Course, CoursePayload } from "./type";

export async function patchCourse(
  id: string,
  payload: Partial<CoursePayload>,
  accessToken?: string,
): Promise<Course> {
  const response = await API.patch<Course>(
    `/api/academico/courses/${encodeURIComponent(id)}/`,
    payload,
    { accessToken },
  );

  return response.data;
}
