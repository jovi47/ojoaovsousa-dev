const escapeAttribute = (value) => String(value).replace(/[&"<>]/g, (character) => ({
  '&': '&amp;', '"': '&quot;', '<': '&lt;', '>': '&gt;',
})[character]);

export function character({ className = '', label = '' } = {}) {
  return `<span class="brick-person ${escapeAttribute(className)}" data-pose="idle" ${label ? `role="img" aria-label="${escapeAttribute(label)}"` : 'aria-hidden="true"'}>
    <span class="brick-person__rig">
      <span class="brick-person__shadow"></span>
      <span class="brick-person__arm brick-person__arm--back"><span class="brick-person__sleeve"></span><span class="brick-person__hand"></span></span>
      <span class="brick-person__leg brick-person__leg--back"><span class="brick-person__shoe"></span></span>
      <span class="brick-person__leg brick-person__leg--front"><span class="brick-person__shoe"></span></span>
      <span class="brick-person__hips"></span>
      <span class="brick-person__neck"></span>
      <span class="brick-person__body"><span class="brick-person__shirt"></span><span class="brick-person__tie"></span><span class="brick-person__lapel brick-person__lapel--left"></span><span class="brick-person__lapel brick-person__lapel--right"></span><span class="brick-person__pocket"></span></span>
      <span class="brick-person__arm brick-person__arm--front"><span class="brick-person__sleeve"></span><span class="brick-person__hand"></span></span>
      <span class="brick-person__head"><span class="brick-person__hair"></span><span class="brick-person__face"><span class="brick-person__eye brick-person__eye--left"></span><span class="brick-person__eye brick-person__eye--right"></span><span class="brick-person__smile"></span></span></span>
    </span>
  </span>`;
}
