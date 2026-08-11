"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { FieldConfig } from "@/lib/admin/entities";
import { parseServiceContentBlocks, serializeServiceContentBlocks, type ServiceContentBlock } from "@/lib/service-content";

interface Props {
  field: FieldConfig;
  value: string;
  onChange: (value: string) => void;
}

function RichTextEditor({ value, onChange }: { value: string; onChange: (nextHtml: string) => void }) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const savedSelectionRef = useRef<Range | null>(null);
  const [hasSelection, setHasSelection] = useState(false);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!editorRef.current) return;

    const normalizedCurrentHtml = editorRef.current.innerHTML.trim();
    const normalizedValue = value.trim();
    if (normalizedCurrentHtml !== normalizedValue) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const syncEditorValue = () => {
    onChange(editorRef.current?.innerHTML ?? "");
  };

  const saveSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      savedSelectionRef.current = null;
      setHasSelection(false);
      setActiveFormats(new Set());
      return;
    }

    const range = selection.getRangeAt(0);
    if (!editorRef.current?.contains(range.commonAncestorContainer)) {
      savedSelectionRef.current = null;
      setHasSelection(false);
      setActiveFormats(new Set());
      return;
    }

    if (selection.toString().length > 0) {
      savedSelectionRef.current = range.cloneRange();
      setHasSelection(true);
      
      // Check which formats are active
      const formats = new Set<string>();
      if (document.queryCommandState("bold")) formats.add("bold");
      if (document.queryCommandState("italic")) formats.add("italic");
      if (document.queryCommandState("underline")) formats.add("underline");
      setActiveFormats(formats);
    } else {
      savedSelectionRef.current = null;
      setHasSelection(false);
      setActiveFormats(new Set());
    }
  };

  const restoreSelection = () => {
    if (savedSelectionRef.current) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(savedSelectionRef.current);
      }
    }
  };

  const insertList = (command: "insertUnorderedList" | "insertOrderedList") => {
    if (!editorRef.current) return;
    restoreSelection();

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      document.execCommand(command, false, undefined);
      return;
    }

    const range = selection.getRangeAt(0);
    if (!editorRef.current.contains(range.commonAncestorContainer)) {
      document.execCommand(command, false, undefined);
      return;
    }

    const selectedText = selection.toString();
    if (!selectedText.trim()) {
      document.execCommand(command, false, undefined);
      return;
    }

    const listTag = command === "insertOrderedList" ? "ol" : "ul";
    const lines = selectedText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length === 0) {
      document.execCommand(command, false, undefined);
      return;
    }

    const list = document.createElement(listTag);
    for (const line of lines) {
      const li = document.createElement("li");
      li.textContent = line;
      list.appendChild(li);
    }

    range.deleteContents();
    range.insertNode(list);

    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.setStartAfter(list);
    newRange.collapse(true);
    selection.addRange(newRange);
  };

  const applyCommand = (command: string, nextValue?: string) => {
    if (!editorRef.current) return;
    
    if (!hasSelection && !["insertUnorderedList", "insertOrderedList", "justifyLeft", "justifyCenter", "justifyRight"].includes(command)) {
      return;
    }

    restoreSelection();
    editorRef.current.focus();
    
    if (command === "insertUnorderedList" || command === "insertOrderedList") {
      insertList(command);
    } else {
      document.execCommand(command, false, nextValue ?? undefined);
    }
    
    syncEditorValue();
    saveSelection();
  };

  const insertLink = () => {
    if (!hasSelection) return;
    restoreSelection();
    const url = window.prompt("Enter a URL", "https://");
    if (!url) {
      editorRef.current?.focus();
      return;
    }
    document.execCommand("createLink", false, url);
    syncEditorValue();
    saveSelection();
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    const pastedText = event.clipboardData.getData("text/plain");
    if (pastedText) {
      document.execCommand("insertText", false, pastedText);
      syncEditorValue();
      saveSelection();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!event.ctrlKey && !event.metaKey) return;

    switch (event.key.toLowerCase()) {
      case "b":
        event.preventDefault();
        saveSelection();
        applyCommand("bold");
        break;
      case "i":
        event.preventDefault();
        saveSelection();
        applyCommand("italic");
        break;
      case "u":
        event.preventDefault();
        saveSelection();
        applyCommand("underline");
        break;
      case "k":
        event.preventDefault();
        saveSelection();
        insertLink();
        break;
      default:
        break;
    }
  };

  const handleMouseUp = () => {
    saveSelection();
  };

  const handleKeyUp = () => {
    saveSelection();
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-ledger/10 bg-paper shadow-sm">
      <div className="flex flex-wrap gap-2 border-b border-ledger/10 bg-paper-dim px-3 py-2">
        <button 
          type="button" 
          className={`rounded-md border px-2 py-1 text-xs font-semibold transition ${
            activeFormats.has("bold") 
              ? "border-growth-700 bg-growth-700/20 text-growth-700" 
              : "border-ledger/10 bg-paper hover:bg-paper-dim"
          } ${!hasSelection ? "cursor-not-allowed opacity-40" : ""}`}
          onMouseDown={(event) => event.preventDefault()} 
          onClick={() => {
            saveSelection();
            applyCommand("bold");
          }}
          disabled={!hasSelection}
          title="Bold (Ctrl+B)"
        >
          B
        </button>
        <button 
          type="button" 
          className={`rounded-md border px-2 py-1 text-xs italic transition ${
            activeFormats.has("italic") 
              ? "border-growth-700 bg-growth-700/20 text-growth-700" 
              : "border-ledger/10 bg-paper hover:bg-paper-dim"
          } ${!hasSelection ? "cursor-not-allowed opacity-40" : ""}`}
          onMouseDown={(event) => event.preventDefault()} 
          onClick={() => {
            saveSelection();
            applyCommand("italic");
          }}
          disabled={!hasSelection}
          title="Italic (Ctrl+I)"
        >
          I
        </button>
        <button 
          type="button" 
          className={`rounded-md border px-2 py-1 text-xs underline transition ${
            activeFormats.has("underline") 
              ? "border-growth-700 bg-growth-700/20 text-growth-700" 
              : "border-ledger/10 bg-paper hover:bg-paper-dim"
          } ${!hasSelection ? "cursor-not-allowed opacity-40" : ""}`}
          onMouseDown={(event) => event.preventDefault()} 
          onClick={() => {
            saveSelection();
            applyCommand("underline");
          }}
          disabled={!hasSelection}
          title="Underline (Ctrl+U)"
        >
          U
        </button>
        <button 
          type="button" 
          className={`rounded-md border border-ledger/10 bg-paper px-2 py-1 text-xs hover:bg-paper-dim transition ${
            !hasSelection ? "cursor-not-allowed opacity-40" : ""
          }`}
          onMouseDown={(event) => event.preventDefault()} 
          onClick={() => {
            saveSelection();
            applyCommand("insertUnorderedList");
          }}
          disabled={!hasSelection}
          title="Bullet list"
        >
          • List
        </button>
        <button 
          type="button" 
          className={`rounded-md border border-ledger/10 bg-paper px-2 py-1 text-xs hover:bg-paper-dim transition ${
            !hasSelection ? "cursor-not-allowed opacity-40" : ""
          }`}
          onMouseDown={(event) => event.preventDefault()} 
          onClick={() => {
            saveSelection();
            applyCommand("insertOrderedList");
          }}
          disabled={!hasSelection}
          title="Numbered list"
        >
          1. List
        </button>
        <button 
          type="button" 
          className={`rounded-md border border-ledger/10 bg-paper px-2 py-1 text-xs hover:bg-paper-dim transition ${
            !hasSelection ? "cursor-not-allowed opacity-40" : ""
          }`}
          onMouseDown={(event) => event.preventDefault()} 
          onClick={() => {
            saveSelection();
            applyCommand("formatBlock", "h2");
          }}
          disabled={!hasSelection}
          title="Heading 2"
        >
          H2
        </button>
        <button 
          type="button" 
          className={`rounded-md border border-ledger/10 bg-paper px-2 py-1 text-xs hover:bg-paper-dim transition ${
            !hasSelection ? "cursor-not-allowed opacity-40" : ""
          }`}
          onMouseDown={(event) => event.preventDefault()} 
          onClick={() => {
            saveSelection();
            applyCommand("formatBlock", "h3");
          }}
          disabled={!hasSelection}
          title="Heading 3"
        >
          H3
        </button>
        <button 
          type="button" 
          className={`rounded-md border border-ledger/10 bg-paper px-2 py-1 text-xs hover:bg-paper-dim transition ${
            !hasSelection ? "cursor-not-allowed opacity-40" : ""
          }`}
          onMouseDown={(event) => event.preventDefault()} 
          onClick={() => {
            saveSelection();
            applyCommand("formatBlock", "p");
          }}
          disabled={!hasSelection}
          title="Paragraph"
        >
          P
        </button>
        <button 
          type="button" 
          className="rounded-md border border-ledger/10 bg-paper px-2 py-1 text-xs hover:bg-paper-dim transition"
          onMouseDown={(event) => event.preventDefault()} 
          onClick={() => applyCommand("justifyLeft")}
          title="Align left"
        >
          Left
        </button>
        <button 
          type="button" 
          className="rounded-md border border-ledger/10 bg-paper px-2 py-1 text-xs hover:bg-paper-dim transition"
          onMouseDown={(event) => event.preventDefault()} 
          onClick={() => applyCommand("justifyCenter")}
          title="Align center"
        >
          Center
        </button>
        <button 
          type="button" 
          className="rounded-md border border-ledger/10 bg-paper px-2 py-1 text-xs hover:bg-paper-dim transition"
          onMouseDown={(event) => event.preventDefault()} 
          onClick={() => applyCommand("justifyRight")}
          title="Align right"
        >
          Right
        </button>
        <button 
          type="button" 
          className={`rounded-md border border-ledger/10 bg-paper px-2 py-1 text-xs hover:bg-paper-dim transition ${
            !hasSelection ? "cursor-not-allowed opacity-40" : ""
          }`}
          onMouseDown={(event) => event.preventDefault()} 
          onClick={insertLink}
          disabled={!hasSelection}
          title="Insert link (Ctrl+K)"
        >
          Link
        </button>
        <button 
          type="button" 
          className={`rounded-md border border-ledger/10 bg-paper px-2 py-1 text-xs hover:bg-paper-dim transition ${
            !hasSelection ? "cursor-not-allowed opacity-40" : ""
          }`}
          onMouseDown={(event) => event.preventDefault()} 
          onClick={() => {
            saveSelection();
            applyCommand("unlink");
          }}
          disabled={!hasSelection}
          title="Remove link"
        >
          Unlink
        </button>
        <button 
          type="button" 
          className={`rounded-md border border-ledger/10 bg-paper px-2 py-1 text-xs hover:bg-paper-dim transition ${
            !hasSelection ? "cursor-not-allowed opacity-40" : ""
          }`}
          onMouseDown={(event) => event.preventDefault()} 
          onClick={() => {
            saveSelection();
            applyCommand("removeFormat");
          }}
          disabled={!hasSelection}
          title="Clear formatting"
        >
          Clear
        </button>
        <button 
          type="button" 
          className="rounded-md border border-ledger/10 bg-paper px-2 py-1 text-xs hover:bg-paper-dim transition"
          onMouseDown={(event) => event.preventDefault()} 
          onClick={() => applyCommand("undo")}
          title="Undo"
        >
          Undo
        </button>
        <button 
          type="button" 
          className="rounded-md border border-ledger/10 bg-paper px-2 py-1 text-xs hover:bg-paper-dim transition"
          onMouseDown={(event) => event.preventDefault()} 
          onClick={() => applyCommand("redo")}
          title="Redo"
        >
          Redo
        </button>
      </div>

      {!hasSelection && (
        <div className="border-b border-ledger/10 bg-amber-50 px-3 py-2">
          <p className="text-xs text-amber-700">📝 Select text to apply formatting (bold, italic, underline, lists, headings, links, alignment)</p>
        </div>
      )}

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={(event) => {
          onChange((event.currentTarget as HTMLDivElement).innerHTML);
          saveSelection();
        }}
        onBlur={syncEditorValue}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onMouseUp={handleMouseUp}
        className="min-h-[180px] bg-paper px-3 py-3 text-sm leading-7 text-ledger focus:outline-none"
        data-placeholder="Add the written content for this heading"
        style={{ outline: "none" }}
      />
    </div>
  );
}

