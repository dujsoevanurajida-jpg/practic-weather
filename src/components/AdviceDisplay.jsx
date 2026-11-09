import React from 'react';

function AdviceDisplay({ advice }) {
  if (!advice) return null;

  return (
    <div className="advice-section">
      {/* Советы по активности */}
      <div className="advice-card activity-card">
        <h3>🏃 Активность</h3>
        <ul className="advice-list">
          {advice.activity.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>

      {/* Что взять с собой (только если есть предметы) */}
      {advice.items.length > 0 && (
        <div className="advice-card items-card">
          <h3>🎒 Взять с собой</h3>
          <div className="items-grid">
            {advice.items.map((item, index) => (
              <div key={index} className="item-badge">
                <span className="item-emoji">{item.emoji}</span>
                <span className="item-name">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Предупреждения */}
      {advice.warnings.length > 0 && (
        <div className="advice-card warnings-card">
          <h3>⚠️ Предупреждения</h3>
          <div className="warnings-list">
            {advice.warnings.map((warning, index) => (
              <div key={index} className="warning-item">
                <span className="warning-icon">{warning.icon}</span>
                <div className="warning-content">
                  <strong>{warning.title}</strong>
                  <p>{warning.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdviceDisplay;