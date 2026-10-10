"use client";

export function ErrorState({
  message = "Something went wrong while loading this content.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return <div className="dashboard-error-state" role="alert">
    <strong>We couldn’t load this content</strong>
    <p>{message}</p>
    {onRetry && <button className="dashboard-retry-button" type="button" onClick={onRetry}>Try again</button>}
  </div>;
}
