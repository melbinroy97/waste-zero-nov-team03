import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { updateMyProfile } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { alertToast } from "@/components/ui/AlertToast";

export default function ProfileForm() {
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || "",
    location: user?.location || "",
    skills: user?.skills?.join(", ") || "",
    bio: user?.bio || "",
  });

  const handleSave = async () => {
    try {
      await updateMyProfile({
        ...form,
        skills: form.skills.split(",").map(s => s.trim()),
      });
      alertToast.success({ title: "Profile updated" });
    } catch {
      alertToast.error({ title: "Update failed" });
    }
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Full Name"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
      />
      <Input
        placeholder="Location"
        value={form.location}
        onChange={e => setForm({ ...form, location: e.target.value })}
      />
      <Input
        placeholder="Skills (comma separated)"
        value={form.skills}
        onChange={e => setForm({ ...form, skills: e.target.value })}
      />
      <Textarea
        placeholder="Bio"
        value={form.bio}
        onChange={e => setForm({ ...form, bio: e.target.value })}
      />
      <Button onClick={handleSave}>Save Changes</Button>
    </div>
  );
}
