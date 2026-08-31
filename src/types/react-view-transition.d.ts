import "react";

declare module "react" {
  type ViewTransitionClass = "none" | "auto" | (string & {});

  type ViewTransitionClassPerType =
    | ViewTransitionClass
    | ({ default?: ViewTransitionClass } & Record<string, ViewTransitionClass>);

  interface ViewTransitionProps {
    children?: ReactNode;
    name?: string;
    default?: ViewTransitionClassPerType;
    enter?: ViewTransitionClassPerType;
    exit?: ViewTransitionClassPerType;
    share?: ViewTransitionClassPerType;
    update?: ViewTransitionClassPerType;
    onEnter?: (element: Element, types: string[]) => void;
    onExit?: (element: Element, types: string[]) => void;
    onShare?: (element: Element, types: string[]) => void;
    onUpdate?: (element: Element, types: string[]) => void;
  }

  export const ViewTransition: ExoticComponent<ViewTransitionProps>;
}
