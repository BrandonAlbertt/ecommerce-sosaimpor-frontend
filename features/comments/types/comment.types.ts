export type CreateCommentBody = {
  texto: string;
};

export type CommentApiItem = {
  id: number;
  texto: string;
  creado_en: string;
};

export type CreateCommentResponse = {
  ok: true;
  data: {
    message: string;
    comentario: CommentApiItem;
  };
  pagination: null;
};

export type CommentSubmitState = {
  comment: CommentApiItem | null;
  error: string | null;
  isSubmitting: boolean;
  successMessage: string | null;
};
