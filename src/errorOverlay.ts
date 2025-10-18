// Temporary error overlay to capture runtime errors
function showOverlay(msg: string) {
  const el = document.createElement('div');
  el.style.cssText = 'position:fixed;inset:0;background:#000a;color:#fff;padding:16px;z-index:99999;font:14px/1.4 monospace;overflow:auto';
  el.innerText = msg;
  document.body.appendChild(el);
}

window.addEventListener('error', e => showOverlay('Error: ' + (e?.error?.stack || e.message)));
window.addEventListener('unhandledrejection', e => showOverlay('Unhandled: ' + (e?.reason?.stack || e.reason)));

export {};

