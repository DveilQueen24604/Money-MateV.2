import { useState } from 'react';
import './App.css';

const money = (amount) =>
  Number(amount).toLocaleString('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
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
        date,
      },
      ...previous,
    ]);

    setTitle('');
    setAmount('');
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

      <section className="summary">
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
            onChange={(event) => setType(event.target.value)}
          >
            <option value="expense">รายจ่าย</option>
            <option value="income">รายรับ</option>
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

      <section className="card">
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

      <footer>ข้อมูลขั้นทดลอง · ยังไม่บันทึกถาวร</footer>
    </main>
  );
}
