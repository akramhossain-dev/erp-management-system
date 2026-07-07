/**
 * PasswordStrength — visual strength indicator shown during registration.
 * Evaluates: length, uppercase, number, special character.
 */

interface PasswordStrengthProps {
  password: string;
}

interface StrengthRule {
  label:  string;
  passed: boolean;
}

function getStrengthRules(password: string): StrengthRule[] {
  return [
    { label: "At least 8 characters",     passed: password.length >= 8 },
    { label: "One uppercase letter (A-Z)", passed: /[A-Z]/.test(password) },
    { label: "One number (0-9)",           passed: /[0-9]/.test(password) },
    { label: "One special character",      passed: /[^A-Za-z0-9]/.test(password) },
  ];
}

function getStrengthLevel(rules: StrengthRule[]): 0 | 1 | 2 | 3 | 4 {
  const passed = rules.filter((r) => r.passed).length;
  return passed as 0 | 1 | 2 | 3 | 4;
}

const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLORS = [
  "",
  "var(--danger-500)",
  "var(--warning-500)",
  "var(--warning-400)",
  "var(--success-500)",
];

export function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password) return null;

  const rules   = getStrengthRules(password);
  const level   = getStrengthLevel(rules);
  const label   = STRENGTH_LABELS[level];
  const color   = STRENGTH_COLORS[level];

  return (
    <div className="mt-2 space-y-2" aria-live="polite" aria-label="Password strength">
      {/* Strength bar */}
      <div className="flex items-center gap-2">
        <div className="flex gap-1 flex-1">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-1 flex-1 rounded-full transition-all duration-300"
              style={{
                background: i <= level ? color : "var(--bg-surface-400)",
              }}
            />
          ))}
        </div>
        {label && (
          <span className="text-caption font-medium" style={{ color, minWidth: "46px" }}>
            {label}
          </span>
        )}
      </div>

      {/* Rules checklist */}
      <ul className="space-y-1" aria-label="Password requirements">
        {rules.map((rule) => (
          <li key={rule.label} className="flex items-center gap-1.5">
            <span
              className="flex-shrink-0"
              style={{
                color: rule.passed ? "var(--success-400)" : "var(--text-muted)",
              }}
              aria-hidden="true"
            >
              {rule.passed ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                </svg>
              )}
            </span>
            <span
              className="text-caption"
              style={{
                color: rule.passed ? "var(--text-secondary)" : "var(--text-muted)",
              }}
            >
              {rule.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
