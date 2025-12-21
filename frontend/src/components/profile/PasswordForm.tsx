import { useState } from "react";
import { changePassword } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { alertToast } from "@/components/ui/AlertToast";

export default function PasswordForm() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = async () => {
    if (form.newPassword !== form.confirmPassword) {
      return alertToast.error({ title: "Passwords do not match" });
    }

    try {
      await changePassword(form);
      alertToast.success({ title: "Password updated" });
    } catch {
      alertToast.error({ title: "Password update failed" });
    }
  };

  return (
    <div className="space-y-4">
      <Input
        type="password"
        placeholder="Current Password"
        onChange={e => setForm({ ...form, currentPassword: e.target.value })}
      />
      <Input
        type="password"
        placeholder="New Password"
        onChange={e => setForm({ ...form, newPassword: e.target.value })}
      />
      <Input
        type="password"
        placeholder="Confirm New Password"
        onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
      />
      <Button onClick={handleChange}>Change Password</Button>
    </div>
  );
}
