declare module 'quill-image-resize' {
    import Quill from 'quill';
  
    interface ImageResizeOptions {
      modules?: string[];
    }
  
    class ImageResize {
      constructor(quill: Quill, options?: ImageResizeOptions);
    }
  
    export default ImageResize;
  }
  