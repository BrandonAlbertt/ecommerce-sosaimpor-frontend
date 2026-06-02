"use client";

import { useCallback, useRef, useState } from "react";

import { createComment } from "../api/commentsApi";
import type { CommentSubmitState } from "../types/comment.types";
import { validateCommentText } from "../utils/commentValidation";

const initialState: CommentSubmitState = {
  comment: null,
  error: null,
  isSubmitting: false,
  successMessage: null,
};

export function useComment() {
  const [state, setState] = useState<CommentSubmitState>(initialState);
  const abortControllerRef = useRef<AbortController | null>(null);

  const resetCommentState = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setState(initialState);
  }, []);

  const submitComment = useCallback(async (texto: string) => {
    const cleanText = texto.trim();
    const validation = validateCommentText(cleanText);

    if (!validation.isValid) {
      setState({
        comment: null,
        error: validation.error,
        isSubmitting: false,
        successMessage: null,
      });

      return null;
    }

    abortControllerRef.current?.abort();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setState((currentState) => ({
      ...currentState,
      error: null,
      isSubmitting: true,
      successMessage: null,
    }));

    try {
      const response = await createComment({ texto: cleanText }, controller.signal);

      setState({
        comment: response.data.comentario,
        error: null,
        isSubmitting: false,
        successMessage: response.data.message,
      });

      return response;
    } catch (error: unknown) {
      if (controller.signal.aborted) {
        return null;
      }

      setState({
        comment: null,
        error: error instanceof Error ? error.message : "No se pudo registrar el comentario.",
        isSubmitting: false,
        successMessage: null,
      });

      return null;
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  }, []);

  return {
    ...state,
    resetCommentState,
    submitComment,
  };
}
