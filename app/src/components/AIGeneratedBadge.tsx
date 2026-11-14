import aiIllustrationIcon from '../assets/01_reusable/icons/ai_generated_illustration_badge.png'
import './AIGeneratedBadge.css'

export function AIGeneratedBadge({ className = '' }: { className?: string }) {
  return <p className={`ai-generated-badge-position ${className}`}><span className="ai-generated-badge"><img src={aiIllustrationIcon} alt="" aria-hidden="true" />Ilustrasi dibuat dengan bantuan AI.</span></p>
}
