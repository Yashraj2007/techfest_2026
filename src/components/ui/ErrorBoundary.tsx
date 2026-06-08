import { Component, type ErrorInfo, type ReactNode } from "react";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Techfest experience crashed", error, errorInfo);
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-center text-slate-100">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Techfest systems are recalibrating.</h1>
            <p className="mt-4 text-slate-300">Please refresh to re-enter the 3D universe.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}