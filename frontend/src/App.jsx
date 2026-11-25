import React, { useEffect, useMemo, useState } from 'react';
import { Activity, BedDouble, CheckCircle2, ClipboardList, Plus, Search, Pencil, Trash2, LogOut, X, Users } from 'lucide-react';
import { getPatients, createPatient, updatePatient, deletePatient, dischargePatient, errorMessage } from './api';

const options = {
  gender: ['Male', 'Female', 'Other'],
  ward: ['General', 'Private', 'ICU', 'Emergency'],
  department: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Medicine', 'Surgery'],
  doctor: ['Dr. Sharma', 'Dr. Patel', 'Dr. Reddy', 'Dr. Kumar'],
};
const blank = { name: '', age: '', gender: '', ward: '', department: '', doctor: '', admission_date: new Date().toISOString().slice(0, 10), status: 'Admitted' };
const today = new Date().toISOString().slice(0, 10);

function PatientForm({ initial, onClose, onSave, saving }) {
  const [form, setForm] = useState(initial || blank);
  const [error, setError] = useState('');
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  async function submit(e) {
    e.preventDefault(); setError('');
    if (!/^[A-Za-z ]+$/.test(form.name.trim())) return setError('Name must contain letters and spaces only.');
    if (form.age === '' || Number(form.age) < 0 || Number(form.age) > 120 || !Number.isInteger(Number(form.age))) return setError('Age must be a whole number between 0 and 120.');
    if (!form.gender || !form.ward || !form.department || !form.doctor) return setError('Please select gender, ward, department and doctor.');
    if (!form.admission_date || form.admission_date > today) return setError('Admission date is required and cannot be in the future.');
    try { await onSave({ ...form, name: form.name.trim(), age: Number(form.age) }); }
    catch (err) { setError(errorMessage(err)); }
  }
  return <div className="overlay" onMouseDown={e => e.target === e.currentTarget && onClose()}><section className="modal">
    <div className="modal-head"><div><span className="eyebrow">PATIENT RECORD</span><h2>{initial ? 'Edit patient' : 'Add new patient'}</h2></div><button className="icon-btn" onClick={onClose}><X size={19}/></button></div>
    <form onSubmit={submit} className="form-grid">
      <label className="wide">Patient name<input name="name" value={form.name} onChange={change} placeholder="Enter full name" required /></label>
      <label>Age<input name="age" type="number" min="0" max="120" value={form.age} onChange={change} placeholder="Age" required /></label>
      <label>Gender<select name="gender" value={form.gender} onChange={change} required><option value="">Select gender</option>{options.gender.map(x=><option key={x}>{x}</option>)}</select></label>
      <label>Ward<select name="ward" value={form.ward} onChange={change} required><option value="">Select ward</option>{options.ward.map(x=><option key={x}>{x}</option>)}</select></label>
      <label>Department<select name="department" value={form.department} onChange={change} required><option value="">Select department</option>{options.department.map(x=><option key={x}>{x}</option>)}</select></label>
      <label>Doctor<select name="doctor" value={form.doctor} onChange={change} required><option value="">Select doctor</option>{options.doctor.map(x=><option key={x}>{x}</option>)}</select></label>
      <label>Admission date<input name="admission_date" type="date" max={today} value={form.admission_date} onChange={change} required /></label>
      {initial && <label>Status<select name="status" value={form.status} onChange={change}><option>Admitted</option><option>Discharged</option></select></label>}
      {error && <div className="form-error wide">{error}</div>}
      <div className="form-actions wide"><button type="button" className="btn secondary" onClick={onClose}>Cancel</button><button className="btn primary" disabled={saving}>{saving ? 'Saving…' : initial ? 'Save changes' : 'Add patient'}</button></div>
    </form>
  </section></div>;
}

