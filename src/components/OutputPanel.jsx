import './OutputPanel.css';

export default function OutputPanel({ messages, onClear }) {
  if (!messages?.length) {
    return (
      <aside className="output-panel card-panel">
        <div className="output-header">
          <h2>Output</h2>
          <button type="button" className="btn-clear" onClick={onClear} disabled>
            Clear
          </button>
        </div>
        <div className="output-content empty">
          <p>Messages and transaction results will appear here.</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="output-panel card-panel">
      <div className="output-header">
        <h2>Output</h2>
        <button type="button" className="btn-clear" onClick={onClear}>
          Clear
        </button>
      </div>
      <div className="output-content">
        <ul>
          {messages.map((m, i) => (
            <li key={i} className={`output-item output-${m.type}`}>
              <span className="output-type">{m.type === 'success' ? '✓' : m.type === 'error' ? '✗' : 'ℹ'}</span>
              <span className="output-text">{m.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
