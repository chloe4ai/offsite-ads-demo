// Plain lettered badge in each platform's colour. Deliberately not the real logos.
const MARKS = {
  amazon: { letter: 'A', className: 'bg-[#FF9900] text-navy-950' },
  walmart: { letter: 'W', className: 'bg-[#004E91] text-[#FFC220]' },
}

export default function PlatformMark({ platform, size = 'w-7 h-7 text-sm' }) {
  const mark = MARKS[platform]
  return (
    <div className={`${size} ${mark.className} rounded-lg flex items-center justify-center font-display font-700 shrink-0`} aria-hidden="true">
      {mark.letter}
    </div>
  )
}
