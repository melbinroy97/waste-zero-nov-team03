import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Opportunity } from "@/types";

interface OpportunityFormProps {
  initialData?: Partial<Opportunity>;
  onSubmit: (data: Partial<Opportunity>) => Promise<void>;
  isLoading?: boolean;
}

export function OpportunityForm({ initialData, onSubmit, isLoading }: OpportunityFormProps) {
  const [formData, setFormData] = useState<Partial<Opportunity>>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    location: initialData?.location || "",
    duration: initialData?.duration ? new Date(initialData.duration).toISOString().split('T')[0] : "",
    requiredSkills: initialData?.requiredSkills || [],
    status: initialData?.status || "Open",
  });

  const [skillsInput, setSkillsInput] = useState(initialData?.requiredSkills?.join(", ") || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      ...formData,
      requiredSkills: skillsInput.split(",").map(s => s.trim()).filter(s => s),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          required
          value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g. Community Beach Cleanup"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          required
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe the opportunity..."
          className="min-h-[100px]"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            required
            value={formData.location}
            onChange={e => setFormData({ ...formData, location: e.target.value })}
            placeholder="e.g. Central Park"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            required
            value={formData.duration}
            onChange={e => setFormData({ ...formData, duration: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="skills">Required Skills (comma separated)</Label>
        <Input
          id="skills"
          value={skillsInput}
          onChange={e => setSkillsInput(e.target.value)}
          placeholder="e.g. Lifting, Sorting, Driving"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value: any) => setFormData({ ...formData, status: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Open">Open</SelectItem>
            <SelectItem value="In-progress">In Progress</SelectItem>
            <SelectItem value="Closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Saving..." : "Save Opportunity"}
      </Button>
    </form>
  );
}
