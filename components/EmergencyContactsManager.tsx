"use client";

import * as React from "react";
import { Users, Plus, Pencil, Trash2, Save, X, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useHealthProfile } from "@/lib/health-profile-context";
import { useToast } from "@/lib/toast-context";
import { isValidPhone } from "@/lib/health-profile";
import type { EmergencyContactRecord } from "@/types/health";

type Draft = Omit<EmergencyContactRecord, "id">;
const emptyDraft: Draft = { name: "", relationship: "", phone: "" };

interface ContactFormProps {
  draft: Draft;
  onChange: (draft: Draft) => void;
  onSave: () => void;
  onCancel: () => void;
  errors: Partial<Record<keyof Draft, string>>;
}

function ContactForm({ draft, onChange, onSave, onCancel, errors }: ContactFormProps) {
  return (
    <div className="grid gap-3 rounded-xl border border-dashed border-border p-4 sm:grid-cols-3">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contact-name" className="text-xs">
          Name
        </Label>
        <Input
          id="contact-name"
          value={draft.name}
          onChange={(e) => onChange({ ...draft, name: e.target.value })}
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name && <p className="text-xs font-medium text-critical">{errors.name}</p>}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contact-relationship" className="text-xs">
          Relationship
        </Label>
        <Input
          id="contact-relationship"
          placeholder="Parent, Spouse, Friend…"
          value={draft.relationship}
          onChange={(e) => onChange({ ...draft, relationship: e.target.value })}
          aria-invalid={Boolean(errors.relationship)}
        />
        {errors.relationship && <p className="text-xs font-medium text-critical">{errors.relationship}</p>}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contact-phone" className="text-xs">
          Phone number
        </Label>
        <Input
          id="contact-phone"
          type="tel"
          placeholder="+91 XXXXX XXXXX"
          value={draft.phone}
          onChange={(e) => onChange({ ...draft, phone: e.target.value })}
          aria-invalid={Boolean(errors.phone)}
        />
        {errors.phone && <p className="text-xs font-medium text-critical">{errors.phone}</p>}
      </div>
      <div className="flex gap-2 sm:col-span-3">
        <Button size="sm" onClick={onSave}>
          <Save className="h-3.5 w-3.5" aria-hidden="true" />
          Save Contact
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel}>
          <X className="h-3.5 w-3.5" aria-hidden="true" />
          Cancel
        </Button>
      </div>
    </div>
  );
}

export function EmergencyContactsManager() {
  const { profile, addContact, updateContact, removeContact } = useHealthProfile();
  const { toast } = useToast();

  const [addingNew, setAddingNew] = React.useState(false);
  const [newDraft, setNewDraft] = React.useState<Draft>(emptyDraft);
  const [newErrors, setNewErrors] = React.useState<Partial<Record<keyof Draft, string>>>({});

  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editDraft, setEditDraft] = React.useState<Draft>(emptyDraft);
  const [editErrors, setEditErrors] = React.useState<Partial<Record<keyof Draft, string>>>({});

  function validate(draft: Draft): Partial<Record<keyof Draft, string>> {
    const errors: Partial<Record<keyof Draft, string>> = {};
    if (!draft.name.trim()) errors.name = "Name is required.";
    if (!draft.relationship.trim()) errors.relationship = "Relationship is required.";
    if (!draft.phone.trim()) {
      errors.phone = "Phone number is required.";
    } else if (!isValidPhone(draft.phone)) {
      errors.phone = "Enter a valid phone number.";
    }
    return errors;
  }

  function handleAddNew() {
    const errors = validate(newDraft);
    setNewErrors(errors);
    if (Object.keys(errors).length > 0) return;
    addContact(newDraft);
    setNewDraft(emptyDraft);
    setAddingNew(false);
    toast("Emergency contact added.");
  }

  function startEdit(contact: EmergencyContactRecord) {
    setEditingId(contact.id);
    setEditDraft({ name: contact.name, relationship: contact.relationship, phone: contact.phone });
    setEditErrors({});
  }

  function handleSaveEdit() {
    if (!editingId) return;
    const errors = validate(editDraft);
    setEditErrors(errors);
    if (Object.keys(errors).length > 0) return;
    updateContact(editingId, editDraft);
    setEditingId(null);
    toast("Emergency contact updated.");
  }

  function handleRemove(contact: EmergencyContactRecord) {
    removeContact(contact.id);
    toast(`${contact.name} removed from emergency contacts.`);
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-primary">
            <Users className="h-4.5 w-4.5" aria-hidden="true" />
          </span>
          <CardTitle>Emergency Contacts</CardTitle>
        </div>
        {!addingNew && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setNewDraft(emptyDraft);
              setNewErrors({});
              setAddingNew(true);
            }}
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            Add Contact
          </Button>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {profile.emergencyContacts.length === 0 && !addingNew && (
          <p className="text-sm text-muted-foreground">No emergency contacts added yet.</p>
        )}

        <ul className="flex flex-col gap-3">
          {profile.emergencyContacts.map((contact) =>
            editingId === contact.id ? (
              <li key={contact.id}>
                <ContactForm
                  draft={editDraft}
                  onChange={setEditDraft}
                  onSave={handleSaveEdit}
                  onCancel={() => setEditingId(null)}
                  errors={editErrors}
                />
              </li>
            ) : (
              <li
                key={contact.id}
                className="flex flex-col gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">{contact.name}</p>
                  <p className="text-xs text-muted-foreground">{contact.relationship}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-foreground">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                    {contact.phone}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => startEdit(contact)}>
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemove(contact)}
                    className="text-critical hover:bg-critical/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Delete
                  </Button>
                </div>
              </li>
            )
          )}
        </ul>

        {addingNew && (
          <ContactForm
            draft={newDraft}
            onChange={setNewDraft}
            onSave={handleAddNew}
            onCancel={() => setAddingNew(false)}
            errors={newErrors}
          />
        )}

        <p className="text-xs text-muted-foreground">
          Emergency contacts may be notified when the user activates SOS.
        </p>
      </CardContent>
    </Card>
  );
}
