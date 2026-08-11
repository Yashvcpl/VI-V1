"use client";

import { useState, useRef } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { PageSection } from "@/lib/db/schema";
import type { SerializablePage } from "@/lib/pagebuilder/getPage";
import { sectionTypes, type SectionTypeConfig } from "@/lib/pagebuilder/sectionTypes";
import { SectionFieldsEditor } from "@/components/admin/SectionFieldsEditor";

function safeParse(json: string): Record<string, unknown> {
  try {
    return JSON.parse(json);
  } catch {
    return {};
  }
}

function PageMetaForm({ page, onCancel }: { page: SerializablePage; onCancel: () => void }) {
  const [title, setTitle] = useState(page.title);
  const [seoTitle, setSeoTitle] = useState(page.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(page.seoDescription);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const initialMetaRef = useRef({ title: page.title, seoTitle: page.seoTitle ?? "", seoDescription: page.seoDescription });

  async function save() {
    setStatus("saving");
    await fetch(`/api/admin/pages/${page.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, seoTitle: seoTitle || null, seoDescription }),
    });
    setStatus("saved");
    setTimeout(() => setStatus("idle"), 1500);
  }

  function cancel() {
    setTitle(initialMetaRef.current.title);
    setSeoTitle(initialMetaRef.current.seoTitle);
    setSeoDescription(initialMetaRef.current.seoDescription);
    onCancel();
  }

  return (
    <div className="rounded-[24px] border border-ledger/10 bg-paper p-4 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-ledger">Page settings</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-ledger">Page title (internal)</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-2xl border border-ledger/10 bg-paper-dim px-3 py-2.5" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-ledger">SEO title (optional)</label>
          <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className="rounded-2xl border border-ledger/10 bg-paper-dim px-3 py-2.5" />
        </div>
        <div className="flex flex-col gap-2 sm:col-span-2">
          <label className="text-sm font-medium text-ledger">SEO meta description</label>
          <textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} rows={2} className="rounded-2xl border border-ledger/10 bg-paper-dim px-3 py-2.5" />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" onClick={save} className="inline-flex items-center justify-center rounded-full border border-ledger/10 bg-paper-dim px-4 py-2.5 text-sm font-medium text-ledger transition hover:bg-paper" disabled={status === "saving"}>
          {status === "saved" ? "Saved" : status === "saving" ? "Saving…" : "Save page settings"}
        </button>
        <button type="button" onClick={cancel} className="inline-flex items-center justify-center rounded-full border border-ledger/10 bg-paper px-4 py-2.5 text-sm font-medium text-ledger transition hover:bg-paper/90">
          Cancel
        </button>
      </div>
    </div>
  );
}

function SortableSectionRow({
  section,
  sectionType,
  expanded,
  onToggleExpand,
  onToggleVisible,
  onDelete,
  onSave,
}: {
  section: PageSection;
  sectionType: SectionTypeConfig | undefined;
  expanded: boolean;
  onToggleExpand: () => void;
  onToggleVisible: () => void;
  onDelete: () => void;
  onSave: (data: Record<string, unknown>) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <li ref={setNodeRef} style={style} className="rounded-[24px] border border-ledger/10 bg-paper shadow-sm">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
          className="cursor-grab touch-none font-mono text-ledger/40 hover:text-ledger active:cursor-grabbing"
        >
          ⠿
        </button>

        <div className="flex-1">
          <p className="font-medium text-ledger">{sectionType?.label ?? section.type}</p>
          {!section.visible ? <p className="mt-1 text-xs uppercase tracking-[0.24em] text-ledger/40">Hidden</p> : null}
        </div>

        <label className="flex items-center gap-2 text-xs text-ledger/70">
          <input type="checkbox" checked={section.visible} onChange={onToggleVisible} />
          Visible
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={onToggleExpand} className="text-sm font-semibold text-growth-700 hover:underline">
            {expanded ? "Close" : "Edit"}
          </button>
          <button type="button" onClick={onDelete} className="text-sm font-semibold text-red-700 hover:underline">
            Delete
          </button>
        </div>
      </div>

      {expanded && sectionType && (
        <div className="border-t border-ledger/10 p-4">
          {sectionType.dataDriven && (
            <p className="mb-4 font-body text-xs text-ledger/50">
              This section pulls its list content live from another admin page - only its heading/copy is edited here.
            </p>
          )}
          <SectionFieldsEditor
            fields={sectionType.fields}
            initialData={safeParse(section.data)}
            onSave={onSave}
          />
        </div>
      )}
    </li>
  );
}

export function PageBuilder({ page, initialSections }: { page: SerializablePage; initialSections: PageSection[] }) {
  const [sections, setSections] = useState(initialSections);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [addingType, setAddingType] = useState("");
  const initialSectionsRef = useRef<PageSection[]>(initialSections);
  const pagePreviewUrl = page.slug === "home" ? "/" : page.slug.startsWith("insights-") ? `/insights/${page.slug.split("-")[1]}` : `/${page.slug}`;

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setSections((current) => {
      const oldIndex = current.findIndex((s) => s.id === active.id);
      const newIndex = current.findIndex((s) => s.id === over.id);
      const reordered = arrayMove(current, oldIndex, newIndex);

      fetch(`/api/admin/pages/${page.id}/sections/reorder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: reordered.map((s) => s.id) }),
      });

      return reordered;
    });
  }

  async function toggleVisible(section: PageSection) {
    const nextVisible = !section.visible;
    setSections((current) => current.map((s) => (s.id === section.id ? { ...s, visible: nextVisible } : s)));
    await fetch(`/api/admin/pages/${page.id}/sections/${section.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visible: nextVisible }),
    });
  }

  async function deleteSection(section: PageSection) {
    if (!confirm("Remove this section from the page?")) return;
    setSections((current) => current.filter((s) => s.id !== section.id));
    await fetch(`/api/admin/pages/${page.id}/sections/${section.id}`, { method: "DELETE" });
  }

  async function saveSectionData(section: PageSection, data: Record<string, unknown>) {
    const dataStr = JSON.stringify(data);
    setSections((current) => current.map((s) => (s.id === section.id ? { ...s, data: dataStr } : s)));
    await fetch(`/api/admin/pages/${page.id}/sections/${section.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data }),
    });
  }

  function resetSections() {
    setSections(initialSectionsRef.current);
    setExpandedId(null);
  }

  async function addSection() {
    if (!addingType) return;
    const response = await fetch(`/api/admin/pages/${page.id}/sections`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: addingType }),
    });
    const { row } = await response.json();
    setSections((current) => [...current, row]);
    setExpandedId(row.id);
    setAddingType("");
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl">{page.title}</h1>
          <p className="mt-1 font-body text-sm text-ledger/60">Drag sections to reorder. Click Edit to change a section's content.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href={pagePreviewUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border border-growth/20 bg-growth/10 px-4 py-2.5 text-sm font-semibold text-growth-700 transition hover:bg-growth/20">
            Preview page
          </a>
          <button type="button" onClick={resetSections} className="rounded-full border border-ledger/10 bg-paper px-4 py-2.5 text-sm font-semibold text-ledger transition hover:bg-paper/90">
            Reset view
          </button>
        </div>
      </div>

      <PageMetaForm page={page} onCancel={resetSections} />

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <ul className="flex flex-col gap-3">
            {sections.map((section) => (
              <SortableSectionRow
                key={section.id}
                section={section}
                sectionType={sectionTypes[section.type]}
                expanded={expandedId === section.id}
                onToggleExpand={() => setExpandedId(expandedId === section.id ? null : section.id)}
                onToggleVisible={() => toggleVisible(section)}
                onDelete={() => deleteSection(section)}
                onSave={(data) => saveSectionData(section, data)}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      <div className="flex flex-col gap-3 rounded-[24px] border border-dashed border-ledger/20 bg-paper-dim p-4 sm:flex-row sm:items-center">
        <select
          value={addingType}
          onChange={(e) => setAddingType(e.target.value)}
          className="w-full rounded-2xl border border-ledger/10 bg-paper px-3 py-2.5 text-sm sm:max-w-xs"
        >
          <option value="">Choose a section type…</option>
          {Object.values(sectionTypes).map((st) => (
            <option key={st.type} value={st.type}>{st.label}</option>
          ))}
        </select>
        <button type="button" onClick={addSection} disabled={!addingType} className="inline-flex items-center justify-center rounded-full bg-growth px-4 py-2.5 text-sm font-semibold text-paper transition hover:bg-growth-700 disabled:opacity-60">
          + Add Section
        </button>
      </div>
    </div>
  );
}
