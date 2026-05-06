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
  Building2,
  UserRound,
  PackageCheck,
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

const initialOfferForm = {
  carrier_company: '',
  price: '',
  estimated_pickup_at: '',
  note: '',
};

const initialAssignForm = {
  driver_id: '',
  truck_id: '',
};

/* =========================
   Main Page
   ========================= */

export default function TransportRequestsPage() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);

  const [companies, setCompanies] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [slots, setSlots] = useState([]);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [form, setForm] = useState(initialForm);
  const [offerForm, setOfferForm] = useState(initialOfferForm);
  const [assignForm, setAssignForm] = useState(initialAssignForm);
  const [slotId, setSlotId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');

  const [showCreate, setShowCreate] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function load() {
    setLoading(true);
    setError('');

    try {
      const [
        requestsRes,
        companiesRes,
        driversRes,
        trucksRes,
        slotsRes,
      ] = await Promise.allSettled([
        api.get('/transport-requests/'),
        api.get('/companies/'),
        api.get('/drivers/'),
        api.get('/trucks/'),
        api.get('/booking-slots/available/'),
      ]);

      if (requestsRes.status === 'fulfilled') {
        const data = normalizeList(requestsRes.value.data);
        setItems(data);

        if (selected) {
          const fresh = data.find((item) => item.id === selected.id);
          setSelected(fresh || null);
        }
      } else {
        setItems([]);
        setError('تعذر تحميل طلبات النقل');
      }

      if (companiesRes.status === 'fulfilled') {
        setCompanies(normalizeList(companiesRes.value.data));
      }

      if (driversRes.status === 'fulfilled') {
        setDrivers(normalizeList(driversRes.value.data));
      }

      if (trucksRes.status === 'fulfilled') {
        setTrucks(normalizeList(trucksRes.value.data));
      }

      if (slotsRes.status === 'fulfilled') {
        setSlots(normalizeList(slotsRes.value.data));
      }
    } catch (err) {
      setError(err?.response?.data?.detail || 'تعذر تحميل بيانات طلبات النقل');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selected) {
      setPaymentAmount('');
      setAssignForm(initialAssignForm);
      setSlotId('');
      return;
    }

    setPaymentAmount(selected.agreed_price || '');
    setAssignForm({
      driver_id: selected.assigned_driver || '',
      truck_id: selected.assigned_truck || '',
    });
    setSlotId(selected.slot || '');
  }, [selected]);

  const carrierCompanies = useMemo(() => {
    const carriers = companies.filter((company) => company.company_type === 'carrier');
    return carriers.length ? carriers : companies;
  }, [companies]);

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
        String(item.requester_username || '').toLowerCase().includes(q) ||
        String(item.selected_carrier_name || '').toLowerCase().includes(q);

      return okStatus && okSearch;
    });
  }, [items, search, statusFilter]);

  const stats = useMemo(() => {
    const total = items.length;
    const draft = items.filter((item) => item.status === 'DRAFT').length;
    const active = items.filter((item) =>
      [
        'VERIFIED',
        'OFFERS_SENT',
        'CARRIER_SELECTED',
        'PAID',
        'DRIVER_ASSIGNED',
        'PORT_SLOT_BOOKED',
        'QR_ISSUED',
      ].includes(item.status)
    ).length;
    const qrIssued = items.filter((item) => item.status === 'QR_ISSUED').length;
    const completed = items.filter((item) => item.status === 'COMPLETED').length;

    return { total, draft, active, qrIssued, completed };
  }, [items]);

  function updateForm(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateOfferForm(key, value) {
    setOfferForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateAssignForm(key, value) {
    setAssignForm((prev) => ({ ...prev, [key]: value }));
  }

  async function createRequest(event) {
    event.preventDefault();

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
    if (!id) return;

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

  async function createOffer(event) {
    event.preventDefault();

    if (!selected?.id) {
      setError('اختر طلب نقل أولًا');
      return;
    }

    if (!offerForm.carrier_company || !offerForm.price) {
      setError('شركة النقل والسعر مطلوبان');
      return;
    }

    setSaving(true);
    setError('');
    setNotice('');

    try {
      await api.post('/transport-offers/', {
        request: selected.id,
        carrier_company: Number(offerForm.carrier_company),
        price: offerForm.price,
        estimated_pickup_at: offerForm.estimated_pickup_at || null,
        note: offerForm.note || '',
      });

      setOfferForm(initialOfferForm);
      setNotice('تم إضافة العرض بنجاح');
      await load();
    } catch (err) {
      setError(err?.response?.data?.detail || 'تعذر إضافة العرض');
    } finally {
      setSaving(false);
    }
  }

  async function selectOffer(offerId) {
    await runAction(selected.id, 'select_offer', { offer_id: offerId });
  }

  async function markPaid() {
    if (!paymentAmount && !selected?.agreed_price) {
      setError('أدخل مبلغ الدفع أو اختر عرضًا أولًا');
      return;
    }

    await runAction(selected.id, 'mark_paid', {
      amount: paymentAmount || selected.agreed_price,
      method: 'manual',
      transaction_ref: `MANUAL-${Date.now()}`,
    });
  }

  async function assignDriver() {
    if (!assignForm.driver_id || !assignForm.truck_id) {
      setError('اختر السائق والشاحنة أولًا');
      return;
    }

    await runAction(selected.id, 'assign_driver', {
      driver_id: Number(assignForm.driver_id),
      truck_id: Number(assignForm.truck_id),
    });
  }

  async function bookSlot() {
    if (!slotId) {
      setError('اختر موعد الميناء أولًا');
      return;
    }

    await runAction(selected.id, 'book_slot', {
      slot_id: Number(slotId),
    });
  }

  async function copy(text) {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setNotice('تم النسخ');
    } catch {
      setError('تعذر النسخ');
    }
  }

  return (
    <PageShell
      title="طلبات النقل"
      subtitle="إدارة طلبات النقل من تصريح الإفراج حتى إصدار QR"
      actions={
        <>
          <button onClick={load} className="btn-secondary">
            <RefreshCw size={16} />
            تحديث
          </button>

          <button
            onClick={() => setShowCreate((value) => !value)}
            className="btn-primary"
          >
            <Plus size={16} />
            طلب جديد
          </button>
        </>
      }
    >
      {error ? <Alert type="error" text={error} /> : null}
      {notice ? <Alert type="success" text={notice} /> : null}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        <MiniStat label="الإجمالي" value={stats.total} color="text-slate-900" />
        <MiniStat label="مسودة" value={stats.draft} color="text-slate-500" />
        <MiniStat label="قيد التنفيذ" value={stats.active} color="text-blue-600" />
        <MiniStat label="QR صادرة" value={stats.qrIssued} color="text-emerald-600" />
        <MiniStat label="مكتملة" value={stats.completed} color="text-violet-600" />
      </div>

      {showCreate ? (
        <CreateRequestForm
          form={form}
          saving={saving}
          onChange={updateForm}
          onSubmit={createRequest}
          onCancel={() => setShowCreate(false)}
        />
      ) : null}

      <div className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[260px]">
            <Search
              size={18}
              className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-400"
            />
            <input
              className="input w-full pr-11"
              placeholder="بحث برقم الحاوية أو البوليصة أو شركة النقل أو الوجهة"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <select
            className="input min-w-[190px]"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="">كل الحالات</option>
            {Object.entries(statusMap).map(([key, value]) => (
              <option key={key} value={key}>
                {value.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingCard text="جاري تحميل طلبات النقل..." />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          <div className="xl:col-span-7 space-y-3">
            {filtered.length ? (
              filtered.map((item) => (
                <RequestCard
                  key={item.id}
                  item={item}
                  active={selected?.id === item.id}
                  onSelect={() => setSelected(item)}
                />
              ))
            ) : (
              <div className="bg-white rounded-[22px] p-8 shadow-soft border border-slate-100 text-center text-slate-400">
                لا توجد طلبات نقل مطابقة.
              </div>
            )}
          </div>

          <div className="xl:col-span-5">
            <RequestDetails
              item={selected}
              saving={saving}
              companies={carrierCompanies}
              drivers={drivers}
              trucks={trucks}
              slots={slots}
              offerForm={offerForm}
              assignForm={assignForm}
              slotId={slotId}
              paymentAmount={paymentAmount}
              onClose={() => setSelected(null)}
              onVerify={() => runAction(selected.id, 'verify')}
              onSendOffers={() => runAction(selected.id, 'send_offers')}
              onCreateOffer={createOffer}
              onOfferChange={updateOfferForm}
              onSelectOffer={selectOffer}
              onPaymentAmountChange={setPaymentAmount}
              onMarkPaid={markPaid}
              onAssignChange={updateAssignForm}
              onAssignDriver={assignDriver}
              onSlotChange={setSlotId}
              onBookSlot={bookSlot}
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
   Create Request Form
   ========================= */

function CreateRequestForm({
  form,
  saving,
  onChange,
  onSubmit,
  onCancel,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100 space-y-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-black text-slate-900">طلب نقل جديد</h3>
          <p className="text-sm text-slate-400 mt-1">
            أدخل بيانات تصريح الإفراج والحاوية والوجهة.
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center"
        >
          <X size={18} />
        </button>
      </div>

      <SectionTitle
        icon={PackageCheck}
        title="بيانات تصريح الإفراج"
        subtitle="هذه البيانات تمثل بداية طلب النقل."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <Field
          label="رقم الحاوية"
          value={form.container_no}
          onChange={(value) => onChange('container_no', value)}
          required
        />

        <Field
          label="رقم البوليصة BL"
          value={form.bl_no}
          onChange={(value) => onChange('bl_no', value)}
        />

        <Field
          label="اسم السفينة"
          value={form.vessel_name}
          onChange={(value) => onChange('vessel_name', value)}
        />

        <Field
          label="تاريخ الإفراج"
          type="date"
          value={form.release_date}
          onChange={(value) => onChange('release_date', value)}
        />

        <Field
          label="ميناء الوصول"
          value={form.arrival_port}
          onChange={(value) => onChange('arrival_port', value)}
        />

        <Field
          label="الوجهة"
          value={form.destination}
          onChange={(value) => onChange('destination', value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-600 mb-2">
          ملاحظات
        </label>
        <textarea
          value={form.notes}
          onChange={(event) => onChange('notes', event.target.value)}
          className="input w-full min-h-[90px]"
          placeholder="أي ملاحظات إضافية"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="btn-primary"
        >
          {saving ? 'جاري الحفظ...' : 'إنشاء الطلب'}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
        >
          إلغاء
        </button>
      </div>
    </form>
  );
}

/* =========================
   Request Card
   ========================= */

function RequestCard({ item, active, onSelect }) {
  const status = statusMap[item.status] || {
    label: item.status || '-',
    cls: 'bg-slate-100 text-slate-600',
  };

  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        'w-full text-right bg-white rounded-[22px] p-5 shadow-soft border transition',
        active ? 'border-blue-500 ring-4 ring-blue-50' : 'border-slate-100 hover:border-blue-200',
      ].join(' ')}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <div className="text-lg font-black text-slate-900">
            {item.container_no || '-'}
          </div>

          <div className="text-sm text-slate-400 mt-1">
            {item.bl_no || 'بدون بوليصة'} — {item.destination || '-'}
          </div>
        </div>

        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${status.cls}`}>
          {status.label}
        </span>
      </div>

      <FlowTracker status={item.status} compact />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-600 mt-4">
        <InfoLine label="الطالب" value={item.requester_username || '-'} />
        <InfoLine label="شركة النقل" value={item.selected_carrier_name || '-'} />
        <InfoLine label="السائق" value={item.assigned_driver_name || '-'} />
        <InfoLine label="الشاحنة" value={item.assigned_truck_plate || '-'} />
      </div>
    </button>
  );
}

/* =========================
   Request Details
   ========================= */

function RequestDetails({
  item,
  saving,
  companies,
  drivers,
  trucks,
  slots,
  offerForm,
  assignForm,
  slotId,
  paymentAmount,
  onClose,
  onVerify,
  onSendOffers,
  onCreateOffer,
  onOfferChange,
  onSelectOffer,
  onPaymentAmountChange,
  onMarkPaid,
  onAssignChange,
  onAssignDriver,
  onSlotChange,
  onBookSlot,
  onIssueQr,
  onCopy,
}) {
  if (!item) {
    return (
      <div className="bg-white rounded-[22px] p-8 shadow-soft border border-slate-100 text-center text-slate-400 sticky top-6">
        اختر طلبًا من القائمة لعرض التفاصيل.
      </div>
    );
  }

  const status = statusMap[item.status] || {
    label: item.status || '-',
    cls: 'bg-slate-100 text-slate-600',
  };

  return (
    <div className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100 sticky top-6 space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xl font-black text-slate-900">
            {item.container_no || '-'}
          </div>

          <div className="text-sm text-slate-400 mt-1">
            طلب رقم #{item.id}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center"
        >
          <X size={18} />
        </button>
      </div>

      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${status.cls}`}>
        {status.label}
      </span>

      <FlowTracker status={item.status} />

      <InfoPanel item={item} />

      <WorkflowActions
        item={item}
        saving={saving}
        onVerify={onVerify}
        onSendOffers={onSendOffers}
        onIssueQr={onIssueQr}
      />

      <OffersPanel
        item={item}
        companies={companies}
        offers={item.offers || []}
        offerForm={offerForm}
        saving={saving}
        onCreateOffer={onCreateOffer}
        onOfferChange={onOfferChange}
        onSelectOffer={onSelectOffer}
      />

      <PaymentPanel
        item={item}
        saving={saving}
        paymentAmount={paymentAmount}
        onPaymentAmountChange={onPaymentAmountChange}
        onMarkPaid={onMarkPaid}
      />

      <AssignmentPanel
        item={item}
        saving={saving}
        drivers={drivers}
        trucks={trucks}
        assignForm={assignForm}
        onAssignChange={onAssignChange}
        onAssignDriver={onAssignDriver}
      />

      <SlotPanel
        item={item}
        saving={saving}
        slots={slots}
        slotId={slotId}
        onSlotChange={onSlotChange}
        onBookSlot={onBookSlot}
      />

      <QrPanel item={item} onCopy={onCopy} />
    </div>
  );
}

/* =========================
   Panels
   ========================= */

function InfoPanel({ item }) {
  return (
    <div className="border border-slate-100 rounded-2xl p-4">
      <SectionTitle
        icon={PackageCheck}
        title="بيانات الطلب"
        subtitle="بيانات تصريح الإفراج والحاوية."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        <InfoBox label="رقم الحاوية" value={item.container_no || '-'} />
        <InfoBox label="رقم البوليصة" value={item.bl_no || '-'} />
        <InfoBox label="السفينة" value={item.vessel_name || '-'} />
        <InfoBox label="تاريخ الإفراج" value={item.release_date || '-'} />
        <InfoBox label="ميناء الوصول" value={item.arrival_port || '-'} />
        <InfoBox label="الوجهة" value={item.destination || '-'} />
        <InfoBox label="شركة النقل" value={item.selected_carrier_name || '-'} />
        <InfoBox label="الموعد" value={item.slot_label || '-'} />
        <InfoBox label="السائق" value={item.assigned_driver_name || '-'} />
        <InfoBox label="الشاحنة" value={item.assigned_truck_plate || '-'} />
      </div>
    </div>
  );
}

function WorkflowActions({
  item,
  saving,
  onVerify,
  onSendOffers,
  onIssueQr,
}) {
  return (
    <div className="border border-slate-100 rounded-2xl p-4">
      <SectionTitle
        icon={CheckCircle2}
        title="إجراءات سير العمل"
        subtitle="تنفيذ المراحل الرئيسية للطلب."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4">
        <ActionButton
          disabled={saving || item.status !== 'DRAFT'}
          onClick={onVerify}
          icon={CheckCircle2}
          label="التحقق من الطلب"
        />

        <ActionButton
          disabled={saving || item.status !== 'VERIFIED'}
          onClick={onSendOffers}
          icon={Send}
          label="إرسال العروض"
        />

        <ActionButton
          disabled={saving || item.status !== 'PORT_SLOT_BOOKED'}
          onClick={onIssueQr}
          icon={QrCode}
          label="إصدار QR"
        />
      </div>
    </div>
  );
}

function OffersPanel({
  item,
  companies,
  offers,
  offerForm,
  saving,
  onCreateOffer,
  onOfferChange,
  onSelectOffer,
}) {
  const canAddOffer = ['VERIFIED', 'OFFERS_SENT'].includes(item.status);

  return (
    <div className="border border-slate-100 rounded-2xl p-4">
      <SectionTitle
        icon={Building2}
        title="اختيار شركة النقل"
        subtitle="إضافة عروض شركات النقل واختيار العرض المناسب."
      />

      <form onSubmit={onCreateOffer} className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        <SelectField
          label="شركة النقل"
          value={offerForm.carrier_company}
          onChange={(value) => onOfferChange('carrier_company', value)}
          disabled={!canAddOffer || saving}
          required
        >
          <option value="">اختر شركة النقل</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </SelectField>

        <Field
          label="السعر"
          type="number"
          value={offerForm.price}
          onChange={(value) => onOfferChange('price', value)}
          disabled={!canAddOffer || saving}
          required
        />

        <Field
          label="وقت الاستلام المتوقع"
          type="datetime-local"
          value={offerForm.estimated_pickup_at}
          onChange={(value) => onOfferChange('estimated_pickup_at', value)}
          disabled={!canAddOffer || saving}
        />

        <Field
          label="ملاحظة"
          value={offerForm.note}
          onChange={(value) => onOfferChange('note', value)}
          disabled={!canAddOffer || saving}
        />

        <button
          type="submit"
          disabled={!canAddOffer || saving}
          className="btn-primary md:col-span-2"
        >
          إضافة عرض
        </button>
      </form>

      <div className="space-y-2 mt-4">
        {offers.length ? (
          offers.map((offer) => (
            <div
              key={offer.id}
              className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 rounded-2xl px-4 py-3 border border-slate-100"
            >
              <div>
                <div className="font-bold text-slate-800">
                  {offer.carrier_company_name || `شركة #${offer.carrier_company}`}
                </div>

                <div className="text-sm text-slate-500">
                  السعر: {offer.price} — الحالة: {offer.status}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectOffer(offer.id)}
                disabled={saving || offer.status === 'ACCEPTED' || item.status !== 'OFFERS_SENT'}
                className="btn-primary disabled:bg-emerald-100 disabled:text-emerald-700"
              >
                <BadgeCheck size={15} />
                {offer.status === 'ACCEPTED' ? 'مختار' : 'اختيار'}
              </button>
            </div>
          ))
        ) : (
          <div className="py-5 text-center text-slate-400">
            لا توجد عروض بعد.
          </div>
        )}
      </div>
    </div>
  );
}

function PaymentPanel({
  item,
  saving,
  paymentAmount,
  onPaymentAmountChange,
  onMarkPaid,
}) {
  const canPay = item.status === 'CARRIER_SELECTED';

  return (
    <div className="border border-slate-100 rounded-2xl p-4">
      <SectionTitle
        icon={CreditCard}
        title="الدفع"
        subtitle="تأكيد الدفع بعد اختيار شركة النقل."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        <Field
          label="المبلغ"
          type="number"
          value={paymentAmount || ''}
          onChange={onPaymentAmountChange}
          disabled={!canPay || saving}
        />

        <div className="flex items-end">
          <button
            type="button"
            disabled={!canPay || saving}
            onClick={onMarkPaid}
            className="btn-primary w-full"
          >
            <CreditCard size={16} />
            تأكيد الدفع
          </button>
        </div>
      </div>

      {item.payment ? (
        <div className="mt-3 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-2xl p-3">
          حالة الدفع: {item.payment.status} — المبلغ: {item.payment.amount}
        </div>
      ) : null}
    </div>
  );
}

function AssignmentPanel({
  item,
  saving,
  drivers,
  trucks,
  assignForm,
  onAssignChange,
  onAssignDriver,
}) {
  const canAssign = item.status === 'PAID';

  return (
    <div className="border border-slate-100 rounded-2xl p-4">
      <SectionTitle
        icon={Truck}
        title="تخصيص السائق والشاحنة"
        subtitle="اختيار السائق والشاحنة بعد تأكيد الدفع."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        <SelectField
          label="السائق"
          value={assignForm.driver_id}
          onChange={(value) => onAssignChange('driver_id', value)}
          disabled={!canAssign || saving}
        >
          <option value="">اختر السائق</option>
          {drivers.map((driver) => (
            <option key={driver.id} value={driver.id}>
              {driver.full_name} — {driver.phone}
            </option>
          ))}
        </SelectField>

        <SelectField
          label="الشاحنة"
          value={assignForm.truck_id}
          onChange={(value) => onAssignChange('truck_id', value)}
          disabled={!canAssign || saving}
        >
          <option value="">اختر الشاحنة</option>
          {trucks.map((truck) => (
            <option key={truck.id} value={truck.id}>
              {truck.plate_number}
              {truck.owner_company_name ? ` — ${truck.owner_company_name}` : ''}
            </option>
          ))}
        </SelectField>

        <button
          type="button"
          disabled={!canAssign || saving}
          onClick={onAssignDriver}
          className="btn-primary md:col-span-2"
        >
          <UserRound size={16} />
          تأكيد التخصيص
        </button>
      </div>
    </div>
  );
}

function SlotPanel({
  item,
  saving,
  slots,
  slotId,
  onSlotChange,
  onBookSlot,
}) {
  const canBook = item.status === 'DRIVER_ASSIGNED';

  return (
    <div className="border border-slate-100 rounded-2xl p-4">
      <SectionTitle
        icon={CalendarDays}
        title="حجز موعد دخول الميناء"
        subtitle="اختيار فترة زمنية متاحة لدخول الميناء."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        <SelectField
          label="الموعد المتاح"
          value={slotId}
          onChange={onSlotChange}
          disabled={!canBook || saving}
        >
          <option value="">اختر الموعد</option>
          {slots.map((slot) => (
            <option key={slot.id} value={slot.id}>
              {slot.date} {String(slot.hour).padStart(2, '0')}:00
              {typeof slot.available !== 'undefined' ? ` — المتاح ${slot.available}` : ''}
            </option>
          ))}
        </SelectField>

        <div className="flex items-end">
          <button
            type="button"
            disabled={!canBook || saving}
            onClick={onBookSlot}
            className="btn-primary w-full"
          >
            <CalendarDays size={16} />
            حجز الموعد
          </button>
        </div>
      </div>
    </div>
  );
}

function QrPanel({ item, onCopy }) {
  if (!item.qr_token) return null;

  return (
    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
      <div className="flex items-center gap-2 text-emerald-700 font-bold mb-2">
        <QrCode size={18} />
        QR النهائي
      </div>

      <code className="block text-xs text-slate-700 break-all bg-white rounded-xl p-3 border border-emerald-100">
        {item.qr_token}
      </code>

      <button
        type="button"
        onClick={() => onCopy(item.qr_token)}
        className="btn-primary mt-3"
      >
        <Copy size={15} />
        نسخ التوكن
      </button>
    </div>
  );
}

/* =========================
   Generic UI
   ========================= */

function FlowTracker({ status, compact = false }) {
  const currentIndex = flowSteps.findIndex((step) => step.key === status);

  return (
    <div className={compact ? 'flex flex-wrap gap-1' : 'flex flex-wrap gap-2'}>
      {flowSteps.map((step, index) => {
        const done = currentIndex >= 0 && index < currentIndex;
        const active = step.key === status;

        return (
          <div
            key={step.key}
            className={[
              'inline-flex items-center gap-2 rounded-full font-bold',
              compact ? 'px-2 py-1 text-[11px]' : 'px-3 py-1 text-xs',
              active
                ? 'bg-blue-600 text-white'
                : done
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-slate-100 text-slate-400',
            ].join(' ')}
          >
            {done ? <CheckCircle2 size={13} /> : null}
            {step.label}
          </div>
        );
      })}
    </div>
  );
}

function SectionTitle({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
        <Icon size={19} />
      </div>

      <div>
        <div className="font-black text-slate-900">{title}</div>
        {subtitle ? (
          <div className="text-xs text-slate-400 mt-1">{subtitle}</div>
        ) : null}
      </div>
    </div>
  );
}

function ActionButton({ disabled, onClick, icon: Icon, label }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="btn-primary disabled:bg-slate-100 disabled:text-slate-400"
    >
      <Icon size={16} />
      {label}
    </button>
  );
}

function Alert({ type, text }) {
  const cls =
    type === 'error'
      ? 'bg-red-50 border-red-200 text-red-700'
      : 'bg-emerald-50 border-emerald-200 text-emerald-700';

  return (
    <div className={`border rounded-2xl p-3 text-sm ${cls}`}>
      {text}
    </div>
  );
}

function MiniStat({ label, value, color }) {
  return (
    <div className="bg-white rounded-[22px] p-5 shadow-soft border border-slate-100">
      <div className="text-sm text-slate-500 mb-2">{label}</div>
      <div className={`text-4xl font-black ${color}`}>{value}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  disabled = false,
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-600 mb-2">
        {label}
      </label>

      <input
        type={type}
        value={value || ''}
        required={required}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="input w-full disabled:bg-slate-50 disabled:text-slate-400"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  children,
  required = false,
  disabled = false,
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-600 mb-2">
        {label}
      </label>

      <select
        value={value || ''}
        required={required}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="input w-full disabled:bg-slate-50 disabled:text-slate-400"
      >
        {children}
      </select>
    </div>
  );
}

function InfoLine({ label, value }) {
  return (
    <div>
      <span className="text-slate-400">{label}: </span>
      <span className="font-semibold text-slate-700">{value}</span>
    </div>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3">
      <div className="text-xs text-slate-400 mb-1">{label}</div>
      <div className="font-bold text-slate-800 break-words">{value}</div>
    </div>
  );
}
function normalizeList(data) {
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data)) return data;
  return [];
}

function cleanPayload(payload) {
  const output = {};

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      output[key] = value;
    }
  });

  return output;
}