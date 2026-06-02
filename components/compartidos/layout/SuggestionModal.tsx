"use client";

import { useEffect } from "react";
import { Lightbulb, Send, X } from "lucide-react";

import {
  commentValidationRules,
  getCommentStats,
  validateCommentText,
} from "@/features/comments/utils/commentValidation";

type SuggestionModalProps = {
  error?: string | null;
  isSubmitting?: boolean;
  message: string;
  onChangeMessage: (message: string) => void;
  onClose: () => void;
  onSubmit: () => Promise<void> | void;
  open: boolean;
  successMessage?: string | null;
};

export function SuggestionModal({
  error = null,
  isSubmitting = false,
  message,
  onChangeMessage,
  onClose,
  onSubmit,
  open,
  successMessage = null,
}: SuggestionModalProps) {
  const { wordCount } = getCommentStats(message);
  const validation = validateCommentText(message);
  const isWithinWordLimit = wordCount <= commentValidationRules.maxWords;
  const canSubmit = validation.isValid && !isSubmitting;

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);

  useEffect(() => {
    if (!open || !successMessage) {
      return;
    }

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    const closeTimer = window.setTimeout(onClose, 3000);

    return () => window.clearTimeout(closeTimer);
  }, [onClose, open, successMessage]);

  if (!open) {
    return null;
  }

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-[95] flex items-center justify-center bg-zinc-950/60 px-4 py-6 backdrop-blur-sm"
      role="dialog"
    >
      <button
        aria-label="Cerrar sugerencia"
        className="absolute inset-0 h-full w-full cursor-default"
        onClick={onClose}
        type="button"
      />

      <section className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-2xl dark:border-amber-900 dark:bg-zinc-900">
        <div className="flex items-start justify-between gap-4 border-b border-amber-100 bg-amber-50/80 p-5 dark:border-amber-900 dark:bg-amber-950/30">
          <div className="flex min-w-0 gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-zinc-950 shadow-sm dark:bg-amber-500">
              <Lightbulb size={22} suppressHydrationWarning />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-black uppercase text-amber-700 dark:text-amber-300">
                Sugerencia
              </p>
              <h2 className="mt-1 text-xl font-black leading-tight text-zinc-950 dark:text-zinc-100">
                Cuentanos que quieres mejorar
              </h2>
            </div>
          </div>
          <button
            aria-label="Cerrar modal de sugerencia"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-amber-200 bg-white text-zinc-700 transition-colors hover:border-amber-400 hover:text-zinc-950 dark:border-amber-900 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-100"
            onClick={onClose}
            type="button"
          >
            <X size={18} suppressHydrationWarning />
          </button>
        </div>

        <div className="space-y-4 p-5">
          {successMessage && (
            <p className="flex min-h-36 items-center justify-center rounded-xl border border-green-200 bg-green-50 px-5 py-6 text-center text-base font-black leading-relaxed text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300">
              {successMessage}
            </p>
          )}

          {!successMessage && (
            <>
              <textarea
                autoFocus
                className="min-h-36 w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold leading-relaxed text-zinc-800 outline-none transition-colors placeholder:text-zinc-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-amber-700 dark:focus:ring-amber-950"
                disabled={isSubmitting}
                maxLength={700}
                onChange={(event) => onChangeMessage(event.target.value)}
                placeholder="Escribe tu sugerencia o que te gustaria mejorar..."
                value={message}
              />

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-zinc-500 dark:text-zinc-400">
                <span>
                  Minimo {commentValidationRules.minWords} palabras y {commentValidationRules.minCharacters} caracteres.
                </span>
                <span className={isWithinWordLimit ? "" : "text-red-600 dark:text-red-400"}>
                  {wordCount}/{commentValidationRules.maxWords} palabras
                </span>
              </div>

              {message.trim() && validation.error && (
                <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
                  {validation.error}
                </p>
              )}
            </>
          )}

          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
              {error}
            </p>
          )}

          {!successMessage && (
            <button
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 text-sm font-black text-white shadow-sm transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-amber-500 dark:text-zinc-950 dark:hover:bg-amber-400"
              disabled={!canSubmit}
              onClick={onSubmit}
              type="button"
            >
              <Send size={17} suppressHydrationWarning />
              {isSubmitting ? "Enviando..." : "Enviar sugerencia"}
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
