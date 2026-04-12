import { useState, useEffect } from 'react';
import {
  Plus, DollarSign, TrendingUp, TrendingDown, Users,
  Calendar, Receipt, CheckCircle, Clock, Edit, Trash2,
  ArrowRightLeft, Upload, X, PieChart, List,
} from 'lucide-react';
import './BudgetTracker.css';

// ─── Helpers ────────────────────────────────────────────────────────────────

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : parts[0].slice(0, 2).toUpperCase();
}

const CATEGORY_META = {
  accommodation: { emoji: '🏨', label: 'Accommodation',  cssClass: 'badge-accommodation' },
  transportation: { emoji: '✈️', label: 'Transportation', cssClass: 'badge-transportation' },
  food:           { emoji: '🍽️', label: 'Food & Dining',  cssClass: 'badge-food' },
  activity:       { emoji: '🎪', label: 'Activities',     cssClass: 'badge-activity' },
  shopping:       { emoji: '🛍️', label: 'Shopping',       cssClass: 'badge-shopping' },
  other:          { emoji: '💳', label: 'Other',           cssClass: 'badge-other' },
};

const PAYMENT_META = {
  cash:          { emoji: '💵', label: 'Cash' },
  'credit-card': { emoji: '💳', label: 'Credit Card' },
  'debit-card':  { emoji: '💳', label: 'Debit Card' },
  venmo:         { emoji: '💵', label: 'Venmo' },
  paypal:        { emoji: '🅿️', label: 'PayPal' },
  other:         { emoji: '💰', label: 'Other' },
};

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'KRW'];

// ─── API helpers ─────────────────────────────────────────────────────────────

/** Frontend camelCase → backend snake_case body */
function toApiBody(expense, tripId) {
  return {
    trip_id:        tripId,
    title:          expense.title,
    amount:         expense.amount,
    currency:       expense.currency,
    category:       expense.category,
    paid_by:        expense.paidBy,
    split_among:    expense.splitAmong,
    split_type:     expense.splitType,
    custom_splits:  expense.customSplits || null,
    payment_method: expense.paymentMethod,
    date:           expense.date,
    linked_event:   expense.linkedEvent || null,
    receipt_url:    null,
    notes:          expense.notes || '',
  };
}

/** Backend snake_case → frontend camelCase */
function fromApi(e) {
  return {
    id:           e.id,
    title:        e.title,
    amount:       e.amount,
    currency:     e.currency,
    category:     e.category,
    paidBy:       e.paid_by,
    splitAmong:   e.split_among,
    splitType:    e.split_type,
    customSplits: e.custom_splits || null,
    paymentMethod: e.payment_method,
    date:         e.date,
    linkedEvent:  e.linked_event || null,
    settled:      e.settled,
    notes:        e.notes || '',
  };
}

// ─── Default sample data ─────────────────────────────────────────────────────

const DEFAULT_EXPENSES = [
  {
    id: '1',
    title: 'Hotel Booking - 5 nights',
    amount: 1200,
    currency: 'USD',
    category: 'accommodation',
    paidBy: '1',
    splitAmong: ['1', '2', '3', '4'],
    splitType: 'equal',
    paymentMethod: 'credit-card',
    date: '2026-03-14',
    linkedEvent: null,
    settled: false,
    notes: '',
  },
  {
    id: '2',
    title: 'Flight Tickets',
    amount: 1600,
    currency: 'USD',
    category: 'transportation',
    paidBy: '2',
    splitAmong: ['1', '2', '3', '4'],
    splitType: 'equal',
    paymentMethod: 'credit-card',
    date: '2026-03-09',
    linkedEvent: null,
    settled: false,
    notes: '',
  },
  {
    id: '3',
    title: 'Tokyo Skytree Tickets',
    amount: 84,
    currency: 'USD',
    category: 'activity',
    paidBy: '3',
    splitAmong: ['1', '2', '3', '4'],
    splitType: 'equal',
    paymentMethod: 'cash',
    date: '2026-04-11',
    linkedEvent: 'Tokyo Skytree',
    settled: true,
    notes: '',
  },
  {
    id: '4',
    title: 'Tsukiji Market Breakfast',
    amount: 120,
    currency: 'USD',
    category: 'food',
    paidBy: '1',
    splitAmong: ['1', '2', '3', '4'],
    splitType: 'equal',
    paymentMethod: 'cash',
    date: '2026-04-12',
    linkedEvent: 'Tsukiji Outer Market',
    settled: false,
    notes: '',
  },
];

