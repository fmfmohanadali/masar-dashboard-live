import { useEffect, useMemo, useState } from 'react';
import {
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  Send,
  CreditCard,
  Truck,
  CalendarDays,
  QrCode,
  X,
  Copy,
  BadgeCheck,
} from 'lucide-react';

import { api } from '../api';
import PageShell from '../components/PageShell';
import LoadingCard from '../components/LoadingCard';

/* =========================
   Status & Flow Definitions
   ========================= */

const statusMap = {
  DRAFT: { label: 'مسودة', cls: 'bg-slate-100 text-slate-600' },
  VERIFIED: { label: 'تم التحقق', cls: 'bg-blue-50 text-blue-600' },
  OFFERS_SENT: { label: 'عروض مرسلة', cls: 'bg-amber-50 text-amber-600' },
  CARRIER_SELECTED: { label: 'شركة محددة', cls: 'bg-cyan-50 text-cyan-700' },
  PAID: { label: 'مدفوع', cls: 'bg-emerald-50 text-emerald-600' },
  DRIVER_ASSIGNED: { label: 'سائق مخصص', cls: 'bg-violet-50 text-violet-600' },
  PORT_SLOT_BOOKED: { label: 'موعد محجوز', cls: 'bg-indigo-50 text-indigo-600' },
  QR_ISSUED: { label: 'QR صادر', cls: 'bg-green-50 text-green-700' },
  COMPLETED: { label: 'مكتمل', cls: 'bg-emerald-100 text-emerald-700' },
  CANCELLED: { label: 'ملغى', cls: 'bg-red-50 text-red-600' },
};

const flowSteps = [
  { key: 'DRAFT', label: 'مسودة' },
  { key: 'VERIFIED', label: 'تحقق' },
  { key: 'OFFERS_SENT', label: 'عروض' },
  { key: 'CARRIER_SELECTED', label: 'اختيار' },
  { key: 'PAID', label: 'دفع' },
  { key: 'DRIVER_ASSIGNED', label: 'سائق' },
  { key: 'PORT_SLOT_BOOKED', label: 'موعد' },
  { key: 'QR_ISSUED', label: 'QR' },
  { key: 'COMPLETED', label: 'مكتمل' },
];

const initialForm = {
  container_no: '',
  bl_no: '',
  vessel_name: '',
  release_date: '',
  arrival_port: '',
  destination: '',
  notes: '',
};

/* =========================
   Page Component
   ========================= */

