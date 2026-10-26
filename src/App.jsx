import { useState, useEffect } from 'react';
import './App.css';


const incomeCategories = [
  'เงินเดือน',
  'รายได้เสริม',
  'โบนัส',
  'ดอกเบี้ยและเงินปันผล',
  'รายรับอื่น ๆ',
];

const expenseCategories = [
  'อาหารและเครื่องดื่ม',
  'ค่าเดินทาง',
  'ค่าท่องเที่ยว',
  'ค่าเช่าที่พัก',
  'ค่าน้ำและค่าไฟ',
  'โทรศัพท์และอินเทอร์เน็ต',
  'ชอปปิง',
  'สุขภาพและการรักษา',
  'สัตว์เลี้ยง',
  'การศึกษา',
  'หนี้สินและดอกเบี้ย',
  'ของใช้ส่วนตัว',
  'ความบันเทิง',
  'ครอบครัว',
  'อื่น ๆ',
];


const money = (amount) =>
  Number(amount).toLocaleString('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function App() {

const [activeTab, setActiveTab] = useState('home');

const [transactions, setTransactions] = useState(() => {
  try {
    return JSON.parse(
      localStorage.getItem('finance-transactions') || '[]'
    );
  } catch {
    return [];
  }
});

useEffect(() => {
  localStorage.setItem(
    'finance-transactions',
    JSON.stringify(transactions)
  );
}, [transactions]);
const [debts, setDebts] = useState(() => {
  try {
    return JSON.parse(
      localStorage.getItem('finance-debts') || '[]'
    );
  } catch {
    return [];
  }
});

useEffect(() => {
  localStorage.setItem(
    'finance-debts',
    JSON.stringify(debts)
  );
}, [debts]);
  
  const [debtName, setDebtName] = useState('');
  const [debtAmount, setDebtAmount] = useState('');
  const [debtPaid, setDebtPaid] = useState('');
  const [debtDue, setDebtDue] = useState('');
  const [debtMonthly, setDebtMonthly] = useState('');
  
  
  
  const totalDebt = debts.reduce(
    (sum, debt) => sum + debt.amount,
    0
  );
  
  const totalPaid = debts.reduce(
    (sum, debt) => sum + debt.paid,
    0
  );
  
  const remainingDebt = debts.reduce(
    (sum, debt) => sum + Math.max(0, debt.amount - debt.paid),
    0
  );
  const totalMonthly = debts.reduce(
    (sum, debt) => sum + (debt.monthly || 0),
    0
  );
  const unpaidMonthly = debts
  .filter((debt) => !debt.isPaidThisMonth)
  .reduce((sum, debt) => sum + (debt.monthly || 0), 0);
  
  function addDebt(event) {
    event.preventDefault();
    const monthlyValue = Number(debtMonthly || 0);
    const amountValue = Number(debtAmount);
    const paidValue = Number(debtPaid || 0);
  
    if (
      !debtName.trim() ||
      !debtAmount ||
      !Number.isFinite(amountValue) ||
      !Number.isFinite(paidValue) ||
      !Number.isFinite(monthlyValue) || monthlyValue < 0 ||
      amountValue <= 0 ||
      paidValue < 0 ||
      paidValue > amountValue
      
    ) {
      alert('กรุณาตรวจสอบชื่อหนี้ จำนวนหนี้ และยอดที่จ่ายแล้ว');
      return;
    }
  
    setDebts((previous) => [
      ...previous,
      {
        id: crypto.randomUUID(),
        name: debtName.trim(),
        amount: amountValue,
        paid: paidValue,
        due: debtDue,
        isPaidThisMonth: false,
  monthly: monthlyValue,
      },
    ]);
  
    setDebtName('');
    setDebtAmount('');
    setDebtPaid('');
    setDebtDue('');
    setDebtMonthly('');
  }
  
  function updateDebtPaid(id, value) {
    const paidValue = Number(value);
  
    if (!Number.isFinite(paidValue) || paidValue < 0) return;
  
    setDebts((previous) =>
      previous.map((debt) =>
        debt.id === id
          ? { ...debt, paid: Math.min(debt.amount, paidValue) }
          : debt
      )
    );
  }
  
  function deleteDebt(id) {
    if (!window.confirm('ต้องการลบรายการหนี้นี้ใช่ไหม?')) return;
  
    setDebts((previous) => previous.filter((debt) => debt.id !== id));
  }
  


  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('อาหารและเครื่องดื่ม');
  const [date, setDate] = useState(new Date().toLocaleDateString('en-CA'));
  

  const income = transactions
    .filter((item) => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0);

  const expense = transactions
    .filter((item) => item.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0);

  function addTransaction(event) {
    event.preventDefault();

    const value = Number(amount);

    if (!title.trim() || !amount || !Number.isFinite(value) || value <= 0) {
      alert('กรุณากรอกชื่อรายการและจำนวนเงินให้ถูกต้อง');
      return;
    }

    setTransactions((previous) => [
      {
        id: crypto.randomUUID(),
        title: title.trim(),
        amount: value,
        type,
        category,
        date,
      },
      ...previous,
    ]);

    setTitle('');
    setAmount('');
    setCategory(
      type === 'income'
        ? incomeCategories[0]
        : expenseCategories[0]
    );
  }

  function deleteTransaction(id) {
    setTransactions((previous) => previous.filter((item) => item.id !== id));
  }

  return (
    <main className="app">
      <header className="header">
        <p className="eyebrow">MY PERSONAL FINANCE</p>
        <h1>กระเป๋าเงินของฉัน 💰</h1>
        <p>วางแผนวันนี้ เพื่อความสบายใจในวันหน้า</p>
      </header>

      
      {activeTab === 'home' && (
      <section className="summary"  id="home-section">
        <div className="card balance">
          <p>เงินคงเหลือสุทธิ</p>
          <h2>{money(income - expense)} ฿</h2>
        </div>

        <div className="card">
          <p>รายรับทั้งหมด</p>
          <h3 className="income">+{money(income)} ฿</h3>
        </div>

        <div className="card">
          <p>รายจ่ายทั้งหมด</p>
          <h3 className="expense">-{money(expense)} ฿</h3>
        </div>
      </section>
      )}
{activeTab === 'transactions' && (
  <>
      <section className="card">
        <h2>เพิ่มรายการใหม่</h2>

        <form onSubmit={addTransaction}>
          <label htmlFor="title">ชื่อรายการ</label>
          <input
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="เช่น เงินเดือน, ค่าอาหาร, ค่าเดินทาง"
          />

          <label htmlFor="amount">จำนวนเงิน (บาท)</label>
          <input
            id="amount"
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="0.00"
          />

          <label htmlFor="type">ประเภทรายการ</label>
          <select
            id="type"
            value={type}
            onChange={(event) => {
              const newType = event.target.value;
              setType(newType);
              setCategory(
                newType === 'income'
                  ? incomeCategories[0]
                  : expenseCategories[0]
              );
            }
          }
          >
            <option value="expense">รายจ่าย</option>
            <option value="income">รายรับ</option>
            </select>
     

<label htmlFor="category">หมวดหมู่</label>
<select
  id="category"
  value={category}
  onChange={(event) => setCategory(event.target.value)}
>
  {(type === 'income'
    ? incomeCategories
    : expenseCategories
  ).map((item) => (
    <option key={item} value={item}>
      {item}
    </option>
  ))}
          </select>

          <label htmlFor="date">วันที่</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            required
          />

          <button type="submit">+ บันทึกรายการ</button>
        </form>
      </section>

      </>
)}
      <section className="card" id="transactions-section">
        <h2>ประวัติรายการ</h2>

        {transactions.length === 0 ? (
          <p className="empty">ยังไม่มีรายการ ลองบันทึกรายการแรกของคุณ</p>
        ) : (
          transactions.map((item) => (
            <div className="transaction" key={item.id}>
              <div>
                <strong>{item.title}</strong>
                <p>
                  {item.date} · {item.type === 'income' ? 'รายรับ' : 'รายจ่าย'}
                </p>
                <p className="transaction-category">
  หมวดหมู่: {item.category || 'อื่น ๆ'}
</p>
              </div>

              <div className="transaction-action">
                <strong className={item.type}>
                  {item.type === 'income' ? '+' : '-'}
                  {money(item.amount)} ฿
                </strong>
                <button
                  type="button"
                  className="delete-button"
                  onClick={() => deleteTransaction(item.id)}
                >
                  ลบ
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      {activeTab === 'debts' && (
<section className="card" id="debts-section">
  <h2>จัดการหนี้สิน 💳</h2>

  <div className="debt-summary">
    <div>
      <p>ยอดหนี้ตั้งต้น</p>
      <strong>{money(totalDebt)} ฿</strong>
    </div>
    <div>
      <p>จ่ายแล้ว</p>
      <strong className="income">{money(totalPaid)} ฿</strong>
    </div>
    <div>
      <p>หนี้คงเหลือ</p>
      <strong className="expense">{money(remainingDebt)} ฿</strong>
    </div>
  </div>
  <div>
  <p>ยอดต้องจ่ายต่อเดือน</p>
  <strong>{money(totalMonthly)} ฿</strong>
</div>
<div>
  <p>ยอดที่ยังต้องจ่ายเดือนนี้</p>
  <strong>{money(unpaidMonthly)} ฿</strong>
</div>

  <form onSubmit={addDebt}>
    <label htmlFor="debtName">ชื่อเจ้าหนี้ / ประเภทหนี้</label>
    <input
      id="debtName"
      value={debtName}
      onChange={(event) => setDebtName(event.target.value)}
      placeholder="เช่น LINE BK, FINNIX, บัตรเครดิต"
      required
    />

    <label htmlFor="debtAmount">ยอดหนี้ตั้งต้น (บาท)</label>
    <input
      id="debtAmount"
      type="number"
      min="0.01"
      step="0.01"
      value={debtAmount}
      onChange={(event) => setDebtAmount(event.target.value)}
      required
    />

    <label htmlFor="debtPaid">ยอดที่จ่ายไปแล้ว (บาท)</label>
    <input
      id="debtPaid"
      type="number"
      min="0"
      step="0.01"
      value={debtPaid}
      onChange={(event) => setDebtPaid(event.target.value)}
      placeholder="ถ้ายังไม่ได้จ่าย ให้เว้นว่าง"
    />

    

<label htmlFor="debtMonthly">
  ยอดที่ต้องจ่ายต่อเดือน (บาท)
</label>
<input
  id="debtMonthly"
  type="number"
  min="0"
  step="0.01"
  value={debtMonthly}
  onChange={(event) => setDebtMonthly(event.target.value)}
  placeholder="เช่น 500"
 />



    <label htmlFor="debtDue">วันครบกำหนดชำระ (ถ้ามี)</label>
    <input
      id="debtDue"
      type="date"
      value={debtDue}
      onChange={(event) => setDebtDue(event.target.value)}
    />

    <button type="submit">+ เพิ่มหนี้สิน</button>
  </form>

  <h3>รายการหนี้ของฉัน</h3>

  {debts.length === 0 ? (
    <p className="empty">ยังไม่มีรายการหนี้สิน</p>
  ) : (
    debts.map((debt) => (
      <div className="transaction" key={debt.id}>
        <div className="debt-details">
          <strong>{debt.name}</strong>
          <p>
  สถานะเดือนนี้: {debt.isPaidThisMonth ? 'จ่ายแล้ว ✅' : 'ยังไม่จ่าย ⏳'}
</p>

<button
  type="button"
  onClick={() =>
    setDebts((previous) =>
      previous.map((item) =>
        item.id === debt.id
          ? { ...item, isPaidThisMonth: !item.isPaidThisMonth }
          : item
      )
    )
  }
>
  {debt.isPaidThisMonth ? 'ยกเลิกสถานะจ่ายแล้ว' : 'ทำเครื่องหมายว่าจ่ายแล้ว'}
</button>
          <p>ยอดตั้งต้น {money(debt.amount)} บาท</p>
          <p>คงเหลือ {money(Math.max(0, debt.amount - debt.paid))} บาท</p>
          {debt.due && <p>ครบกำหนด: {debt.due}</p>}
          <label htmlFor={`paid-${debt.id}`}>แก้ไขยอดที่จ่ายแล้ว</label>
          <input
            id={`paid-${debt.id}`}
            type="number"
            min="0"
            max={debt.amount}
            step="0.01"
            value={debt.paid}
            onChange={(event) =>
              updateDebtPaid(debt.id, event.target.value)
            }
          />
        </div>
        <button
          type="button"
          className="delete-button"
          onClick={() => deleteDebt(debt.id)}
        >
          ลบหนี้
        </button>
      </div>
    ))
  )}
</section>
      )}
<footer>
  ข้อมูลขั้นทดลอง
</footer>

<nav className="bottom-nav">
<button
  type="button"
  className={activeTab === 'home' ? 'nav-item active' : 'nav-item'}
  onClick={() => setActiveTab('home')}
>
  🏠 <span>หน้าหลัก</span>
</button>
<button
  type="button"
  className={activeTab === 'transactions' ? 'nav-item active' : 'nav-item'}
  onClick={() => setActiveTab('transactions')}
>
  🧾 <span>รายการ</span>
</button>

  <button
    type="button"
    className={activeTab === 'debts' ? 'nav-item active' : 'nav-item'}
    onClick={() => setActiveTab('debts')}
  >
    💳 <span>หนี้สิน</span>
  </button>
  <button
    type="button"
    className={activeTab === 'reports' ? 'nav-item active' : 'nav-item'}
    onClick={() => setActiveTab('reports')}
  >
    📊 <span>รายงาน</span>
  </button>
</nav>
</main>

  );
}
