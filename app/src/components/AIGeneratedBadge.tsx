import './AIGeneratedBadge.css'

export function AIGeneratedBadge({ className = '' }: { className?: string }) {
  return <p className={`ai-generated-badge ${className}`}>Ilustrasi dibuat dengan bantuan AI.</p>
}