export default function TransportRequestsPage() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [form, setForm] = useState(initialForm);
  const [showCreate, setShowCreate] = useState(false);

  const [offerForm, setOfferForm] = useState({
    carrier_company: '',
    price: '',
    estimated_pickup_at: '',
    note: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function load() {
    setLoading(true);
    setError('');

    try {
      const res = await api.get('/transport-requests/');
      const data = Array.isArray(res.data?.results)
        ? res.data.results
        : Array.isArray(res.data)
        ? res.data
        : [];
      setItems(data);

      if (selected) {
        const fresh = data.find((x) => x.id === selected.id);
        setSelected(fresh || null);
      }
    } catch (err) {
      setError(err?.response?.data?.detail || 'تعذر تحميل طلبات النقل');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      const okStatus = !statusFilter || item.status === statusFilter;
      const okSearch =
        !q ||
        String(item.container_no || '').toLowerCase().includes(q) ||
        String(item.bl_no || '').toLowerCase().includes(q) ||
        String(item.vessel_name || '').toLowerCase().includes(q) ||
        String(item.destination || '').toLowerCase().includes(q) ||
        String(item.requester_username || '').toLowerCase().includes(q);
      return okStatus && okSearch;
    });
  }, [items, search, statusFilter]);

  const stats = useMemo(() => {
    const total = items.length;
    const active = items.filter((x) =>
      [
        'VERIFIED',
        'OFFERS_SENT',
        'CARRIER_SELECTED',
        'PAID',
        'DRIVER_ASSIGNED',
        'PORT_SLOT_BOOKED',
        'QR_ISSUED',
      ].includes(x.status)
    ).length;
    const completed = items.filter((x) => x.status === 'COMPLETED').length;
    const qrIssued = items.filter((x) => x.status === 'QR_ISSUED').length;
    return { total, active, completed, qrIssued };
  }, [items]);

  function updateForm(key, value) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function updateOfferForm(key, value) {
    setOfferForm((p) => ({ ...p, [key]: value }));
  }

  async function createRequest(e) {
    e.preventDefault();
    if (!form.container_no || !form.destination) {
      setError('رقم الحاوية والوجهة حقول مطلوبة');
      return;
    }
    setSaving(true);
    setError('');
    setNotice('');
    try {
      await api.post('/transport-requests/', cleanPayload(form));
      setForm(initialForm);
      setShowCreate(false);
      setNotice('تم إنشاء طلب النقل بنجاح');
      await load();
    } catch (err) {
      setError(err?.response?.data?.detail || 'تعذر إنشاء طلب النقل');
    } finally {
      setSaving(false);
    }
  }

  async function runAction(id, action, body = {}) {
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const res = await api.post(`/transport-requests/${id}/${action}/`, body);
      setSelected(res.data);
      setNotice('تم تنفيذ الإجراء بنجاح');
      await load();
    } catch (err) {
      setError(err?.response?.data?.detail || 'تعذر تنفيذ الإجراء');
    } finally {
      setSaving(false);
    }
  }

  async function createOffer(e) {
    e.preventDefault();
    if (!selected?.id) return;
    if (!offerForm.carrier_company || !offerForm.price) {
      setError('شركة النقل والسعر مطلوبان');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await api.post('/transport-offers/', {
        request: selected.id,
        carrier_company: Number(offerForm.carrier_company),
        price: offerForm.price,
        estimated_pickup_at: offerForm.estimated_pickup_at || null,
        note: offerForm.note || '',
      });
      setOfferForm({ carrier_company: '', price: '', estimated_pickup_at: '', note: '' });
      await load();
    } catch (err) {
      setError(err?.response?.data?.detail || 'تعذر إضافة العرض');
    } finally {
      setSaving(false);
    }
  }

  async function copy(text) {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setNotice('تم النسخ');
  }

  return (
    <PageShell
      title="طلبات النقل"
      subtitle="إدارة Workflow طلبات النقل من الإفراج حتى إصدار QR"
      actions={
        <>
          <button onClick={load} className="btn-secondary">
            <RefreshCw size={16} /> تحديث
          </button>
          <button onClick={() => setShowCreate((v) => !v)} className="btn-primary">
            <Plus size={16} /> طلب جديد
          </button>
        </>
      }
    >
      {error && <Alert type="error" text={error} />}
      {notice && <Alert type="success" text={notice} />}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MiniStat label="الإجمالي" value={stats.total} />
        <MiniStat label="قيد التنفيذ" value={stats.active} />
        <MiniStat label="QR صادرة" value={stats.qrIssued} />
        <MiniStat label="مكتملة" value={stats.completed} />
      </div>

      {showCreate && (
        <CreateRequestForm
          form={form}
          saving={saving}
          onChange={updateForm}
          onSubmit={createRequest}
          onCancel={() => setShowCreate(false)}
        />
      )}

      <div className="bg-white rounded-xl p-4 border mt-4">
        <div className="flex gap-3">
          <input
            className="input flex-1"
            placeholder="بحث"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="input"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">كل الحالات</option>
            {Object.entries(statusMap).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingCard text="جاري التحميل..." />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 mt-4">
          <div className="xl:col-span-7 space-y-3">
            {filtered.map((item) => (
              <RequestCard
                key={item.id}
                item={item}
                active={selected?.id === item.id}
                onSelect={() => setSelected(item)}
              />
            ))}
          </div>

          <div className="xl:col-span-5">
            <RequestDetails
              item={selected}
              saving={saving}
              offerForm={offerForm}
              onClose={() => setSelected(null)}
              onVerify={() => runAction(selected.id, 'verify')}
              onSendOffers={() => runAction(selected.id, 'send_offers')}
              onCreateOffer={createOffer}
              onOfferChange={updateOfferForm}
              onSelectOffer={(id) => runAction(selected.id, 'select_offer', { offer_id: id })}
              onMarkPaid={() =>
                runAction(selected.id, 'mark_paid', {
                  amount: selected?.agreed_price,
                  method: 'manual',
                })
              }
              onAssignDriver={() =>
                runAction(selected.id, 'assign_driver', {
                  driver_id: Number(prompt('ID السائق')),
                  truck_id: Number(prompt('ID الشاحنة')),
                })
              }
              onBookSlot={() =>
                runAction(selected.id, 'book_slot', {
                  slot_id: Number(prompt('ID الموعد')),
                })
              }
              onIssueQr={() => runAction(selected.id, 'issue_qr')}
              onCopy={copy}
            />
          </div>
        </div>
      )}
    </PageShell>
  );
}

