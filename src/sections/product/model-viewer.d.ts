declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': ModelViewerProps
  }

  interface ModelViewerProps
    extends React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > {
    src?: string
    alt?: string
    'camera-controls'?: boolean | ''
    'auto-rotate'?: boolean | ''
    ar?: boolean | ''
    'ar-modes'?: string
    'environment-image'?: string
    exposure?: number | string
    'shadow-intensity'?: number | string
    'camera-target'?: string
    'field-of-view'?: string
    'min-camera-orbit'?: string
    'max-camera-orbit'?: string
    'animation-name'?: string
    'auto-play'?: boolean | ''
    'ios-src'?: string
    poster?: string
    reveal?: 'auto' | 'interaction' | 'manual'
    'loading'?: 'auto' | 'lazy' | 'eager'
  }
}
