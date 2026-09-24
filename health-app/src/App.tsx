import React, { useState } from "react";
import { createRoot } from "react-dom/client";

type Symptom = {
  id: number;
  type: string;
  severity: number;
  notes: string;
  time: Date;
};

type Contact = { id: number; name: string; relation: string; phone: string };

type Patient = {
  id: number;
  name: string;
  gender: string;
  age: string;
  dob: string;
  contacts: Contact[];
  symptoms: Symptom[];
};

const SYMPTOM_TYPES = ["Vomiting", "Running stomach", "Nausea", "Stomach pain", "Other"];

// --- Patient List Screen ---
function PatientList({ patients, onSelect, onCreate }: {
  patients: Patient[];
  onSelect: (p: Patient) => void;
  onCreate: () => void;
}) {
  return (
    <div className="top-clearance bottom-clearance px-4 min-h-screen bg-gray-50">
      <div className="max-w-md w-full mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Symptom Tracker</h1>
          <p className="text-sm text-gray-500">Select a patient or create a new one</p>
        </div>
        <button
          onClick={onCreate}
          className="w-full py-3 mb-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          + New Patient
        </button>
        {patients.length === 0 ? (
          <p className="text-center text-gray-400 py-12">No patients saved yet.</p>
        ) : (
          <div className="space-y-3">
            {patients.map(p => (
              <button
                key={p.id}
                onClick={() => onSelect(p)}
                className="w-full text-left bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition"
              >
                <p className="font-semibold text-gray-800">{p.name}</p>
                <p className="text-xs text-gray-400">
                  {[p.gender, p.age ? `Age ${p.age}` : "", p.dob ? `DOB: ${new Date(p.dob).toLocaleDateString([], { dateStyle: "medium" })}` : ""].filter(Boolean).join(" · ")}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{p.symptoms.length} symptom{p.symptoms.length !== 1 ? "s" : ""} logged</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Patient Detail Screen ---
function PatientDetail({ initial, onSave, onBack }: {
  initial: Patient;
  onSave: (p: Patient) => void;
  onBack: () => void;
}) {
  const [patient, setPatient] = useState<Patient>(initial);
  const [view, setView] = useState<"profile" | "log" | "history" | "summary">("profile");

  // Profile fields
  const [name, setName] = useState(initial.name);
  const [gender, setGender] = useState(initial.gender);
  const [age, setAge] = useState(initial.age);
  const [dob, setDob] = useState(initial.dob);

  // Contacts
  const [contacts, setContacts] = useState<Contact[]>(initial.contacts);
  const [cName, setCName] = useState("");
  const [cRelation, setCRelation] = useState("");
  const [cPhone, setCPhone] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  // Symptoms
  const [symptoms, setSymptoms] = useState<Symptom[]>(initial.symptoms);
  const [type, setType] = useState(SYMPTOM_TYPES[0]);
  const [severity, setSeverity] = useState(3);
  const [notes, setNotes] = useState("");
  const [occurredAt, setOccurredAt] = useState(() => new Date().toISOString().slice(0, 16));

  const [saved, setSaved] = useState(!!initial.name);
  const [saveFlash, setSaveFlash] = useState(false);

  function saveProfile() {
    if (!name.trim()) return;
    const updated: Patient = { ...patient, name, gender, age, dob, contacts, symptoms };
    setPatient(updated);
    setSaved(true);
    onSave(updated);
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 1500);
    setView("log");
  }

  function persistSymptoms(next: Symptom[]) {
    setSymptoms(next);
    const updated: Patient = { ...patient, name, gender, age, dob, contacts, symptoms: next };
    setPatient(updated);
    onSave(updated);
  }

  function persistContacts(next: Contact[]) {
    setContacts(next);
    const updated: Patient = { ...patient, name, gender, age, dob, contacts: next, symptoms };
    setPatient(updated);
    onSave(updated);
  }

  function addContact() {
    if (!cName.trim() || !cPhone.trim()) return;
    let next: Contact[];
    if (editingId !== null) {
      next = contacts.map(c => c.id === editingId ? { ...c, name: cName, relation: cRelation, phone: cPhone } : c);
      setEditingId(null);
    } else {
      next = [...contacts, { id: Date.now(), name: cName, relation: cRelation, phone: cPhone }];
    }
    setCName(""); setCRelation(""); setCPhone("");
    persistContacts(next);
  }

  function startEdit(c: Contact) {
    setEditingId(c.id); setCName(c.name); setCRelation(c.relation); setCPhone(c.phone);
  }

  function cancelEdit() {
    setEditingId(null); setCName(""); setCRelation(""); setCPhone("");
  }

  function removeContact(id: number) {
    persistContacts(contacts.filter(c => c.id !== id));
    if (editingId === id) cancelEdit();
    setConfirmDeleteId(null);
  }

  function logSymptom() {
    const next = [{ id: Date.now(), type, severity, notes, time: new Date(occurredAt) }, ...symptoms];
    persistSymptoms(next);
    setNotes(""); setSeverity(3); setOccurredAt(new Date().toISOString().slice(0, 16));
    setView("history");
  }

  function formatTime(d: Date) {
    return new Date(d).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
  }

  function severityLabel(s: number) {
    if (s <= 2) return "Mild";
    if (s <= 3) return "Moderate";
    return "Severe";
  }

  function severityColor(s: number) {
    if (s <= 2) return "bg-yellow-100 text-yellow-800";
    if (s <= 3) return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-800";
  }

  return (
    <div className="top-clearance bottom-clearance px-4 min-h-screen bg-gray-50">
      <div className="max-w-md w-full mx-auto">
        {/* Header */}
        <div className="mb-4 flex items-center gap-3">
          <button onClick={onBack} className="text-blue-600 text-sm hover:underline">← Patients</button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">{saved ? name : "New Patient"}</h1>
            <p className="text-xs text-gray-400">Symptom Tracker</p>
          </div>
          {saveFlash && <span className="ml-auto text-xs text-green-600 font-medium">Saved ✓</span>}
        </div>

        {/* Tabs */}
        <div className="flex rounded-lg overflow-hidden border border-gray-200 mb-6">
          {(["profile", "log", "history", "summary"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setView(tab)}
              className={`flex-1 py-2 text-xs font-medium capitalize transition ${
                view === tab ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* PROFILE */}
        {view === "profile" && (
          <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Mammuso Dlamini"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select value={gender} onChange={e => setGender(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm">
                <option value="">Select gender</option>
                <option>Female</option><option>Male</option><option>Non-binary</option><option>Prefer not to say</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="e.g. 32" min={0} max={120}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input type="date" value={dob} onChange={e => setDob(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm" />
            </div>
            <button onClick={saveProfile} disabled={!name.trim()}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed">
              Save Profile
            </button>

            {/* Emergency Contacts */}
            <div className="pt-2 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Emergency Contacts</h3>
              {contacts.length > 0 && (
                <div className="space-y-2 mb-3">
                  {contacts.map(c => (
                    <div key={c.id} className={`rounded-lg px-3 py-2 ${editingId === c.id ? "bg-blue-50 border border-blue-200" : "bg-gray-50"}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-800">{c.name} {c.relation && <span className="text-gray-400 font-normal">· {c.relation}</span>}</p>
                          <p className="text-xs text-gray-500">{c.phone}</p>
                        </div>
                        <div className="flex gap-2 ml-2">
                          <button onClick={() => { setConfirmDeleteId(null); startEdit(c); }} className="text-blue-400 hover:text-blue-600 text-xs" aria-label="Edit contact">✏️</button>
                          <button onClick={() => setConfirmDeleteId(confirmDeleteId === c.id ? null : c.id)} className="text-red-400 hover:text-red-600 text-xs" aria-label="Delete contact">✕</button>
                        </div>
                      </div>
                      {confirmDeleteId === c.id && (
                        <div className="mt-2 flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                          <p className="text-xs text-red-700 flex-1">Remove {c.name}?</p>
                          <button onClick={() => removeContact(c.id)} className="text-xs px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition">Yes, remove</button>
                          <button onClick={() => setConfirmDeleteId(null)} className="text-xs px-2 py-1 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-100 transition">Cancel</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <div className="space-y-2">
                {editingId !== null && <p className="text-xs text-blue-600 font-medium">Editing contact — make changes below</p>}
                <input type="text" value={cName} onChange={e => setCName(e.target.value)} placeholder="Contact name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm" />
                <input type="text" value={cRelation} onChange={e => setCRelation(e.target.value)} placeholder="Relationship (e.g. Mother, Husband)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm" />
                <input type="tel" value={cPhone} onChange={e => setCPhone(e.target.value)} placeholder="Phone number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm" />
                <div className="flex gap-2">
                  <button onClick={addContact} disabled={!cName.trim() || !cPhone.trim()}
                    className="flex-1 py-2 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition disabled:opacity-40 disabled:cursor-not-allowed text-sm">
                    {editingId !== null ? "Save Changes" : "+ Add Contact"}
                  </button>
                  {editingId !== null && (
                    <button onClick={cancelEdit} className="px-4 py-2 border border-gray-300 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition text-sm">Cancel</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LOG */}
        {view === "log" && (
          <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Symptom</label>
              <select value={type} onChange={e => setType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                {SYMPTOM_TYPES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Severity — <span className="font-semibold">{severityLabel(severity)}</span></label>
              <input type="range" min={1} max={5} value={severity} onChange={e => setSeverity(Number(e.target.value))} className="w-full accent-blue-600" />
              <div className="flex justify-between text-xs text-gray-400 mt-1"><span>Mild</span><span>Moderate</span><span>Severe</span></div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">When did it happen?</label>
              <input type="datetime-local" value={occurredAt} onChange={e => setOccurredAt(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g. happened after eating, lasted 20 mins..." rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none text-sm" />
            </div>
            <button onClick={logSymptom} className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">Log Symptom</button>
          </div>
        )}

        {/* HISTORY */}
        {view === "history" && (
          <div className="space-y-3">
            {symptoms.length === 0 ? (
              <div className="text-center text-gray-400 py-12">No symptoms logged yet.</div>
            ) : symptoms.map(s => (
              <div key={s.id} className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-gray-800">{s.type}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${severityColor(s.severity)}`}>{severityLabel(s.severity)}</span>
                </div>
                <p className="text-xs text-gray-400 mb-1">{formatTime(s.time)}</p>
                {s.notes && <p className="text-sm text-gray-600 italic">"{s.notes}"</p>}
              </div>
            ))}
          </div>
        )}

        {/* SUMMARY */}
        {view === "summary" && (
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h2 className="font-bold text-gray-800 text-lg mb-1">Doctor Summary</h2>
            <p className="text-xs text-gray-400 mb-4">Show this at your appointment</p>
            {saved && (
              <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm text-gray-700 space-y-1">
                <p><span className="font-medium">Name:</span> {name}</p>
                {gender && <p><span className="font-medium">Gender:</span> {gender}</p>}
                {age && <p><span className="font-medium">Age:</span> {age}</p>}
                {dob && <p><span className="font-medium">DOB:</span> {new Date(dob).toLocaleDateString([], { dateStyle: "medium" })}</p>}
              </div>
            )}
            {contacts.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Emergency Contacts</p>
                <div className="space-y-1">
                  {contacts.map(c => (
                    <div key={c.id} className="flex justify-between text-sm bg-red-50 rounded-lg px-3 py-2">
                      <span className="font-medium text-gray-800">{c.name} {c.relation && <span className="text-gray-400 font-normal">· {c.relation}</span>}</span>
                      <span className="text-gray-600">{c.phone}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {symptoms.length === 0 ? (
              <p className="text-gray-400 text-sm">No symptoms logged yet.</p>
            ) : (
              <>
                <p className="text-sm text-gray-600 mb-3">
                  <span className="font-semibold">{symptoms.length}</span> symptom{symptoms.length > 1 ? "s" : ""} logged between{" "}
                  <span className="font-semibold">{formatTime(symptoms[symptoms.length - 1].time)}</span> and{" "}
                  <span className="font-semibold">{formatTime(symptoms[0].time)}</span>.
                </p>
                <div className="space-y-2">
                  {symptoms.map(s => (
                    <div key={s.id} className="border-l-4 border-blue-400 pl-3 py-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-800">{s.type}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${severityColor(s.severity)}`}>{severityLabel(s.severity)}</span>
                      </div>
                      <p className="text-xs text-gray-400">{formatTime(s.time)}</p>
                      {s.notes && <p className="text-xs text-gray-500 italic mt-0.5">"{s.notes}"</p>}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-4 border-t pt-3">⚠️ This is a personal symptom log, not a medical diagnosis.</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Root App ---
const emptyPatient = (): Patient => ({ id: Date.now(), name: "", gender: "", age: "", dob: "", contacts: [], symptoms: [] });

export default function App() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [active, setActive] = useState<Patient | null>(null);

  function savePatient(p: Patient) {
    setPatients(prev => {
      const exists = prev.find(x => x.id === p.id);
      return exists ? prev.map(x => x.id === p.id ? p : x) : [...prev, p];
    });
  }

  if (active) {
    return (
      <PatientDetail
        initial={active}
        onSave={p => { savePatient(p); setActive(p); }}
        onBack={() => setActive(null)}
      />
    );
  }

  return (
    <PatientList
      patients={patients}
      onSelect={p => setActive(p)}
      onCreate={() => setActive(emptyPatient())}
    />
  );
}

createRoot(document.getElementById("root")!).render(<App />);