export default function App() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ ward: '', department: '', doctor: '' });
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let alive = true;
    setLoading(true); setError('');
    getPatients({ search, ...Object.fromEntries(Object.entries(filters).filter(([,v])=>v)) })
      .then(r => { if (alive) setPatients(r.data); })
      .catch(e => { if (alive) setError(errorMessage(e)); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [search, filters, refresh]);

  const stats = useMemo(() => ({
    total: patients.length,
    admitted: patients.filter(p=>p.status==='Admitted').length,
    discharged: patients.filter(p=>p.status==='Discharged').length,
    icu: patients.filter(p=>p.ward==='ICU' && p.status==='Admitted').length
  }), [patients]);

  async function save(data) {
    setSaving(true);
    try {
      if (modal?.patient) await updatePatient(modal.patient.id, data);
      else await createPatient(data);
      setModal(null); setRefresh(x=>x+1);
    } finally { setSaving(false); }
  }
  async function remove(p) {
    if (!window.confirm(`Delete the record for ${p.name}? This action cannot be undone.`)) return;
    try { await deletePatient(p.id); setRefresh(x=>x+1); } catch(e) { alert(errorMessage(e)); }
  }
  async function discharge(p) {
    if (!window.confirm(`Mark ${p.name} as discharged?`)) return;
    try { await dischargePatient(p.id); setRefresh(x=>x+1); } catch(e) { alert(errorMessage(e)); }
  }
  const setFilter = (key, value) => setFilters(old=>({...old,[key]:value}));
  return <div className="app-shell">
    <aside className="sidebar"><div className="brand"><div className="brand-icon"><Activity size={22}/></div><div>CareDesk<span>HOSPITAL MANAGEMENT</span></div></div><div className="side-label">WORKSPACE</div><div className="nav-item active"><Users size={18}/> Patient admissions</div><div className="side-note"><div className="pulse"></div><div><b>System operational</b><span>Patient records workspace</span></div></div><div className="sidebar-bottom">CareDesk <span>·</span> Admission console</div></aside>
    <main className="main"><header className="topbar"><div><span className="eyebrow">HOSPITAL OPERATIONS / PATIENTS</span><h1>Patient admissions</h1></div><button className="btn primary" onClick={()=>setModal({patient:null})}><Plus size={17}/> Add patient</button></header>
      <div className="intro"><div><h2>Patient overview</h2><p>Manage admissions, care assignments and discharge status.</p></div><span className="date-chip"><ClipboardList size={15}/> Live records</span></div>
      <section className="stats">
        <div className="stat-card"><div className="stat-icon blue"><Users size={19}/></div><span>Total patients</span><strong>{stats.total}</strong><small>Matching current filters</small></div>
        <div className="stat-card"><div className="stat-icon green"><Activity size={19}/></div><span>Admitted</span><strong>{stats.admitted}</strong><small>Currently in hospital</small></div>
        <div className="stat-card"><div className="stat-icon purple"><CheckCircle2 size={19}/></div><span>Discharged</span><strong>{stats.discharged}</strong><small>Completed admissions</small></div>
        <div className="stat-card"><div className="stat-icon orange"><BedDouble size={19}/></div><span>ICU patients</span><strong>{stats.icu}</strong><small>Currently admitted in ICU</small></div>
      </section>
      <section className="panel"><div className="panel-head"><div><h2>All patients</h2><p>Search and filter patient records</p></div><span className="count">{patients.length} records</span></div>
        <div className="toolbar"><div className="search-box"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by patient name…"/></div>
          <select value={filters.ward} onChange={e=>setFilter('ward',e.target.value)}><option value="">All wards</option>{options.ward.map(x=><option key={x}>{x}</option>)}</select>
          <select value={filters.department} onChange={e=>setFilter('department',e.target.value)}><option value="">All departments</option>{options.department.map(x=><option key={x}>{x}</option>)}</select>
          <select value={filters.doctor} onChange={e=>setFilter('doctor',e.target.value)}><option value="">All doctors</option>{options.doctor.map(x=><option key={x}>{x}</option>)}</select>
          <button className="btn secondary reset" onClick={()=>{setSearch('');setFilters({ward:'',department:'',doctor:''});}}>Reset</button>
        </div>
        {error && <div className="error-banner">{error}</div>}
        <div className="table-wrap"><table><thead><tr><th>PATIENT</th><th>AGE / GENDER</th><th>WARD</th><th>DEPARTMENT</th><th>DOCTOR</th><th>ADMISSION DATE</th><th>STATUS</th><th>ACTIONS</th></tr></thead>
          <tbody>{loading ? <tr><td colSpan="8" className="empty">Loading patient records…</td></tr> : patients.length===0 ? <tr><td colSpan="8" className="empty"><div className="empty-icon"><Users size={23}/></div><b>No patients found</b><span>Add a patient or adjust your search filters.</span></td></tr> : patients.map(p=><tr key={p.id}><td><div className="patient-cell"><div className="avatar">{p.name.split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase()}</div><b>{p.name}</b></div></td><td>{p.age} yrs · {p.gender}</td><td><span className="ward-tag">{p.ward}</span></td><td>{p.department}</td><td>{p.doctor}</td><td>{p.admission_date}</td><td><span className={`status ${p.status.toLowerCase()}`}>{p.status}</span></td><td><div className="actions"><button title="Edit patient" className="icon-btn" onClick={()=>setModal({patient:p})}><Pencil size={16}/></button>{p.status==='Admitted' && <button title="Mark discharged" className="icon-btn discharge" onClick={()=>discharge(p)}><LogOut size={16}/></button>}<button title="Delete patient" className="icon-btn danger" onClick={()=>remove(p)}><Trash2 size={16}/></button></div></td></tr>)}</tbody></table></div>
      </section><footer>CareDesk Patient Admission Management <span>·</span> Secure clinical workflow</footer>
    </main>
    {modal && <PatientForm initial={modal.patient || null} onClose={()=>setModal(null)} onSave={save} saving={saving}/>}
  </div>;
}
