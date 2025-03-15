import Quill from 'quill';
import ImageResize from 'quill-image-resize';

// Регистрируем кастомные атрибуты
const Parchment = Quill.import('parchment');
const FloatStyle = new Parchment.Attributor('float', 'float', {
  scope: Parchment.Scope.INLINE,
  whitelist: ['left', 'right', '']
});
const MarginStyle = new Parchment.Attributor('margin', 'margin', {
  scope: Parchment.Scope.INLINE,
  whitelist: ['0 1em 1em 0', '0']
});
const DisplayStyle = new Parchment.Attributor('display', 'display', {
  scope: Parchment.Scope.INLINE,
  whitelist: ['inline', 'block']
});

// Регистрируем модули и форматы один раз
Quill.register('modules/imageResize', ImageResize);
Quill.register('formats/float', FloatStyle);
Quill.register('formats/margin', MarginStyle);
Quill.register('formats/display', DisplayStyle);

export default Quill;