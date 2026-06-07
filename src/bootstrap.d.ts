declare global {
  interface JQuery<TElement = HTMLElement> {
    modal(method?: string | ModalOptions): JQuery<TElement>;
    modal(method: 'show'): JQuery<TElement>;
    modal(method: 'hide'): JQuery<TElement>;
    modal(method: 'dispose'): void;
  }

  interface ModalOptions {
    backdrop?: boolean | 'static';
    keyboard?: boolean;
    focus?: boolean;
  }
}

export {};