/* =========================
   UI Helpers
   ========================= */

function Alert({ type, text }) {
  const cls =
    type === 'error'
      ? 'bg-red-50 border-red-200 text-red-700'
      : 'bg-emerald-50 border-emerald-200 text-emerald-700';
  return <div className={`border rounded-lg p-3 text-sm ${cls}`}>{text}</div>;
}

function MiniStat({ label, value }) {
  return (
    <div className="bg-white border rounded-xl p-4">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  );
}

function RequestCard({ item, active, onSelect }) {
  const st = statusMap[item.status] || {};
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-right bg-white border rounded-xl p-4 ${
        active ? 'ring-2 ring-blue-400' : ''
      }`}
    >
      <div className="flex justify-between mb-2">
        <div className="font-bold">{item.container_no}</div>
        <span className={`px-2 py-1 text-xs rounded ${st.cls}`}>{st.label}</span>
      </div>
      <div className="text-sm text-slate-500">{item.destination}</div>
    </button>
  );
}

function RequestDetails({
  item,
  saving,
  offerForm,
  onClose,
  onVerify,
  onSendOffers,
  onCreateOffer,
  onOfferChange,
  onSelectOffer,
  onMarkPaid,
  onAssignDriver,
  onBookSlot,
  onIssueQr,
  onCopy,
}) {
  if (!item) {
    return (
      <div className="bg-white border rounded-xl p-6 text-center text-slate-400">
        اختر طلبًا لعرض التفاصيل
      </div>
    );
  }

  const st = statusMap[item.status] || {};

  return (
    <div className="bg-white border rounded-xl p-4 space-y-4">
      <div className="flex justify-between">
        <div className="font-bold">{item.container_no}</div>
        <button onClick={onClose}>
          <X size={16} />
        </button>
      </div>

      <span className={`px-3 py-1 text-xs rounded ${st.cls}`}>{st.label}</span>

      <FlowTracker status={item.status} />

      <div className="grid grid-cols-2 gap-2 text-sm">
        <Info label="الوجهة" value={item.destination} />
        <Info label="السعر" value={item.agreed_price || '-'} />
        <Info label="شركة النقل" value={item.selected_carrier_name || '-'} />
        <Info label="الموعد" value={item.slot_label || '-'} />
      </div>

      <ActionButtons
        status={item.status}
        saving={saving}
        onVerify={onVerify}
        onSendOffers={onSendOffers}
        onMarkPaid={onMarkPaid}
        onAssignDriver={onAssignDriver}
        onBookSlot={onBookSlot}
        onIssueQr={onIssueQr}
      />

      <OffersPanel
        offers={item.offers || []}
        offerForm={offerForm}
        saving={saving}
        onCreateOffer={onCreateOffer}
        onOfferChange={onOfferChange}
        onSelectOffer={onSelectOffer}
      />

      {item.qr_token && (
        <div className="border rounded-lg p-3 bg-emerald-50">
          <div className="flex items-center gap-2 mb-2">
            <QrCode size={16} /> QR Token
          </div>
          <code className="block text-xs break-all bg-white p-2 rounded">
            {item.qr_token}
          </code>
          <button onClick={() => onCopy(item.qr_token)} className="btn-primary mt-2">
            <Copy size={14} /> نسخ
          </button>
        </div>
      )}
    </div>
  );
}

function ActionButtons({
  status,
  saving,
  onVerify,
  onSendOffers,
  onMarkPaid,
  onAssignDriver,
  onBookSlot,
  onIssueQr,
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Btn disabled={saving || status !== 'DRAFT'} onClick={onVerify} icon={CheckCircle2} text="تحقق" />
      <Btn
        disabled={saving || status !== 'VERIFIED'}
        onClick={onSendOffers}
        icon={Send}
        text="إرسال عروض"
      />
      <Btn
        disabled={saving || status !== 'CARRIER_SELECTED'}
        onClick={onMarkPaid}
        icon={CreditCard}
        text="دفع"
      />
      <Btn
        disabled={saving || status !== 'PAID'}
        onClick={onAssignDriver}
        icon={Truck}
        text="سائق"
      />
      <Btn
        disabled={saving || status !== 'DRIVER_ASSIGNED'}
        onClick={onBookSlot}
        icon={CalendarDays}
        text="موعد"
      />
      <Btn
        disabled={saving || status !== 'PORT_SLOT_BOOKED'}
        onClick={onIssueQr}
        icon={QrCode}
        text="QR"
      />
    </div>
  );
}

function Btn({ disabled, onClick, icon: Icon, text }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="btn-primary disabled:opacity-40"
    >
      <Icon size={14} /> {text}
    </button>
  );
}

function OffersPanel({ offers, offerForm, saving, onCreateOffer, onOfferChange, onSelectOffer }) {
  return (
    <div className="border rounded-xl p-3">
      <div className="font-bold mb-2">العروض</div>

      <form onSubmit={onCreateOffer} className="grid grid-cols-2 gap-2 mb-3">
        <input
          className="input"
          placeholder="ID شركة النقل"
          value={offerForm.carrier_company}
          onChange={(e) => onOfferChange('carrier_company', e.target.value)}
        />
        <input
          className="input"
          placeholder="السعر"
          type="number"
          value={offerForm.price}
          onChange={(e) => onOfferChange('price', e.target.value)}
        />
        <button className="btn-primary col-span-2" disabled={saving}>
          إضافة عرض
        </button>
      </form>

      <div className="space-y-2">
        {offers.map((o) => (
          <div key={o.id} className="flex justify-between items-center bg-slate-50 p-2 rounded">
            <div>
              <div className="font-semibold">{o.carrier_company_name}</div>
              <div className="text-xs">{o.price}</div>
            </div>
            <button
              onClick={() => onSelectOffer(o.id)}
              disabled={o.status === 'ACCEPTED'}
              className="btn-primary"
            >
              <BadgeCheck size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function FlowTracker({ status }) {
  const idx = flowSteps.findIndex((s) => s.key === status);
  return (
    <div className="flex flex-wrap gap-1">
      {flowSteps.map((s, i) => (
        <span
          key={s.key}
          className={`px-2 py-1 text-xs rounded ${
            i < idx ? 'bg-emerald-100 text-emerald-700' : i === idx ? 'bg-blue-600 text-white' : 'bg-slate-100'
          }`}
        >
          {s.label}
        </span>
      ))}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="text-xs">
      <span className="text-slate-400">{label}: </span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function CreateRequestForm({ form, saving, onChange, onSubmit, onCancel }) {
  return (
    <form onSubmit={onSubmit} className="bg-white border rounded-xl p-4 space-y-3">
      <div className="flex justify-between">
        <div className="font-bold">طلب جديد</div>
        <button type="button" onClick={onCancel}>
          <X size={16} />
        </button>
      </div>

      <input
        className="input"
        placeholder="رقم الحاوية"
        value={form.container_no}
        onChange={(e) => onChange('container_no', e.target.value)}
        required
      />
      <input
        className="input"
        placeholder="رقم البوليصة"
        value={form.bl_no}
        onChange={(e) => onChange('bl_no', e.target.value)}
      />
      <input
        className="input"
        placeholder="الوجهة"
        value={form.destination}
        onChange={(e) => onChange('destination', e.target.value)}
        required
      />
      <textarea
        className="input"
        placeholder="ملاحظات"
        value={form.notes}
        onChange={(e) => onChange('notes', e.target.value)}
      />

      <div className="flex gap-2">
        <button className="btn-primary" disabled={saving}>
          حفظ
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          إلغاء
        </button>
      </div>
    </form>
  );
}

function cleanPayload(payload) {
  const out = {};
  Object.entries(payload).forEach(([k, v]) => {
    if (v !== '' && v !== null && v !== undefined) out[k] = v;
  });
  return out;
}