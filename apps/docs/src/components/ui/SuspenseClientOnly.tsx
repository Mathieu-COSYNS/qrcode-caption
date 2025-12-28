import React, {
  lazy,
  useEffect,
  useState,
  type ComponentType,
  type JSX,
  type LazyExoticComponent,
  type ReactNode,
} from "react";

export interface SuspenseClientOnlyProps<P> {
  load?: boolean;
  fallback: ReactNode;
  factory: () => Promise<{ default: ComponentType<P> }>;
  props: JSX.IntrinsicAttributes & P;
}

export const SuspenseClientOnly = <P,>({ load = true, fallback, factory, props }: SuspenseClientOnlyProps<P>) => {
  const [Component, setComponent] = useState<LazyExoticComponent<ComponentType<P>> | null>(null);

  useEffect(() => {
    if (Component === null && load) setComponent(() => lazy(factory));
  }, [load, Component]);

  return <React.Suspense fallback={fallback}>{Component ? <Component {...props} /> : <>{fallback}</>}</React.Suspense>;
};
