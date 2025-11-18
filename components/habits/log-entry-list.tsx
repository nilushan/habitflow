"use client";

import { useState } from "react";
import { Clock, StickyNote, Pencil, Trash2, Check, X } from "lucide-react";
import type { LogEntry } from "@/types/habit-log";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface LogEntryListProps {
  entries: LogEntry[];
  onUpdateEntry?: (entryId: string, note?: string) => void;
  onDeleteEntry?: (entryId: string) => void;
  className?: string;
}

/**
 * Display list of log entries with timestamps and notes
 * Each entry is editable and deletable
 * Sorted by newest first
 */
export function LogEntryList({
  entries,
  onUpdateEntry,
  onDeleteEntry,
  className
}: LogEntryListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNote, setEditNote] = useState("");

  if (!entries || entries.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-[#9b8d80]">No entries yet</p>
        <p className="text-xs text-[#9b8d80] mt-1">
          Add your first completion above
        </p>
      </div>
    );
  }

  // Sort by newest first
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const handleStartEdit = (entry: LogEntry) => {
    setEditingId(entry.id);
    setEditNote(entry.note || "");
  };

  const handleSaveEdit = (entryId: string) => {
    if (onUpdateEntry) {
      onUpdateEntry(entryId, editNote.trim() || undefined);
    }
    setEditingId(null);
    setEditNote("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditNote("");
  };

  const handleDelete = (entryId: string) => {
    if (onDeleteEntry && confirm("Delete this entry?")) {
      onDeleteEntry(entryId);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <h3 className="text-lg font-black text-[#2d3134] mb-3">
        Completion History
      </h3>
      {sortedEntries.map((entry, index) => {
        const timeStr = new Date(entry.timestamp).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
        const isEditing = editingId === entry.id;

        return (
          <div
            key={entry.id}
            className={cn(
              "bg-white border-2 border-[#2d3134] rounded-xl p-4",
              "hover:bg-[#fafaf8] transition-colors"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1 text-sm font-bold text-[#d4847c]">
                    <Clock className="w-4 h-4" />
                    {timeStr}
                  </div>
                  <div className="px-2 py-0.5 bg-[#e8dfd5] rounded-full text-xs font-bold text-[#6b6560]">
                    #{sortedEntries.length - index}
                  </div>
                </div>

                {isEditing ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editNote}
                      onChange={(e) => setEditNote(e.target.value)}
                      placeholder="Add a note (optional)..."
                      maxLength={200}
                      rows={2}
                      className={cn(
                        "resize-none border-2 border-[#2d3134]",
                        "focus-visible:ring-[#d4847c]"
                      )}
                      autoFocus
                    />
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-[#9b8d80]">
                        {editNote.length}/200 characters
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelEdit}
                          className="border-2 border-[#2d3134]"
                        >
                          <X className="w-3 h-3 mr-1" />
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleSaveEdit(entry.id)}
                          className="bg-[#8a9a8f] hover:bg-[#7a8a7f] text-white border-2 border-[#2d3134]"
                        >
                          <Check className="w-3 h-3 mr-1" />
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {entry.note && (
                      <div className="flex items-start gap-2 mt-2">
                        <StickyNote className="w-4 h-4 text-[#8a9a8f] mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-[#6b6560] leading-relaxed">
                          {entry.note}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {!isEditing && (
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleStartEdit(entry)}
                    className={cn(
                      "p-2 rounded-lg border-2 border-[#2d3134]",
                      "bg-white hover:bg-[#f5efe6]",
                      "transition-colors"
                    )}
                    aria-label="Edit entry"
                  >
                    <Pencil className="w-4 h-4 text-[#8a9a8f]" />
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className={cn(
                      "p-2 rounded-lg border-2 border-[#2d3134]",
                      "bg-white hover:bg-[#ffd4d4]",
                      "transition-colors"
                    )}
                    aria-label="Delete entry"
                  >
                    <Trash2 className="w-4 h-4 text-[#d4847c]" />
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
