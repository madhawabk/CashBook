import { Download, Wifi, WifiOff } from 'lucide-react';

export default function AppHeader({ onExport, online, busy }) {
  return <header className="app-header">
    <div className="brand">
      <div className="brand-mark" aria-hidden="true"><span>₨</span></div>
      <div><div className="brand-name">CASHBOOK</div><div className="brand-subtitle">CALCULATOR</div></div>
    </div>
    <div className="header-actions">
      <span className={`connection ${online ? 'online' : 'offline'}`} title={online ? 'Online' : 'Offline'}>
        {online ? <Wifi size={14}/> : <WifiOff size={14}/>}
        <span>{online ? 'ONLINE' : 'OFFLINE'}</span>
      </span>
      <button className="export-button" onClick={onExport} disabled={busy} aria-label="Export transactions to CSV">
        <Download size={16}/><span>EXPORT CSV</span>
      </button>
    </div>
  </header>;
}