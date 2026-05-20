import React, { useState } from 'react';
import { ChildProfile, Birthday } from '../content/types';
import { REGIONS } from '../content/regions/registry';

const CHILD_EMOJIS = ["🌟","🌈","🦋","🐣","🌻","🦄","🐬","🍎","🎨","🎵"];

const TRADITIONS = [
  { id: "universal",             label: "Non-religious",  color: "#6366f1" },
  { id: "hindu",                 label: "Hindu",          color: "#b45309" },
  { id: "christian-catholic",    label: "Catholic",       color: "#0369a1" },
  { id: "christian-protestant",  label: "Protestant",     color: "#0e7490" },
  { id: "jewish",                label: "Jewish",         color: "#4338ca" },
  { id: "muslim",                label: "Muslim",         color: "#047857" },
];

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

export function loadProfiles(): ChildProfile[] {
  try {
    const raw = localStorage.getItem("mw_children_v2");
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

export function saveProfiles(profiles: ChildProfile[]) {
  try { localStorage.setItem("mw_children_v2", JSON.stringify(profiles)); } catch {}
}

interface ProfileModalProps {
  profiles: ChildProfile[];
  onClose: () => void;
  onSave: (profiles: ChildProfile[]) => void;
  onSelect: (id: string | null) => void;
  activeId: string | null;
}

interface FormState {
  name: string;
  age: number;
  traditions: string[];
  region: string;
  birthdays: Birthday[];
}

export default function ProfileModal({ profiles, onClose, onSave, onSelect, activeId }: ProfileModalProps) {
  const [list, setList] = useState<ChildProfile[]>(profiles);
  const [editing, setEditing] = useState<ChildProfile | null>(null);
  const [form, setForm] = useState<FormState>({ name: "", age: 5, traditions: ["universal"], region: "us", birthdays: [] });
  const [newBday, setNewBday] = useState({ name: "", month: 1, day: 1 });

  const openNew = () => {
    const nextEmoji = CHILD_EMOJIS[list.length % CHILD_EMOJIS.length];
    // Pre-populate from the last child's settings (siblings share family birthdays, traditions, region)
    const lastChild = list[list.length - 1];
    const inheritedTraditions = lastChild ? [...lastChild.traditions] : ["universal"];
    const inheritedRegion = lastChild?.region ?? "us";
    const inheritedBirthdays = lastChild ? lastChild.birthdays.map(b => ({ ...b, id: makeId() })) : [];
    const newProfile: ChildProfile = { id: makeId(), name: "", age: 5, traditions: inheritedTraditions, region: inheritedRegion, emoji: nextEmoji, birthdays: inheritedBirthdays };
    setEditing(newProfile);
    setForm({ name: "", age: 5, traditions: inheritedTraditions, region: inheritedRegion, birthdays: inheritedBirthdays });
    setNewBday({ name: "", month: 1, day: 1 });
  };

  const openEdit = (p: ChildProfile) => {
    setEditing(p);
    setForm({ name: p.name, age: p.age, traditions: [...p.traditions], region: p.region, birthdays: [...p.birthdays] });
    setNewBday({ name: "", month: 1, day: 1 });
  };

  const toggleTradition = (id: string) => {
    setForm(f => {
      const has = f.traditions.includes(id);
      if (has) {
        // Don't allow empty — must have at least one
        if (f.traditions.length <= 1) return f;
        return { ...f, traditions: f.traditions.filter(t => t !== id) };
      }
      // Max 3 traditions
      if (f.traditions.length >= 3) return f;
      return { ...f, traditions: [...f.traditions, id] };
    });
  };

  const addBirthday = () => {
    if (!newBday.name.trim()) return;
    const bday: Birthday = { id: makeId(), name: newBday.name.trim(), month: newBday.month, day: newBday.day };
    setForm(f => ({ ...f, birthdays: [...f.birthdays, bday] }));
    setNewBday({ name: "", month: 1, day: 1 });
  };

  const removeBirthday = (id: string) => {
    setForm(f => ({ ...f, birthdays: f.birthdays.filter(b => b.id !== id) }));
  };

  const saveChild = () => {
    if (!form.name.trim() || !editing) return;
    const updated: ChildProfile = {
      ...editing,
      name: form.name.trim(),
      age: form.age,
      traditions: form.traditions,
      region: form.region,
      birthdays: form.birthdays,
    };
    const exists = list.find(p => p.id === editing.id);
    const newList = exists ? list.map(p => p.id === editing.id ? updated : p) : [...list, updated];
    setList(newList);
    onSave(newList);
    if (!exists) onSelect(updated.id);
    setEditing(null);
  };

  const deleteChild = (id: string) => {
    const newList = list.filter(p => p.id !== id);
    setList(newList);
    onSave(newList);
    if (activeId === id) onSelect(newList[0]?.id ?? null);
  };

  const traditionLabel = (traditions: string[]) => {
    return traditions.map(t => TRADITIONS.find(tr => tr.id === t)?.label ?? t).join(" + ");
  };

  const traditionColor = (traditions: string[]) => {
    if (traditions.length === 1) return TRADITIONS.find(t => t.id === traditions[0])?.color ?? "#6b7280";
    return "#7c3aed"; // purple for multi-tradition
  };

  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "white", borderRadius: 16, padding: 24, width: "100%", maxWidth: 500, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: "bold", color: "#1f2937", fontFamily: "Georgia,serif" }}>My Children</div>
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>Each child gets their own personalized workbook</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#9ca3af", lineHeight: 1 }}>×</button>
        </div>

        {/* Empty state */}
        {list.length === 0 && !editing && (
          <div style={{ textAlign: "center", padding: "28px 0", color: "#9ca3af", fontSize: 14 }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>👶</div>
            No children added yet.<br/>Add your first child to get started!
          </div>
        )}

        {/* Profile list */}
        {list.map(p => (
          <div key={p.id} onClick={() => { onSelect(p.id); onClose(); }}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10,
              border: `2px solid ${activeId === p.id ? "#1f2937" : "#e5e7eb"}`,
              background: activeId === p.id ? "#f9fafb" : "white",
              marginBottom: 8, cursor: "pointer" }}>
            <div style={{ fontSize: 28, width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", background: "#f3f4f6", borderRadius: 10 }}>{p.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "bold", fontSize: 14, color: "#1f2937" }}>{p.name}</div>
              <div style={{ fontSize: 11, color: "#6b7280", marginTop: 1 }}>
                Age {p.age} · <span style={{ color: traditionColor(p.traditions), fontWeight: 600 }}>{traditionLabel(p.traditions)}</span>
                {" · "}{REGIONS.find(r => r.id === p.region)?.flag ?? ""} {REGIONS.find(r => r.id === p.region)?.label ?? p.region}
              </div>
              {p.birthdays.length > 0 && (
                <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 2 }}>
                  {p.birthdays.length} birthday{p.birthdays.length > 1 ? "s" : ""} saved
                </div>
              )}
            </div>
            {activeId === p.id && (
              <div style={{ fontSize: 10, fontWeight: "bold", color: "white", background: "#1f2937", borderRadius: 5, padding: "2px 8px" }}>ACTIVE</div>
            )}
            <button onClick={e => { e.stopPropagation(); openEdit(p); }}
              style={{ background: "none", border: "1.5px solid #e5e7eb", borderRadius: 6, padding: "3px 10px", fontSize: 11, cursor: "pointer", color: "#6b7280", fontWeight: 600 }}>Edit</button>
            <button onClick={e => { e.stopPropagation(); if (window.confirm(`Remove ${p.name}?`)) deleteChild(p.id); }}
              style={{ background: "none", border: "1.5px solid #fca5a5", borderRadius: 6, padding: "3px 8px", fontSize: 11, cursor: "pointer", color: "#ef4444", fontWeight: 600 }}>✕</button>
          </div>
        ))}

        {/* Edit / Add form */}
        {editing ? (
          <div style={{ marginTop: 16, background: "#f9fafb", border: "2px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: "bold", color: "#374151", marginBottom: 12 }}>
              {list.find(p => p.id === editing.id) ? `Editing ${editing.name || "child"}` : "Add a Child"} {editing.emoji}
            </div>

            {/* Name */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10, fontWeight: "bold", color: "#6b7280", marginBottom: 4 }}>CHILD'S NAME</div>
              <input autoFocus value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Asha, Lily, Noah…"
                style={{ width: "100%", padding: "7px 10px", borderRadius: 7, border: "2px solid #e5e7eb", fontSize: 14, boxSizing: "border-box", fontFamily: "Georgia,serif" }} />
            </div>

            {/* Age */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10, fontWeight: "bold", color: "#6b7280", marginBottom: 4 }}>AGE</div>
              <div style={{ display: "flex", gap: 6 }}>
                {[3, 4, 5, 6].map(a => (
                  <button key={a} onClick={() => setForm(f => ({ ...f, age: a }))}
                    style={{ flex: 1, padding: "7px 0", borderRadius: 7, cursor: "pointer", fontSize: 14, fontWeight: "bold",
                      border: `2px solid ${form.age === a ? "#1f2937" : "#e5e7eb"}`,
                      background: form.age === a ? "#1f2937" : "white",
                      color: form.age === a ? "white" : "#374151" }}>{a}</button>
                ))}
              </div>
            </div>

            {/* Traditions (multi-select) */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10, fontWeight: "bold", color: "#6b7280", marginBottom: 4 }}>
                FAITH TRADITIONS <span style={{ fontWeight: "normal", color: "#9ca3af" }}>(select up to 3)</span>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {TRADITIONS.map(t => {
                  const selected = form.traditions.includes(t.id);
                  return (
                    <button key={t.id} onClick={() => toggleTradition(t.id)}
                      style={{ minWidth: 70, padding: "6px 8px", borderRadius: 7, cursor: "pointer", fontSize: 11, fontWeight: "bold",
                        border: `2px solid ${selected ? t.color : "#e5e7eb"}`,
                        background: selected ? t.color : "white",
                        color: selected ? "white" : "#374151" }}>{t.label}</button>
                  );
                })}
              </div>
              {form.traditions.length > 1 && (
                <div style={{ fontSize: 10, color: "#6b7280", marginTop: 4, fontStyle: "italic" }}>
                  Traditions will alternate daily. Major holidays override the cycle.
                </div>
              )}
            </div>

            {/* Region */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10, fontWeight: "bold", color: "#6b7280", marginBottom: 4 }}>REGION</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {REGIONS.map(r => (
                  <button key={r.id} onClick={() => setForm(f => ({ ...f, region: r.id }))}
                    style={{ flex: "1 0 auto", minWidth: 70, padding: "6px 8px", borderRadius: 7, cursor: "pointer", fontSize: 11, fontWeight: "bold",
                      border: `2px solid ${form.region === r.id ? "#1f2937" : "#e5e7eb"}`,
                      background: form.region === r.id ? "#1f2937" : "white",
                      color: form.region === r.id ? "white" : "#374151" }}>{r.flag} {r.label}</button>
                ))}
              </div>
            </div>

            {/* Birthdays */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, fontWeight: "bold", color: "#6b7280", marginBottom: 4 }}>
                BIRTHDAYS <span style={{ fontWeight: "normal", color: "#9ca3af" }}>(family & friends)</span>
              </div>
              {form.birthdays.map(b => (
                <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, padding: "4px 8px", background: "white", borderRadius: 6, border: "1px solid #e5e7eb" }}>
                  <span style={{ flex: 1, fontSize: 12, color: "#374151" }}>{b.name}</span>
                  <span style={{ fontSize: 11, color: "#6b7280" }}>{MONTHS[b.month - 1]} {b.day}</span>
                  <button onClick={() => removeBirthday(b.id)}
                    style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 14, lineHeight: 1 }}>×</button>
                </div>
              ))}
              <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 4 }}>
                <input value={newBday.name} onChange={e => setNewBday(b => ({ ...b, name: e.target.value }))}
                  placeholder="Name (e.g. Nana Jo)"
                  style={{ flex: 1, padding: "5px 8px", borderRadius: 6, border: "1.5px solid #e5e7eb", fontSize: 12, boxSizing: "border-box" }} />
                <select value={newBday.month} onChange={e => setNewBday(b => ({ ...b, month: Number(e.target.value) }))}
                  style={{ padding: "5px 4px", borderRadius: 6, border: "1.5px solid #e5e7eb", fontSize: 11 }}>
                  {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                </select>
                <input type="number" min={1} max={31} value={newBday.day}
                  onChange={e => setNewBday(b => ({ ...b, day: Number(e.target.value) }))}
                  style={{ width: 44, padding: "5px 4px", borderRadius: 6, border: "1.5px solid #e5e7eb", fontSize: 11, textAlign: "center" }} />
                <button onClick={addBirthday} disabled={!newBday.name.trim()}
                  style={{ padding: "5px 10px", borderRadius: 6, border: "none",
                    background: newBday.name.trim() ? "#1f2937" : "#e5e7eb",
                    color: newBday.name.trim() ? "white" : "#9ca3af",
                    fontSize: 11, fontWeight: "bold", cursor: newBday.name.trim() ? "pointer" : "not-allowed" }}>+</button>
              </div>
            </div>

            {/* Save / Cancel */}
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={saveChild} disabled={!form.name.trim()}
                style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "none",
                  background: form.name.trim() ? "#1f2937" : "#e5e7eb",
                  color: form.name.trim() ? "white" : "#9ca3af",
                  fontSize: 13, fontWeight: "bold", cursor: form.name.trim() ? "pointer" : "not-allowed" }}>
                {list.find(p => p.id === editing.id) ? "Save Changes" : "Add Child"}
              </button>
              <button onClick={() => setEditing(null)}
                style={{ padding: "8px 16px", borderRadius: 8, border: "2px solid #e5e7eb", background: "white", color: "#6b7280", fontSize: 13, cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        ) : (
          list.length < 8 && (
            <button onClick={openNew}
              style={{ width: "100%", marginTop: 12, padding: "10px 0", borderRadius: 10, border: "2px dashed #d1d5db", background: "white", color: "#6b7280", fontSize: 13, fontWeight: "bold", cursor: "pointer" }}>
              + Add {list.length === 0 ? "a Child" : "Another Child"}
            </button>
          )
        )}

        {/* Done button */}
        {list.length > 0 && !editing && (
          <button onClick={onClose}
            style={{ width: "100%", marginTop: 10, padding: "9px 0", borderRadius: 10, border: "2px solid #1f2937", background: "#1f2937", color: "white", fontSize: 13, fontWeight: "bold", cursor: "pointer" }}>
            Done
          </button>
        )}
      </div>
    </div>
  );
}
