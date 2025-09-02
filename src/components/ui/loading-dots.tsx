import { cn } from '@/lib/utils';

interface LoadingDotsProps {
  className?: string;
}

export const LoadingDots = ({ className }: LoadingDotsProps) => {
  return (
    <div className={cn("flex gap-1", className)}>
      <div className="w-2 h-2 bg-current rounded-full animate-pulse opacity-60" style={{ animationDelay: '0ms', animationDuration: '1000ms' }} />
      <div className="w-2 h-2 bg-current rounded-full animate-pulse opacity-80" style={{ animationDelay: '200ms', animationDuration: '1000ms' }} />
      <div className="w-2 h-2 bg-current rounded-full animate-pulse opacity-100" style={{ animationDelay: '400ms', animationDuration: '1000ms' }} />
    </div>
  );
};