// ─── Main Component ──────────────────────────────────────────────────────────

export default function BudgetTracker({
  members = [],
  totalBudget = 5000,
  budgetCurrency = 'USD',
  tripId = 'default-trip',
}) {
  // Normalise members → give each an `id` if missing
  const normMembers = members.map((m, i) => ({
    id: m.id || String(i + 1),
    name: m.name,
    color: m.color || '#6b7280',
  }));

  // If no members provided, show defaults matching the sample data
  const displayMembers = normMembers.length > 0 ? normMembers : [
    { id: '1', name: 'John Doe',    color: '#22c55e' },
    { id: '2', name: 'Jane Smith',  color: '#3b82f6' },
    { id: '3', name: 'Mike Johnson', color: '#f97316' },
    { id: '4', name: 'Sarah Lee',   color: '#a855f7' },
  ];

  const [viewMode, setViewMode] = useState('category');
  const [currency, setCurrency] = useState('USD');
  const [expenses, setExpenses] = useState(DEFAULT_EXPENSES);
  const [showAdd, setShowAdd] = useState(false);
  const [showSettle, setShowSettle] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [backendOnline, setBackendOnline] = useState(null);

  // Exchange rates: { "EUR": 0.92, "JPY": 149.5, ... } where base = selected currency
  const [rates, setRates] = useState({});
  const [ratesLoading, setRatesLoading] = useState(false);

  // ── Load expenses from backend on mount ──────────────────────────────────

  useEffect(() => {
    fetch(`/api/trips/${tripId}/expenses`)
      .then((r) => {
        if (!r.ok) throw new Error('not ok');
        return r.json();
      })
      .then((data) => {
        setBackendOnline(true);
        if (data.expenses.length > 0) {
          setExpenses(data.expenses.map(fromApi));
        }
      })
      .catch(() => {
        setBackendOnline(false);
        // silently keep DEFAULT_EXPENSES as fallback
      });
  }, [tripId]);

  // ── Fetch exchange rates whenever the display currency changes ───────────

  useEffect(() => {
    setRatesLoading(true);
    fetch(`/api/exchange-rates/${currency}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.rates) setRates(data.rates);
      })
      .catch(() => {})
      .finally(() => setRatesLoading(false));
  }, [currency]);

  // ── Convert any amount from its own currency to the display currency ──────
  // Rates from the API use the display currency as base:
  //   rates["EUR"] = 0.92  means  1 USD = 0.92 EUR  (if display = USD)
  // So to convert X EUR → display currency:  X / rates["EUR"]

  const convert = (amount, fromCurrency) => {
    if (!fromCurrency || fromCurrency === currency) return amount;
    const rate = rates[fromCurrency];
    if (!rate) return amount; // no rate available — use 1:1 as fallback
    return amount / rate;
  };

  // ── Calculations ─────────────────────────────────────────────────────────

  // All money values below are in the selected display currency
  const totalSpent = expenses.reduce((s, e) => s + convert(e.amount, e.currency), 0);
  const totalBudgetConverted = convert(totalBudget, budgetCurrency);
  const remaining = totalBudgetConverted - totalSpent;
  const perPerson = displayMembers.length > 0 ? totalSpent / displayMembers.length : 0;
  const pct = Math.min((totalSpent / totalBudgetConverted) * 100, 100);

  const categoryBreakdown = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + convert(e.amount, e.currency);
    return acc;
  }, {});

  // Balance calculation for settlement (all amounts in display currency)
  const calcBalances = () => {
    const bal = {};
    displayMembers.forEach((m) => { bal[m.id] = 0; });
    expenses.filter((e) => !e.settled).forEach((e) => {
      const converted = convert(e.amount, e.currency);
      const share = converted / e.splitAmong.length;
      bal[e.paidBy] = (bal[e.paidBy] || 0) + converted;
      e.splitAmong.forEach((mid) => {
        bal[mid] = (bal[mid] || 0) - share;
      });
    });
    return bal;
  };

  // ── Handlers — optimistic UI + backend sync ───────────────────────────────

  const handleAdd = async (expense) => {
    const tempId = Date.now().toString();
    // Optimistic update immediately
    setExpenses((prev) => [...prev, { ...expense, id: tempId }]);
    setShowAdd(false);

    if (!backendOnline) return;
    setSyncing(true);
    try {
      const res = await fetch(`/api/trips/${tripId}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toApiBody(expense, tripId)),
      });
      if (!res.ok) throw new Error(await res.text());
      const created = fromApi(await res.json());
      // Replace temp id with the real id from the server
      setExpenses((prev) => prev.map((e) => e.id === tempId ? created : e));
    } catch (err) {
      console.error('Add expense failed:', err);
    } finally {
      setSyncing(false);
    }
  };

  const handleUpdate = async (updated) => {
    // Optimistic update
    setExpenses((prev) => prev.map((e) => e.id === updated.id ? updated : e));
    setEditingExpense(null);

    if (!backendOnline) return;
    setSyncing(true);
    try {
      const res = await fetch(`/api/trips/${tripId}/expenses/${updated.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toApiBody(updated, tripId)),
      });
      if (!res.ok) throw new Error(await res.text());
      const saved = fromApi(await res.json());
      setExpenses((prev) => prev.map((e) => e.id === saved.id ? saved : e));
    } catch (err) {
      console.error('Update expense failed:', err);
    } finally {
      setSyncing(false);
    }
  };

  const handleSettle = async (id) => {
    // Optimistic update
    setExpenses((prev) => prev.map((e) => e.id === id ? { ...e, settled: true } : e));

    if (!backendOnline) return;
    setSyncing(true);
    try {
      const res = await fetch(`/api/trips/${tripId}/expenses/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settled: true }),
      });
      if (!res.ok) throw new Error(await res.text());
      const saved = fromApi(await res.json());
      setExpenses((prev) => prev.map((e) => e.id === id ? saved : e));
    } catch (err) {
      console.error('Settle expense failed:', err);
    } finally {
      setSyncing(false);
    }
  };

  const handleDelete = async (id) => {
    // Optimistic update
    setExpenses((prev) => prev.filter((e) => e.id !== id));

    if (!backendOnline) return;
    setSyncing(true);
    try {
      const res = await fetch(`/api/trips/${tripId}/expenses/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok && res.status !== 404) throw new Error(await res.text());
    } catch (err) {
      console.error('Delete expense failed:', err);
    } finally {
      setSyncing(false);
    }
  };

  // ── Filtered view ─────────────────────────────────────────────────────────

  const linkedExpenses   = expenses.filter((e) => e.linkedEvent);
  const unlinkedExpenses = expenses.filter((e) => !e.linkedEvent);

  const displayedExpenses =
    viewMode === 'event'
      ? [...linkedExpenses, ...unlinkedExpenses]
      : expenses;

  // ── Progress bar color ────────────────────────────────────────────────────

  const barClass =
    pct > 90 ? 'bt-bar-danger' :
    pct > 70 ? 'bt-bar-warning' :
               'bt-bar-ok';

  return (
    <div className="budget-tracker">

      {/* ── Backend status banners ── */}
      {backendOnline === false && (
        <div className="bt-banner bt-banner-warn">
          Backend offline — changes are saved locally only and will reset on refresh.
        </div>
      )}
      {syncing && (
        <div className="bt-banner bt-banner-sync">
          <span className="bt-spinner" /> Syncing…
        </div>
      )}

      {/* ── Header ── */}
      <div className="bt-header">
        <div className="bt-header-text">
          <h2 className="bt-title">Budget Tracker</h2>
          <p className="bt-subtitle">Track expenses and manage your trip budget</p>
        </div>
        <div className="bt-header-actions">
          <div className="bt-currency-wrap">
            <select
              className="bt-currency-select"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              disabled={ratesLoading}
            >
              {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            {ratesLoading && <span className="bt-rate-spinner" />}
          </div>
          <button className="bt-add-btn" onClick={() => setShowAdd(true)}>
            <Plus size={17} />
            Add Expense
          </button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="bt-stat-grid">
        <div className="bt-stat-card">
          <div className="bt-stat-row">
            <span className="bt-stat-label">Total Budget</span>
            <DollarSign size={18} className="bt-stat-icon neutral" />
          </div>
          <div className="bt-stat-value neutral">
            {currency} {totalBudgetConverted.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
        </div>

        <div className="bt-stat-card">
          <div className="bt-stat-row">
            <span className="bt-stat-label">Total Spent</span>
            <TrendingUp size={18} className="bt-stat-icon accent" />
          </div>
          <div className="bt-stat-value accent">
            {currency} {totalSpent.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
        </div>

        <div className="bt-stat-card">
          <div className="bt-stat-row">
            <span className="bt-stat-label">Remaining</span>
            {remaining >= 0
              ? <TrendingDown size={18} className="bt-stat-icon success" />
              : <TrendingUp   size={18} className="bt-stat-icon danger" />}
          </div>
          <div className={`bt-stat-value ${remaining >= 0 ? 'success' : 'danger'}`}>
            {currency} {Math.abs(remaining).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
        </div>

        <div className="bt-stat-card">
          <div className="bt-stat-row">
            <span className="bt-stat-label">Per Person</span>
            <Users size={18} className="bt-stat-icon neutral" />
          </div>
          <div className="bt-stat-value neutral">
            {currency} {perPerson.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* ── Budget Progress ── */}
      <div className="bt-progress-card">
        <div className="bt-progress-header">
          <span className="bt-progress-label">Budget Usage</span>
          <span className="bt-progress-pct">{pct.toFixed(1)}%</span>
        </div>
        <div className="bt-progress-track">
          <div className={`bt-progress-fill ${barClass}`} style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* ── View Toggle + Settle Up ── */}
      <div className="bt-controls">
        <div className="bt-toggle-group">
          <button
            className={`bt-toggle-btn ${viewMode === 'category' ? 'active' : ''}`}
            onClick={() => setViewMode('category')}
          >
            <PieChart size={15} /> By Category
          </button>
          <button
            className={`bt-toggle-btn ${viewMode === 'event' ? 'active' : ''}`}
            onClick={() => setViewMode('event')}
          >
            <List size={15} /> By Event
          </button>
        </div>
        <button className="bt-settle-btn" onClick={() => setShowSettle(true)}>
          <ArrowRightLeft size={16} />
          Settle Up
        </button>
      </div>

      {/* ── Expense List ── */}
      <div className="bt-expense-list">
        <div className="bt-expense-list-header">
          <h3 className="bt-section-title">Expenses</h3>
        </div>
        <div className="bt-expense-items">
          {displayedExpenses.length === 0 && (
            <div className="bt-empty">
              <Receipt size={36} />
              <p>No expenses yet. Add your first expense!</p>
            </div>
          )}
          {displayedExpenses.map((expense) => (
            <ExpenseRow
              key={expense.id}
              expense={expense}
              members={displayMembers}
              onSettle={handleSettle}
              onDelete={handleDelete}
              onEdit={(e) => setEditingExpense(e)}
            />
          ))}
        </div>
      </div>

      {/* ── Category Breakdown ── */}
      {Object.keys(categoryBreakdown).length > 0 && (
        <div className="bt-breakdown-card">
          <h3 className="bt-section-title">Category Breakdown</h3>
          <div className="bt-breakdown-list">
            {Object.entries(categoryBreakdown).map(([cat, amt]) => {
              const meta = CATEGORY_META[cat] || CATEGORY_META.other;
              const catPct = totalSpent > 0 ? (amt / totalSpent) * 100 : 0;
              return (
                <div key={cat} className="bt-breakdown-row">
                  <div className="bt-breakdown-info">
                    <span className="bt-breakdown-emoji">{meta.emoji}</span>
                    <span className="bt-breakdown-name">{meta.label}</span>
                    <span className="bt-breakdown-amt">{currency} {amt.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="bt-breakdown-track">
                    <div className="bt-breakdown-fill" style={{ width: `${catPct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Modals ── */}
      {showAdd && (
        <ExpenseModal
          members={displayMembers}
          onClose={() => setShowAdd(false)}
          onSave={handleAdd}
        />
      )}
      {editingExpense && (
        <ExpenseModal
          members={displayMembers}
          initialData={editingExpense}
          onClose={() => setEditingExpense(null)}
          onSave={handleUpdate}
          isEdit
        />
      )}
      {showSettle && (
        <SettlementModal
          members={displayMembers}
          balances={calcBalances()}
          currency={currency}
          onClose={() => setShowSettle(false)}
        />
      )}
    </div>
  );
}

// ─── Expense Row ─────────────────────────────────────────────────────────────

function ExpenseRow({ expense, members, onSettle, onDelete, onEdit }) {
  const meta      = CATEGORY_META[expense.category] || CATEGORY_META.other;
  const pmMeta    = PAYMENT_META[expense.paymentMethod] || PAYMENT_META.other;
  const paidBy    = members.find((m) => m.id === expense.paidBy);
  const perPerson = expense.amount / (expense.splitAmong.length || 1);

  return (
    <div className="bt-expense-item">
      <div className="bt-expense-left">

        {/* Badges row */}
        <div className="bt-expense-badges">
          <span className={`bt-badge ${meta.cssClass}`}>
            {meta.emoji} {meta.label}
          </span>
          {expense.linkedEvent && (
            <span className="bt-badge-event">
              <Calendar size={11} /> {expense.linkedEvent}
            </span>
          )}
          {expense.settled
            ? <span className="bt-badge-settled"><CheckCircle size={11} /> Settled</span>
            : <span className="bt-badge-pending"><Clock size={11} /> Pending</span>
          }
        </div>

        {/* Title */}
        <h4 className="bt-expense-title">{expense.title}</h4>

        {/* Meta row */}
        <div className="bt-expense-meta">
          <span className="bt-expense-paidby">
            Paid by:
            {paidBy && (
              <span className="bt-member-chip" style={{ background: paidBy.color }}>
                {getInitials(paidBy.name)}
              </span>
            )}
            <span>{paidBy?.name || '—'}</span>
          </span>
          <span className="bt-expense-payment">{pmMeta.emoji} {pmMeta.label}</span>
          <span className="bt-expense-date">
            {new Date(expense.date + 'T00:00:00').toLocaleDateString('en-US', {
              year: 'numeric', month: 'numeric', day: 'numeric',
            })}
          </span>
        </div>

        <div className="bt-expense-split">
          Split among {expense.splitAmong.length} members · ${perPerson.toFixed(2)} per person
        </div>
      </div>

      {/* Amount + Actions */}
      <div className="bt-expense-right">
        <div className="bt-expense-amount-block">
          <div className="bt-expense-amount">${expense.amount.toFixed(2)}</div>
          <div className="bt-expense-currency">{expense.currency}</div>
        </div>
        <div className="bt-expense-actions">
          {!expense.settled && (
            <button
              className="bt-action-btn settle"
              title="Mark as settled"
              onClick={() => onSettle(expense.id)}
            >
              <CheckCircle size={17} />
            </button>
          )}
          <button
            className="bt-action-btn edit"
            title="Edit"
            onClick={() => onEdit(expense)}
          >
            <Edit size={17} />
          </button>
          <button
            className="bt-action-btn delete"
            title="Delete"
            onClick={() => onDelete(expense.id)}
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Add / Edit Expense Modal ────────────────────────────────────────────────

function ExpenseModal({ members, onClose, onSave, initialData = null, isEdit = false }) {
  const blank = {
    title: '',
    amount: '',
    currency: 'USD',
    category: 'other',
    paidBy: members[0]?.id || '1',
    splitAmong: members.map((m) => m.id),
    splitType: 'equal',
    paymentMethod: 'cash',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    settled: false,
  };

  const [form, setForm] = useState(
    initialData
      ? { ...initialData, amount: String(initialData.amount) }
      : blank
  );

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const toggleSplit = (memberId, checked) => {
    set(
      'splitAmong',
      checked
        ? [...form.splitAmong, memberId]
        : form.splitAmong.filter((id) => id !== memberId),
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.amount) return;
    onSave({
      ...form,
      amount: parseFloat(form.amount),
      id: initialData?.id || '',
    });
  };

  return (
    <div className="bt-modal-overlay" onClick={onClose}>
      <div className="bt-modal" onClick={(e) => e.stopPropagation()}>
        <div className="bt-modal-header">
          <h3>{isEdit ? 'Edit Expense' : 'Add Expense'}</h3>
          <button className="bt-modal-close" onClick={onClose}><X size={18} /></button>
        </div>

        <form className="bt-modal-body" onSubmit={handleSubmit}>

          <div className="bt-field">
            <label>Expense Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="What was this expense for?"
              required
            />
          </div>

          <div className="bt-field-row">
            <div className="bt-field">
              <label>Amount</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.amount}
                onChange={(e) => set('amount', e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            <div className="bt-field">
              <label>Currency</label>
              <select value={form.currency} onChange={(e) => set('currency', e.target.value)}>
                {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="bt-field-row">
            <div className="bt-field">
              <label>Category</label>
              <select value={form.category} onChange={(e) => set('category', e.target.value)}>
                {Object.entries(CATEGORY_META).map(([k, v]) => (
                  <option key={k} value={k}>{v.emoji} {v.label}</option>
                ))}
              </select>
            </div>
            <div className="bt-field">
              <label>Payment Method</label>
              <select value={form.paymentMethod} onChange={(e) => set('paymentMethod', e.target.value)}>
                {Object.entries(PAYMENT_META).map(([k, v]) => (
                  <option key={k} value={k}>{v.emoji} {v.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bt-field-row">
            <div className="bt-field">
              <label>Paid By</label>
              <select value={form.paidBy} onChange={(e) => set('paidBy', e.target.value)}>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
            <div className="bt-field">
              <label>Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => set('date', e.target.value)}
              />
            </div>
          </div>

          <div className="bt-field">
            <label>Split Among</label>
            <div className="bt-split-list">
              {members.map((m) => (
                <label key={m.id} className="bt-split-item">
                  <input
                    type="checkbox"
                    checked={form.splitAmong.includes(m.id)}
                    onChange={(e) => toggleSplit(m.id, e.target.checked)}
                  />
                  <span className="bt-split-avatar" style={{ background: m.color }}>
                    {getInitials(m.name)}
                  </span>
                  <span className="bt-split-name">{m.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bt-field">
            <label>Receipt (Optional)</label>
            <div className="bt-upload-zone">
              <Upload size={24} />
              <span>Click to upload receipt</span>
              <span className="bt-upload-hint">PNG, JPG, PDF up to 10 MB</span>
            </div>
          </div>

          <div className="bt-field">
            <label>Notes (Optional)</label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              placeholder="Add any additional details..."
            />
          </div>

          <div className="bt-modal-footer">
            <button type="button" className="bt-btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="bt-btn-submit">
              {isEdit ? 'Save Changes' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Settlement Modal ────────────────────────────────────────────────────────

function SettlementModal({ members, balances, currency = 'USD', onClose }) {
  // Greedy algorithm: minimise transaction count
  const settlements = (() => {
    const result = [];
    const creditors = Object.entries(balances)
      .filter(([, b]) => b > 0.01)
      .map(([id, b]) => [id, b])
      .sort((a, b) => b[1] - a[1]);
    const debtors = Object.entries(balances)
      .filter(([, b]) => b < -0.01)
      .map(([id, b]) => [id, b])
      .sort((a, b) => a[1] - b[1]);

    let i = 0, j = 0;
    while (i < creditors.length && j < debtors.length) {
      const amt = Math.min(creditors[i][1], Math.abs(debtors[j][1]));
      result.push({ from: debtors[j][0], to: creditors[i][0], amount: amt });
      creditors[i][1] -= amt;
      debtors[j][1]   += amt;
      if (creditors[i][1] < 0.01) i++;
      if (Math.abs(debtors[j][1]) < 0.01) j++;
    }
    return result;
  })();

  return (
    <div className="bt-modal-overlay" onClick={onClose}>
      <div className="bt-modal" onClick={(e) => e.stopPropagation()}>
        <div className="bt-modal-header">
          <h3>Settlement Summary</h3>
          <button className="bt-modal-close" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="bt-modal-body">
          <h4 className="bt-settle-section">Individual Balances</h4>
          <div className="bt-balance-list">
            {members.map((m) => {
              const bal = balances[m.id] || 0;
              return (
                <div key={m.id} className="bt-balance-row">
                  <div className="bt-balance-member">
                    <span className="bt-balance-avatar" style={{ background: m.color }}>
                      {getInitials(m.name)}
                    </span>
                    <span className="bt-balance-name">{m.name}</span>
                  </div>
                  <span className={`bt-balance-amt ${bal > 0 ? 'success' : bal < 0 ? 'danger' : 'neutral'}`}>
                    {bal > 0 ? '+' : ''}{currency} {Math.abs(bal).toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>

          <h4 className="bt-settle-section" style={{ marginTop: '1.5rem' }}>
            Suggested Settlements
          </h4>
          {settlements.length === 0 ? (
            <div className="bt-settle-clear">
              <CheckCircle size={40} className="bt-settle-clear-icon" />
              <p>All expenses are settled!</p>
            </div>
          ) : (
            <div className="bt-settle-list">
              {settlements.map((s, idx) => {
                const from = members.find((m) => m.id === s.from);
                const to   = members.find((m) => m.id === s.to);
                return (
                  <div key={idx} className="bt-settle-row">
                    <div className="bt-settle-parties">
                      <span className="bt-settle-avatar" style={{ background: from?.color }}>
                        {getInitials(from?.name)}
                      </span>
                      <span className="bt-settle-name">{from?.name}</span>
                      <ArrowRightLeft size={14} className="bt-settle-arrow" />
                      <span className="bt-settle-avatar" style={{ background: to?.color }}>
                        {getInitials(to?.name)}
                      </span>
                      <span className="bt-settle-name">{to?.name}</span>
                    </div>
                    <span className="bt-settle-amt">{currency} {s.amount.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="bt-settle-note">
            <strong>Note:</strong> These are suggested settlements to minimise the number of
            transactions. You can settle in any way that works for your group.
          </div>

          <button className="bt-btn-submit full" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
