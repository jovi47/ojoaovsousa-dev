# Phone construction inspection

Owner requested the desktop model/explanation interaction adapted to phone. `createInspection({canvas,panel,onOpen,onClose,onResize})` moves the existing world stage and viewer card into a native dialog, with localized heading/close and an accessible hidden gesture description. It restores their exact positions, hidden state, focus and page scroll when closed. `active` changes before callbacks. Open/close schedule the existing renderer resize; no second renderer, context or asset load is created.

`city.js` opens on a mobile model tap or Enter/Space. The existing card reveals only the selected explanation; inspection itself does not pause rotation, while other dialogs/annotation/hidden/reduced motion still do. A50° phone frame and48° inspection frame reuse current camera controls. Native vertical pan/pinch remain available. The backdrop locks page scroll; the dialog content can scroll.

Four controlled DOM tests cover restoration, close/dispose idempotence, exact viewport return, locales and failed showModal. Native430px showed the actual enlarged model plus explanation and one canvas. Touch-device/focus-trap certification and all model/theme/locale combinations remain pending owner testing. No deployment or provider change.
