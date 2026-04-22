// Line icons — simple, consistent, 1.5 stroke.
const Icon = ({ name, size = 16, className = "", style }) => {
  const s = size;
  const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" };
  const paths = {
    menu: <><line x1="3" y1="6" x2="17" y2="6" {...stroke}/><line x1="3" y1="10" x2="17" y2="10" {...stroke}/><line x1="3" y1="14" x2="17" y2="14" {...stroke}/></>,
    upload: <><path d="M10 3v10" {...stroke}/><path d="M5.5 7.5L10 3l4.5 4.5" {...stroke}/><path d="M3 14v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2" {...stroke}/></>,
    link: <><path d="M8 12a3 3 0 0 0 4 0l2-2a3 3 0 0 0-4-4" {...stroke}/><path d="M12 8a3 3 0 0 0-4 0l-2 2a3 3 0 0 0 4 4" {...stroke}/></>,
    grid: <><rect x="3" y="3" width="5.5" height="5.5" {...stroke}/><rect x="11.5" y="3" width="5.5" height="5.5" {...stroke}/><rect x="3" y="11.5" width="5.5" height="5.5" {...stroke}/><rect x="11.5" y="11.5" width="5.5" height="5.5" {...stroke}/></>,
    target: <><circle cx="10" cy="10" r="6.5" {...stroke}/><circle cx="10" cy="10" r="3" {...stroke}/><circle cx="10" cy="10" r=".75" fill="currentColor" stroke="none"/></>,
    chart: <><path d="M3 16V6" {...stroke}/><path d="M7 16v-6" {...stroke}/><path d="M11 16V8" {...stroke}/><path d="M15 16v-9" {...stroke}/></>,
    trending: <><path d="M3 14l4-4 3 3 7-8" {...stroke}/><path d="M12 5h5v5" {...stroke}/></>,
    skull: <><path d="M10 2.5c-3.6 0-6 2.6-6 6.2 0 1.9.9 3 1.8 3.7.4.3.7.8.7 1.3v1.5a1 1 0 0 0 1 1h1v1.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5V16h1a1 1 0 0 0 1-1v-1.5c0-.5.3-1 .7-1.3.9-.7 1.8-1.8 1.8-3.7 0-3.6-2.4-6.2-6-6.2Z" {...stroke}/><circle cx="7.5" cy="10" r="1" fill="currentColor" stroke="none"/><circle cx="12.5" cy="10" r="1" fill="currentColor" stroke="none"/></>,
    doc: <><path d="M5 2.5h6l4 4V17a.5.5 0 0 1-.5.5h-9A.5.5 0 0 1 5 17V2.5Z" {...stroke}/><path d="M11 2.5V7h4" {...stroke}/></>,
    help: <><circle cx="10" cy="10" r="7" {...stroke}/><path d="M8 8a2 2 0 1 1 3 1.7c-.6.3-1 .8-1 1.5V12" {...stroke}/><circle cx="10" cy="14.5" r=".7" fill="currentColor" stroke="none"/></>,
    users: <><circle cx="7" cy="8" r="3" {...stroke}/><path d="M2.5 16.5c.6-2.3 2.4-3.5 4.5-3.5s3.9 1.2 4.5 3.5" {...stroke}/><circle cx="13.5" cy="7" r="2.3" {...stroke}/><path d="M17.5 14.5c-.4-1.6-1.6-2.5-3-2.5" {...stroke}/></>,
    search: <><circle cx="9" cy="9" r="5" {...stroke}/><path d="M13 13l4 4" {...stroke}/></>,
    chat: <><path d="M16.5 10c0 3.3-3 5.8-6.5 5.8-.9 0-1.7-.1-2.5-.4L3.5 17l.8-3.3C3.7 12.6 3.5 11.4 3.5 10c0-3.3 3-5.8 6.5-5.8s6.5 2.5 6.5 5.8Z" {...stroke}/></>,
    sparkle: <><path d="M10 3l1.4 3.6L15 8l-3.6 1.4L10 13l-1.4-3.6L5 8l3.6-1.4L10 3Z" {...stroke}/><path d="M15.5 13l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4L13.5 15l1.4-.6.6-1.4Z" {...stroke}/></>,
    bolt: <><path d="M11 2L4 11h5l-1 7 7-9h-5l1-7Z" {...stroke}/></>,
    plug: <><path d="M7 3v4" {...stroke}/><path d="M13 3v4" {...stroke}/><rect x="5" y="7" width="10" height="5" rx="1" {...stroke}/><path d="M10 12v2a3 3 0 0 0 3 3h1" {...stroke}/></>,
    db: <><ellipse cx="10" cy="5" rx="6" ry="2" {...stroke}/><path d="M4 5v5c0 1.1 2.7 2 6 2s6-.9 6-2V5" {...stroke}/><path d="M4 10v5c0 1.1 2.7 2 6 2s6-.9 6-2v-5" {...stroke}/></>,
    check: <><path d="M4 10l4 4 8-8" {...stroke}/></>,
    x: <><path d="M5 5l10 10M15 5L5 15" {...stroke}/></>,
    plus: <><path d="M10 4v12M4 10h12" {...stroke}/></>,
    chevR: <><path d="M8 5l5 5-5 5" {...stroke}/></>,
    chevD: <><path d="M5 8l5 5 5-5" {...stroke}/></>,
    chevL: <><path d="M12 5l-5 5 5 5" {...stroke}/></>,
    arrowR: <><path d="M4 10h12M12 6l4 4-4 4" {...stroke}/></>,
    download: <><path d="M10 3v11" {...stroke}/><path d="M5.5 9.5L10 14l4.5-4.5" {...stroke}/><path d="M3 17h14" {...stroke}/></>,
    filter: <><path d="M3 4h14l-5 7v4l-4 2v-6L3 4Z" {...stroke}/></>,
    settings: <><circle cx="10" cy="10" r="2.5" {...stroke}/><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.4 4.4l1.4 1.4M14.2 14.2l1.4 1.4M4.4 15.6l1.4-1.4M14.2 5.8l1.4-1.4" {...stroke}/></>,
    copy: <><rect x="7" y="7" width="9" height="9" rx="1.5" {...stroke}/><path d="M13 7V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h2" {...stroke}/></>,
    expand: <><path d="M4 8V4h4M16 8V4h-4M4 12v4h4M16 12v4h-4" {...stroke}/></>,
    info: <><circle cx="10" cy="10" r="7" {...stroke}/><path d="M10 9v4" {...stroke}/><circle cx="10" cy="6.5" r=".7" fill="currentColor" stroke="none"/></>,
    warn: <><path d="M10 3l7.5 13h-15L10 3Z" {...stroke}/><path d="M10 8v4" {...stroke}/><circle cx="10" cy="14" r=".7" fill="currentColor" stroke="none"/></>,
    play: <><path d="M6 4l10 6-10 6V4Z" {...stroke}/></>,
    stop: <><rect x="5" y="5" width="10" height="10" rx="1" {...stroke}/></>,
    tool: <><path d="M13.5 3a3 3 0 0 1 1.2 5l2.3 2.3a1 1 0 0 1 0 1.4l-1.4 1.4a1 1 0 0 1-1.4 0L12 10.8a3 3 0 0 1-4-4L3 1.8 1.8 3 6.8 8a3 3 0 0 0 4 4" {...stroke}/></>,
    flag: <><path d="M4 17V3" {...stroke}/><path d="M4 3h9l-1.5 3L13 9H4" {...stroke}/></>,
    cohort: <><circle cx="7" cy="9" r="4" {...stroke}/><circle cx="13" cy="11" r="4" {...stroke}/></>,
    brain: <><path d="M8 3a2.5 2.5 0 0 0-2.5 2.5v1A2 2 0 0 0 4 8.5v1a2 2 0 0 0 1 1.7v1.3A2.5 2.5 0 0 0 7.5 15h.5V3H8Z" {...stroke}/><path d="M12 3a2.5 2.5 0 0 1 2.5 2.5v1A2 2 0 0 1 16 8.5v1a2 2 0 0 1-1 1.7v1.3A2.5 2.5 0 0 1 12.5 15H12V3h0Z" {...stroke}/></>,
    diff: <><path d="M6 3v10" {...stroke}/><path d="M3 6l3-3 3 3" {...stroke}/><path d="M14 17V7" {...stroke}/><path d="M11 14l3 3 3-3" {...stroke}/></>,
    sigma: <><path d="M14 4H6l4.5 6L6 16h8" {...stroke}/></>,
    folder: <><path d="M3 5a1 1 0 0 1 1-1h4l1.5 2h7a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5Z" {...stroke}/></>,
    stop_sm: <><rect x="6" y="6" width="8" height="8" rx="1.5" {...stroke}/></>,
    refresh: <><path d="M16 10a6 6 0 1 1-1.8-4.3" {...stroke}/><path d="M16 3v3h-3" {...stroke}/></>,
  };
  return (
    <svg width={s} height={s} viewBox="0 0 20 20" className={className} style={style} aria-hidden="true">
      {paths[name] || null}
    </svg>
  );
};

Object.assign(window, { Icon });
