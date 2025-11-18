"use client";

import { useState } from "react";
import { Plus, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface AddLogEntryFormProps {
  onAdd: (note?: string) => void;
  disabled?: boolean;
}

/**
 * Form to add a new timestamped log entry
 * Note field is always visible - if filled, note is included
 */
export function AddLogEntryForm({ onAdd, disabled }: AddLogEntryFormProps) {
  const [note, setNote] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAdd();
  };

  const handleAdd = () => {
    onAdd(note.trim() || undefined);
    setNote("");
  };

  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="bg-[#f5efe6] border-2 border-[#2d3134] rounded-xl p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#6b6560] mb-3">
          <Clock className="w-4 h-4" />
          {currentTime}
        </div>

        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note (optional)..."
          maxLength={200}
          rows={2}
          className={cn(
            "resize-none border-2 border-[#2d3134] mb-3",
            "focus-visible:ring-[#d4847c]"
          )}
        />

        <div className="flex items-center justify-between">
          <div className="text-xs text-[#9b8d80]">
            {note.length}/200 characters
          </div>
          <Button
            type="submit"
            disabled={disabled}
            className={cn(
              "bg-[#d4847c] hover:bg-[#c17161] text-white",
              "font-bold border-2 border-[#2d3134]"
            )}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Entry
          </Button>
        </div>
      </div>
    </form>
  );
}
