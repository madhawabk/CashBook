import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
export default function Notification({ notice }) {
  if (!notice) return null;
  const Icon = notice.type === 'success' ? CheckCircle2 : notice.type === 'info' ? Info : AlertCircle;
  return <div className={`notification ${notice.type}`} role="status" aria-live="polite">
    <Icon size={17}/><span>{notice.message}</span>
  </div>;
}