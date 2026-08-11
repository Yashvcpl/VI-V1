"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import type { EntityConfig } from "@/lib/admin/entities";
import { ImageFieldControl } from "@/components/admin/ImageFieldControl";
import { ImageGalleryFieldControl } from "@/components/admin/ImageGalleryFieldControl";
import { ServiceContentBlocksFieldControl } from "@/components/admin/ServiceContentBlocksFieldControl";

type AdminEntityFormConfig = Pick<
  EntityConfig,
  "key" | "label" | "pluralLabel" | "singleton" | "titleField" | "subtitleField" | "fields"
>;

interface Props {
  entity: AdminEntityFormConfig;
  initialValues: Record<string, unknown>;
  /** Undefined when creating a new (non-singleton) row. */
  recordId?: number;
  previewUrl?: string;
  readOnly?: boolean;
}

type SaveStatus = "idle" | "saving" | "error" | "success";

export function AdminEntityForm({ entity, initialValues, recordId, previewUrl, readOnly }: Props) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, unknown>>(initialValues);
  const initialValuesRef = useRef<Record<string, unknown>>(initialValues);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [pickerOpenFor, setPickerOpenFor] = useState<string | null>(null);
  const [mediaAssets, setMediaAssets] = useState<{ id: number; url: string; fileName: string; contentType?: string }[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const isReadOnly = Boolean(readOnly);

  function setField(key: string, value: unknown) {
    if (isReadOnly) return;
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleUpload(fieldKey: string, file: File) {
    setUploadingField(fieldKey);
    setError(null);
    setNotice(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError((data as { error?: string }).error ?? "Upload failed");
        return;
      }
      setField(fieldKey, (data as { url?: string }).url ?? "");
    } catch {
      setError("Upload failed - check your connection.");
    } finally {
      setUploadingField(null);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isReadOnly) return;
    setStatus("saving");
    setError(null);
    setNotice(null);

    const isUpdate = entity.singleton || recordId !== undefined;
    const url = isUpdate ? `/api/admin/${entity.key}/${recordId ?? 1}` : `/api/admin/${entity.key}`;
    const method = isUpdate ? "PATCH" : "POST";

    try {
      const fieldKeys = new Set(entity.fields.map((field) => field.key));
      const payload = Object.fromEntries(
        Object.entries(values).filter(([key]) => fieldKeys.has(key)),
      );

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError((data as { error?: string }).error ?? "Save failed");
        setStatus("error");
        return;
      }

      setStatus("success");
      setNotice(entity.singleton ? "Updated successfully" : "Saved successfully");
      router.refresh();
    } catch {
      setError("Save failed - check your connection.");
      setStatus("error");
    }
  }

  async function handleDelete() {
    if (!recordId) return;

    try {
      const response = await fetch(`/api/admin/${entity.key}/${recordId}`, { method: "DELETE" });
      if (!response.ok) {
        setError("Delete failed");
        return;
      }
      router.push(`/admin/${entity.key}`);
      router.refresh();
    } catch {
      setError("Delete failed - check your connection.");
    }
  }

  function handleCancel() {
    setValues(initialValuesRef.current);
    setError(null);
    setNotice("Changes reverted.");
    setTimeout(() => setNotice(null), 2000);
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}
      {notice ? (
        <div className="rounded-2xl border border-growth/20 bg-growth/10 px-4 py-3 text-sm text-growth-700">{notice}</div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4 rounded-[24px] border border-ledger/10 bg-paper-dim p-4 sm:p-6">
          {entity.fields.map((field) => {
            const value = values[field.key];

            if (field.type === "boolean") {
              return (
                <label key={field.key} className="flex items-center gap-3 rounded-2xl border border-ledger/10 bg-paper px-4 py-3 text-sm text-ledger">
                  <input
                    type="checkbox"
                    checked={Boolean(value)}
                    onChange={(e) => setField(field.key, e.target.checked)}
                    className="h-4 w-4 rounded border-ledger/20"
                  />
                  <span>{field.label}</span>
                </label>
              );
            }

            if (field.type === "image") {
              return <ImageFieldControl key={field.key} field={field} value={typeof value === "string" ? value : ""} onChange={(next) => setField(field.key, next)} />;
            }

            if (field.type === "images") {
              return <ImageGalleryFieldControl key={field.key} field={field} value={value as string | any[]} onChange={(next) => setField(field.key, next)} />;
            }

            if (field.type === "serviceContentBlocks") {
              return <ServiceContentBlocksFieldControl key={field.key} field={field} value={typeof value === "string" ? value : ""} onChange={(next) => setField(field.key, next)} />;
            }

            if (field.type === "textarea" || field.type === "markdown") {
              return (
                <div key={field.key} className="flex flex-col gap-1 rounded-2xl border border-ledger/10 bg-paper p-4">
                  <label htmlFor={field.key} className="text-sm font-medium text-ledger">
                    {field.label} {field.required ? <span className="text-red-700">*</span> : null}
                  </label>
                  {field.type === "markdown" ? <p className="text-xs text-ledger/50">Markdown supported.</p> : null}
                  {field.help ? <p className="text-xs text-ledger/50">{field.help}</p> : null}
                  <textarea
                    id={field.key}
                    required={field.required}
                    rows={field.type === "markdown" ? 10 : 3}
                    value={typeof value === "string" ? value : ""}
                    onChange={(e) => setField(field.key, e.target.value)}
                    readOnly={isReadOnly}
                    className="rounded-2xl border border-ledger/10 bg-paper-dim px-3 py-2.5 font-body shadow-sm"
                  />
                </div>
              );
            }

            if (field.type === "datetime") {
              const rawValue = value;
              const dateValue = typeof rawValue === "string"
                ? rawValue.slice(0, 16)
                : rawValue instanceof Date
                ? rawValue.toISOString().slice(0, 16)
                : "";

              return (
                <div key={field.key} className="flex flex-col gap-1 rounded-2xl border border-ledger/10 bg-paper p-4">
                  <label htmlFor={field.key} className="text-sm font-medium text-ledger">{field.label}</label>
                  <input
                    id={field.key}
                    type="datetime-local"
                    value={dateValue}
                    onChange={(e) => {
                      const nextValue = e.target.value;
                      if (!nextValue) {
                        setField(field.key, null);
                        return;
                      }

                      const parsedDate = new Date(nextValue);
                      if (Number.isNaN(parsedDate.getTime())) {
                        setField(field.key, null);
                        return;
                      }

                      setField(field.key, parsedDate.toISOString());
                    }}
                    readOnly={isReadOnly}
                    className="rounded-2xl border border-ledger/10 bg-paper-dim px-3 py-2.5 shadow-sm"
                  />
                </div>
              );
            }

            return (
              <div key={field.key} className="flex flex-col gap-1 rounded-2xl border border-ledger/10 bg-paper p-4">
                <label htmlFor={field.key} className="text-sm font-medium text-ledger">
                  {field.label} {field.required ? <span className="text-red-700">*</span> : null}
                </label>
                {field.help ? <p className="text-xs text-ledger/50">{field.help}</p> : null}
                {field.key === "resumeUrl" ? (
                  typeof value === "string" && value.trim() ? (
                    <a
                      href={value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-2xl border border-growth/20 bg-growth/10 px-3 py-2.5 text-sm font-medium text-growth-700 hover:bg-growth/20"
                    >
                      View Resume
                    </a>
                  ) : (
                    <p className="rounded-2xl border border-ledger/10 bg-paper-dim px-3 py-2.5 text-sm text-ledger/60">No resume uploaded</p>
                  )
                ) : (
                  <input
                    id={field.key}
                    type={field.type === "number" ? "number" : "text"}
                    required={field.required}
                    value={typeof value === "string" || typeof value === "number" ? value : ""}
                    onChange={(e) => setField(field.key, field.type === "number" ? Number(e.target.value) : e.target.value)}
                    readOnly={isReadOnly}
                    className="rounded-2xl border border-ledger/10 bg-paper-dim px-3 py-2.5 shadow-sm"
                  />
                )}
              </div>
            );
          })}
        </div>

        <aside className="space-y-4 rounded-[24px] border border-ledger/10 bg-paper-dim p-4 sm:p-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-growth-700">Quick actions</p>
            <p className="mt-2 text-sm leading-7 text-ledger/70">Save changes, review the content, or remove the item permanently.</p>
          </div>

          <div className="rounded-2xl border border-ledger/10 bg-paper p-4">
            <p className="text-sm font-semibold text-ledger">Status</p>
            <p className="mt-2 text-sm text-ledger/70">
              {isReadOnly
                ? "Read-only record"
                : status === "success"
                ? "Changes saved"
                : status === "saving"
                ? "Saving changes"
                : "Ready to publish"}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-3">
              {previewUrl ? (
                <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-full border border-growth/20 bg-growth/10 px-4 py-2.5 text-sm font-semibold text-growth-700 transition hover:bg-growth/20">
                  Preview
                </a>
              ) : null}
            </div>
            {!isReadOnly ? (
              <>
                <button type="submit" disabled={status === "saving"} className="inline-flex items-center justify-center rounded-full bg-growth px-4 py-2.5 text-sm font-semibold text-paper transition hover:bg-growth-700 disabled:opacity-60">
                  {status === "saving" ? "Saving…" : "Save changes"}
                </button>
                {!entity.singleton && recordId !== undefined ? (
                  <button type="button" onClick={() => setDeleteConfirmOpen(true)} className="inline-flex items-center justify-center rounded-full border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50">
                    Delete item
                  </button>
                ) : null}
              </>
            ) : null}
          </div>
        </aside>
      </div>

      {deleteConfirmOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ledger/50 p-4">
          <div className="w-full max-w-md rounded-[24px] border border-ledger/10 bg-paper p-6 shadow-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-growth-700">Confirm delete</p>
            <h3 className="mt-3 text-xl font-semibold text-ledger">Delete this {entity.label.toLowerCase()}?</h3>
            <p className="mt-2 text-sm leading-7 text-ledger/70">This action cannot be undone. The current record will be removed immediately.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setDeleteConfirmOpen(false)} className="rounded-full border border-ledger/10 px-4 py-2 text-sm font-medium text-ledger">
                Cancel
              </button>
              <button type="button" onClick={handleDelete} className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-paper">
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </form>
  );
}
