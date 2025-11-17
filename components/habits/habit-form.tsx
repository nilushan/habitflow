"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateHabitSchema, type CreateHabitInput } from "@/types/habit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface HabitFormProps {
  onSubmit: (data: CreateHabitInput) => void | Promise<void>;
  isSubmitting?: boolean;
  defaultValues?: Partial<CreateHabitInput>;
}

export function HabitForm({
  onSubmit,
  isSubmitting = false,
  defaultValues,
}: HabitFormProps) {
  const [frequencyType, setFrequencyType] = useState<"daily" | "weekly" | "custom">(
    defaultValues?.frequency?.type || "daily"
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateHabitInput>({
    resolver: zodResolver(CreateHabitSchema),
    defaultValues: defaultValues || {
      name: "",
      description: "",
      category: "health",
      frequency: { type: "daily", timesPerDay: 1 },
    },
  });

  const selectedCategory = watch("category");

  // TODO: Implement frequency-specific fields
  // This is a critical UX decision point - how should users specify different frequency patterns?
  // Consider: Should weekly habits show a visual day picker? Should custom frequency have a calendar view?

  const handleFrequencyTypeChange = (type: "daily" | "weekly" | "custom") => {
    setFrequencyType(type);

    // Set default frequency values based on type
    if (type === "daily") {
      setValue("frequency", { type: "daily", timesPerDay: 1 });
    } else if (type === "weekly") {
      setValue("frequency", {
        type: "weekly",
        daysOfWeek: [1], // Monday by default
        timesPerDay: 1
      });
    } else {
      setValue("frequency", {
        type: "custom",
        targetDays: 3,
        perWeeks: 1
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Habit Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-base font-semibold text-gray-900">Habit Name *</Label>
        <Input
          id="name"
          placeholder="e.g., Morning meditation"
          {...register("name")}
          aria-invalid={errors.name ? "true" : "false"}
          className="text-base py-3 border-2 focus:border-blue-500"
        />
        {errors.name && (
          <p className="text-sm text-red-600 font-medium">{errors.name.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-base font-semibold text-gray-900">Description (optional)</Label>
        <Textarea
          id="description"
          placeholder="Why is this habit important to you?"
          rows={3}
          {...register("description")}
          className="text-base border-2 focus:border-blue-500"
        />
        {errors.description && (
          <p className="text-sm text-red-600 font-medium">{errors.description.message}</p>
        )}
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category" className="text-base font-semibold text-gray-900">Category *</Label>
        <Select
          value={selectedCategory}
          onValueChange={(value) => setValue("category", value as any)}
        >
          <SelectTrigger id="category" className="text-base py-3 border-2 focus:border-blue-500">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="health" className="text-base">💪 Health</SelectItem>
            <SelectItem value="work" className="text-base">💼 Work</SelectItem>
            <SelectItem value="learning" className="text-base">📚 Learning</SelectItem>
            <SelectItem value="social" className="text-base">👥 Social</SelectItem>
            <SelectItem value="other" className="text-base">🎯 Other</SelectItem>
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-sm text-red-600 font-medium">{errors.category.message}</p>
        )}
      </div>

      {/* Frequency Type */}
      <div className="space-y-2">
        <Label className="text-base font-semibold text-gray-900">Frequency Type *</Label>
        <Select value={frequencyType} onValueChange={handleFrequencyTypeChange}>
          <SelectTrigger className="text-base py-3 border-2 focus:border-blue-500">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily" className="text-base">📅 Daily</SelectItem>
            <SelectItem value="weekly" className="text-base">📆 Weekly</SelectItem>
            <SelectItem value="custom" className="text-base">⚙️ Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Frequency-specific fields */}
      {frequencyType === "daily" && (
        <div className="space-y-3 rounded-xl border-2 border-blue-200 p-5 bg-gradient-to-br from-blue-50 to-blue-100">
          <Label htmlFor="timesPerDay" className="text-base font-semibold text-blue-900">Times per day *</Label>
          <Input
            id="timesPerDay"
            type="number"
            min="1"
            max="10"
            defaultValue={1}
            {...register("frequency.timesPerDay", { valueAsNumber: true })}
            className="text-base py-3 border-2 bg-white"
          />
          <p className="text-sm text-blue-700 font-medium">
            💡 How many times per day do you want to complete this habit?
          </p>
        </div>
      )}

      {frequencyType === "weekly" && (
        <div className="space-y-4 rounded-xl border-2 border-purple-200 p-5 bg-gradient-to-br from-purple-50 to-purple-100">
          <div>
            <Label className="text-base font-semibold text-purple-900">Days of the week *</Label>
            <div className="grid grid-cols-7 gap-2 mt-3">
              {[
                { label: "Sun", value: 0 },
                { label: "Mon", value: 1 },
                { label: "Tue", value: 2 },
                { label: "Wed", value: 3 },
                { label: "Thu", value: 4 },
                { label: "Fri", value: 5 },
                { label: "Sat", value: 6 },
              ].map((day) => {
                const selectedDays = watch("frequency.daysOfWeek") as number[] || [1];
                const isSelected = selectedDays.includes(day.value);

                return (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => {
                      const currentDays = (watch("frequency.daysOfWeek") as number[]) || [1];
                      const newDays = isSelected
                        ? currentDays.filter((d) => d !== day.value)
                        : [...currentDays, day.value].sort();

                      // Ensure at least one day is selected
                      if (newDays.length > 0) {
                        setValue("frequency.daysOfWeek", newDays);
                      }
                    }}
                    className={`px-3 py-2 rounded-lg text-sm font-bold transition-all border-2 ${
                      isSelected
                        ? "bg-purple-600 text-white border-purple-700 shadow-md scale-105"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-purple-50 hover:border-purple-300"
                    }`}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>
            <p className="text-sm text-purple-700 font-medium mt-2">
              💡 Select the days you want to track this habit
            </p>
          </div>

          <div>
            <Label htmlFor="weeklyTimesPerDay" className="text-base font-semibold text-purple-900">Times per day *</Label>
            <Input
              id="weeklyTimesPerDay"
              type="number"
              min="1"
              max="10"
              defaultValue={1}
              {...register("frequency.timesPerDay", { valueAsNumber: true })}
              className="text-base py-3 border-2 bg-white"
            />
          </div>
        </div>
      )}

      {frequencyType === "custom" && (
        <div className="space-y-4 rounded-xl border-2 border-green-200 p-5 bg-gradient-to-br from-green-50 to-green-100">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetDays" className="text-base font-semibold text-green-900">Target days *</Label>
              <Input
                id="targetDays"
                type="number"
                min="1"
                max="365"
                defaultValue={3}
                {...register("frequency.targetDays", { valueAsNumber: true })}
                className="text-base py-3 border-2 bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="perWeeks" className="text-base font-semibold text-green-900">Per weeks *</Label>
              <Input
                id="perWeeks"
                type="number"
                min="1"
                max="52"
                defaultValue={1}
                {...register("frequency.perWeeks", { valueAsNumber: true })}
                className="text-base py-3 border-2 bg-white"
              />
            </div>
          </div>
          <p className="text-sm text-green-700 font-medium">
            💡 Example: 3 days per 1 week = 3× weekly, 5 days per 2 weeks = 2.5× weekly
          </p>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex gap-3 justify-end pt-4 border-t-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
        >
          {isSubmitting ? "Creating..." : "✨ Create Habit"}
        </Button>
      </div>
    </form>
  );
}