const createBlankBlock = (): ServiceContentBlock => ({
  id: `block-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  heading: "",
  content: "",
  sortOrder: 0,
});

export function ServiceContentBlocksFieldControl({ field, value, onChange }: Props) {
  const parsedBlocks = useMemo(() => parseServiceContentBlocks(value), [value]);
  const [localBlocks, setLocalBlocks] = useState<ServiceContentBlock[]>(parsedBlocks.length ? parsedBlocks : [createBlankBlock()]);

  useEffect(() => {
    const nextBlocks = parseServiceContentBlocks(value);
    setLocalBlocks(nextBlocks.length ? nextBlocks : [createBlankBlock()]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const syncBlocks = (nextBlocks: ServiceContentBlock[]) => {
    setLocalBlocks(nextBlocks);
    onChange(serializeServiceContentBlocks(nextBlocks));
  };

  const updateBlock = (index: number, updates: Partial<ServiceContentBlock>) => {
    const nextBlocks = [...localBlocks];
    nextBlocks[index] = { ...nextBlocks[index], ...updates };
    syncBlocks(nextBlocks);
  };

  const addBlock = () => {
    syncBlocks([...localBlocks, createBlankBlock()]);
  };

  const removeBlock = (index: number) => {
    const nextBlocks = localBlocks.filter((_, itemIndex) => itemIndex !== index);
    syncBlocks(nextBlocks.length ? nextBlocks : [createBlankBlock()]);
  };

  const moveBlock = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= localBlocks.length) return;
    const nextBlocks = [...localBlocks];
    const current = nextBlocks[index];
    nextBlocks[index] = nextBlocks[nextIndex];
    nextBlocks[nextIndex] = current;
    syncBlocks(nextBlocks);
  };

  return (
    <div className="rounded-[24px] border border-ledger/10 bg-paper p-4 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <label className="text-sm font-medium text-ledger">{field.label}</label>
          {field.help ? <p className="mt-1 text-xs leading-6 text-ledger/50">{field.help}</p> : null}
        </div>
        <button
          type="button"
          onClick={addBlock}
          className="inline-flex items-center justify-center rounded-full border border-growth/20 bg-growth/10 px-3 py-2 text-sm font-medium text-growth-700 transition hover:bg-growth/20"
        >
          + Add block
        </button>
      </div>

      <div className="mt-4 space-y-4">
        {localBlocks.map((block, index) => (
          <div key={block.id || `block-${index}`} className="rounded-2xl border border-ledger/10 bg-paper-dim p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-ledger">Block {index + 1}</p>
              <div className="flex items-center gap-2">
                <button type="button" className="rounded-full border border-ledger/10 px-2 py-1 text-xs text-ledger/70 disabled:cursor-not-allowed disabled:opacity-40" onClick={() => moveBlock(index, -1)} disabled={index === 0}>
                  ↑
                </button>
                <button type="button" className="rounded-full border border-ledger/10 px-2 py-1 text-xs text-ledger/70 disabled:cursor-not-allowed disabled:opacity-40" onClick={() => moveBlock(index, 1)} disabled={index === localBlocks.length - 1}>
                  ↓
                </button>
                {localBlocks.length > 1 ? (
                  <button type="button" className="rounded-full border border-red-200 px-2 py-1 text-xs font-medium text-red-700" onClick={() => removeBlock(index)}>
                    Remove
                  </button>
                ) : null}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium uppercase tracking-[0.16em] text-ledger/60">Heading</label>
                <input
                  type="text"
                  value={block.heading}
                  onChange={(event) => updateBlock(index, { heading: event.target.value })}
                  placeholder="Add a heading"
                  className="rounded-2xl border border-ledger/10 bg-paper px-3 py-2.5 text-sm shadow-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium uppercase tracking-[0.16em] text-ledger/60">Content</label>
                <RichTextEditor
                  value={block.content}
                  onChange={(nextHtml) => updateBlock(index, { content: nextHtml })}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
