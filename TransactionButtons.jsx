import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
export default function TransactionButtons({ onSave, disabled }) {
  return <div className="transaction-actions">
    <button className="save-button income" disabled={disabled} onClick={() => onSave('INCOME')}>
      <ArrowDownLeft size={19}/><span>SAVE INCOME</span>
    </button>
    <button className="save-button expense" disabled={disabled} onClick={() => onSave('EXPENSE')}>
      <ArrowUpRight size={19}/><span>SAVE EXPENSE</span>
    </button>
  </div>;
}