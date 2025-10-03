import { useState } from 'react';
import { get, set, ref } from "firebase/database";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { realtimeDb } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";

const CATEGORY_CODES = {
  garbage: 'GBG',
  streetlight: 'SLT',
  roaddamage: 'RDG',
  water: 'WTR',
  drainage: 'DRN',
};

const DEPARTMENT_DISPLAY_MAP = {
  garbage: "Garbage",
  streetlight: "Streetlight",
  roaddamage: "Road Damage",
  water: "Water",
  drainage: "Drainage & Sewerage"
};

export default function CreateDepartmentHead() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    department: '',
  });
  const [headId, setHeadId] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Generate department head ID by counting heads in department
  const generateHeadId = async (department) => {
    const code = CATEGORY_CODES[department] || (department ? department.substring(0,3).toUpperCase() : 'GEN');
    const headsRef = ref(realtimeDb, `department_heads/${department}`);
    const snap = await get(headsRef);
    const count = snap.exists() ? Object.keys(snap.val()).length : 0;
    const num = String(count + 1).padStart(3, '0');
    return `${code}${num}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const id = await generateHeadId(form.department);
      setHeadId(id);

      const headData = {
        ...form,
        headId: id,
        department: DEPARTMENT_DISPLAY_MAP[form.department], // Store display name
      };

      // Store under department_heads/{Department Display Name}/{headId}
      await set(ref(realtimeDb, `department_heads/${DEPARTMENT_DISPLAY_MAP[form.department]}/${id}`), headData);

      setLoading(false);
      setShowSuccess(true);
    } catch (err) {
      setError('Failed to create department head.');
      setLoading(false);
      console.error('Create department head error:', err);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto mt-8 p-4 sm:p-8 bg-[#f6f6f6] rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-0">
        <h2 className="text-3xl font-bold mb-2 text-center text-primary">Create Department Head</h2>
        <p className="text-center text-muted-foreground mb-6">Fill out the form below to add a new department head.</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">Email</label>
            <Input id="email" name="email" value={form.email} onChange={handleChange} required type="email" className="w-full bg-[#f6f6f6]" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">Password</label>
            <Input id="password" name="password" value={form.password} onChange={handleChange} required type="password" className="w-full bg-[#f6f6f6]" />
          </div>
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-foreground mb-1">Department</label>
            <select
              id="department"
              name="department"
              value={form.department}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-primary bg-[#f6f6f6]"
            >
              <option value="">Select Department</option>
              <option value="garbage">Garbage</option>
              <option value="streetlight">Streetlight</option>
              <option value="roaddamage">Road Damage</option>
              <option value="water">Water</option>
              <option value="drainage">Drainage & Sewerage</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-foreground">Department Head ID</label>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">(Auto-generated after submission)</span>
              {headId && (
                <span className="text-green-600 font-mono text-sm">Head ID: {headId}</span>
              )}
            </div>
          </div>
          {showSuccess && headId && (
            <div className="mt-4 p-4 rounded bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-center">
              Department Head created successfully!<br />
              <span className="block mt-2 font-mono">Head ID: <span className="text-green-700 dark:text-green-300">{headId}</span></span>
            </div>
          )}
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <Button type="submit" disabled={loading} className="mx-auto block">
            {loading ? "Creating..." : "Create Department Head"}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
}