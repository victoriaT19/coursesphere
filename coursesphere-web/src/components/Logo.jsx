export default function Logo({size = 48}){
    const s = size;
    const cx = s/2;
    const cy = s/2;
    const r1 = s * 0.37;
    const r2 = s * 0.25;
    const r3 = s * 0.14;
    const ry1 = r1 * 0.36;
    const ry2 = r2 * 0.36;
    const dot = s * 0.08;

    return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none">
            <circle cx={cx} cy={cy} r={r1} fill="#7c3aed" opacity="0.12"/>
            <circle cx={cx} cy={cy} r={r2} fill="#7c3aed" opacity="0.25"/>
            <circle cx={cx} cy={cy} r={r3} fill="#7c3aed"/>
            <ellipse cx={cx} cy={cy} rx={r1} ry={ry1} stroke="#22d3ee" strokeWidth={s * 0.03}/>
            <ellipse cx={cx} cy={cy} rx={r2} ry={ry2} stroke="#7c3aed" strokeWidth={s * 0.02} opacity="0.4"/>
            <line x1={cx} y1={cy - r1} x2={cx} y2={cy + r1} stroke="#22d3ee" strokeWidth={s * 0.02} opacity="0.5"/>
            <circle cx={cx} cy={cy - r1} r={dot} fill="#22d3ee"/>
        </svg>
    )
}