"use client";

import { useRef, useState } from "react";
import type { FieldConfig } from "@/lib/admin/entities";
import { ImageFieldControl } from "@/components/admin/ImageFieldControl";

interface Props {
  fields: FieldConfig[];
  initialData: Record<string, unknown>;
  onSave: (data: Record<string, unknown>) => void;
}

export function SectionFieldsEditor({ fields, initialData, onSave }: Props) {
  const [values, setValues] = useState<Record<string, unknown>>(initialData);
  const initialDataRef = useRef<Record<string, unknown>>(initialData);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function setField(key: string, value: unknown) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleUpload(fieldKey: string, file: File) {
    setUploadingField(fieldKey);
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const data = await response.json();
    if (response.ok) setField(fieldKey, data.url);
    setUploadingField(null);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    onSave(values);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  function handleCancel() {
    setValues(initialDataRef.current);
    setSaved(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {fields.map((field) => {
        const value = values[field.key];

        if (field.type === "boolean") {
          return (
            <label key={field.key} className="flex items-center gap-2 font-body text-sm text-ledger">
              <input type="checkbox" checked={Boolean(value)} onChange={(e) => setField(field.key, e.target.checked)} />
              {field.label}
            </label>
          );
        }

        if (field.type === "image") {
          return <ImageFieldControl key={field.key} field={field} value={typeof value === "string" ? value : ""} onChange={(next) => setField(field.key, next)} />;
        }

        if (field.type === "textarea" || field.type === "markdown") {
          return (
            <div key={field.key} className="flex flex-col gap-1">
              <label className="font-body text-sm font-medium text-ledger">
                {field.label} {field.required && <span className="text-red-700">*</span>}
              </label>
              {field.help && <p className="font-body text-xs text-ledger/50">{field.help}</p>}
              <textarea
                required={field.required}
                rows={field.type === "markdown" ? 8 : 4}
                value={typeof value === "string" ? value : ""}
                onChange={(e) => setField(field.key, e.target.value)}
                className="rounded-card border border-ledger/20 px-3 py-2 font-body"
              />
            </div>
          );
        }

        return (
          <div key={field.key} className="flex flex-col gap-1">
            <label className="font-body text-sm font-medium text-ledger">
              {field.label} {field.required && <span className="text-red-700">*</span>}
            </label>
            {field.help && <p className="font-body text-xs text-ledger/50">{field.help}</p>}
            <input
              type={field.type === "number" ? "number" : "text"}
              required={field.required}
              value={typeof value === "string" || typeof value === "number" ? value : ""}
              onChange={(e) => setField(field.key, field.type === "number" ? Number(e.target.value) : e.target.value)}
              className="rounded-card border border-ledger/20 px-3 py-2"
            />
          </div>
        );
      })}

      <div className="flex flex-wrap gap-3">
        <button type="submit" className="btn-primary self-start">{saved ? "Saved" : "Save Section"}</button>
        <button type="button" onClick={handleCancel} className="rounded-full border border-ledger/10 bg-paper px-4 py-2.5 text-sm font-semibold text-ledger transition hover:bg-paper/90">
          Cancel
        </button>
      </div>
    </form>
  );
}
