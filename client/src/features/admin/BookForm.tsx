import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { BookSearchResult, Book } from "../../../../shared/src/schemas";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { BookCover } from "../../components/ui/BookCover";
import { fieldClass, labelClass } from "../../components/ui/fieldStyles";

const FormSchema = z.object({
  title: z.string().min(1, "Title required"),
  author: z.string().min(1, "Author required"),
  genre: z.string().min(1, "Genre required"),
  pages: z.coerce.number().int().positive("Must be positive"),
  rating: z.union([z.coerce.number().min(0).max(5), z.literal("")]).optional(),
  dateFinished: z.string().optional(),
  coverUrl: z.string().optional(),
  description: z.string().optional(),
  publishedYear: z.union([z.coerce.number().int(), z.literal("")]).optional(),
  isbn: z.string().optional(),
});

type FormValues = z.infer<typeof FormSchema>;

interface BookFormProps {
  prefill?: Partial<BookSearchResult>;
  existingBook?: Book;
  onSubmit: (data: FormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function BookForm({ prefill, existingBook, onSubmit, onCancel, isSubmitting }: BookFormProps) {
  const defaultValues: Partial<FormValues> = {
    title: existingBook?.title ?? prefill?.title ?? "",
    author: existingBook?.author ?? prefill?.author ?? "",
    genre: existingBook?.genre ?? prefill?.genre ?? "",
    pages: existingBook?.pages ?? prefill?.pages ?? undefined,
    rating: existingBook?.rating ?? undefined,
    dateFinished: existingBook?.dateFinished
      ? new Date(existingBook.dateFinished).toISOString().slice(0, 10)
      : "",
    coverUrl: existingBook?.coverUrl ?? prefill?.coverUrl ?? "",
    description: existingBook?.description ?? prefill?.description ?? "",
    publishedYear: existingBook?.publishedYear ?? prefill?.publishedYear ?? undefined,
    isbn: existingBook?.isbn ?? prefill?.isbn ?? "",
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormValues>({
    resolver: zodResolver(FormSchema) as any,
    defaultValues,
  });

  const coverUrlValue = watch("coverUrl");
  const titleValue = watch("title");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex gap-4">
        <BookCover coverUrl={coverUrlValue || null} title={titleValue || "Untitled"} className="w-24 self-start" sizes="96px" />
        <div className="flex-1 flex flex-col gap-3">
          <Input label="Title" error={errors.title?.message} {...register("title")} />
          <Input label="Author" error={errors.author?.message} {...register("author")} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input label="Genre" error={errors.genre?.message} {...register("genre")} />
        <Input label="Pages" type="number" error={errors.pages?.message} {...register("pages")} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input label="Rating (0–5)" type="number" step="0.1" {...register("rating")} placeholder="4.5" />
        <Input label="Date Finished" type="date" {...register("dateFinished")} />
      </div>

      <Input label="Cover Image URL" {...register("coverUrl")} placeholder="https://..." />

      <div className="grid grid-cols-2 gap-3">
        <Input label="Published Year" type="number" {...register("publishedYear")} />
        <Input label="ISBN" {...register("isbn")} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="book-description" className={labelClass}>
          Description
        </label>
        <textarea
          id="book-description"
          {...register("description")}
          rows={3}
          className={`${fieldClass} resize-none`}
          placeholder="Brief description…"
        />
      </div>

      <div className="flex gap-3 border-t border-border pt-4">
        <Button type="submit" variant="primary" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? "Saving…" : existingBook ? "Update Book" : "Save to Library"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
