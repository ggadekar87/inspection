// src/components/ErrorBoundary.tsx
import React from 'react';

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    // log to console or remote
    console.error('ErrorBoundary caught', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-card">Something went wrong. Please refresh the page.</div>;
    }
    return this.props.children;
  }
}
