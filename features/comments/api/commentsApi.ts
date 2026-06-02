import { axiosClient } from "@/lib/axiosClient";

import type { CreateCommentBody, CreateCommentResponse } from "../types/comment.types";

const commentsPath = "/api/comentarios";

export function createComment(body: CreateCommentBody, signal?: AbortSignal) {
  return axiosClient.post<CreateCommentResponse, CreateCommentBody>(commentsPath, body, {
    signal,
  });
}
