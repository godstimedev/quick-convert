import { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { cn, formatBytes } from '@/lib/utils';
import type { CompressionLog } from '@/hooks/useImageCompression';

interface ProgressLogProps {
	progress: number;
	logs: CompressionLog[];
	isCompressing: boolean;
}

export function ProgressLog({ progress, logs, isCompressing }: ProgressLogProps) {
	const scrollRef = useRef<HTMLDivElement>(null);

	// Auto-scroll to bottom of logs
	useEffect(() => {
		if (scrollRef.current) {
			const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
			if (scrollContainer) {
				scrollContainer.scrollTop = scrollContainer.scrollHeight;
			}
		}
	}, [logs]);

	return (
		<Card className="flex flex-col h-[400px] overflow-hidden border-muted">
			{/* Header & Progress Bar */}
			<div className="p-4 border-b bg-muted/30 space-y-4">
				<div className="flex justify-between items-center">
					<h3 className="font-semibold flex items-center gap-2">
						{isCompressing ? (
							<>
								<Loader2 className="w-4 h-4 animate-spin text-primary" />
								Processing...
							</>
						) : (
							'Activity Log'
						)}
					</h3>
					<span className="text-sm font-medium text-muted-foreground">{progress}%</span>
				</div>
				<Progress value={progress} className="h-2 w-full transition-all" />
			</div>

			{/* Terminal Log Area */}
			<ScrollArea className="flex-1 p-4 bg-black/5 dark:bg-black/20 font-mono text-xs" ref={scrollRef}>
				<div className="space-y-1.5">
					{logs.length === 0 && (
						<div className="text-muted-foreground italic p-2 text-center">Ready to process...</div>
					)}

					{logs.map((log) => (
						<div
							key={log.id}
							className={cn(
								'flex items-center gap-2 p-1.5 rounded-sm transition-colors',
								log.status === 'success' && 'text-green-600 dark:text-green-400 bg-green-500/5',
								log.status === 'error' && 'text-red-600 dark:text-red-400 bg-red-500/5',
								log.status === 'pending' && 'text-muted-foreground',
							)}
						>
							{log.status === 'pending' && <Loader2 className="w-3 h-3 animate-spin shrink-0" />}
							{log.status === 'success' && <CheckCircle2 className="w-3 h-3 shrink-0" />}
							{log.status === 'error' && <AlertCircle className="w-3 h-3 shrink-0" />}

							<span className="truncate flex-1">{log.message}</span>

							{log.status === 'success' && log.originalSize && log.compressedSize && (
								<span className="text-[10px] opacity-70 shrink-0 tabular-nums">
									{formatBytes(log.originalSize)} → {formatBytes(log.compressedSize)}
									(-{Math.round((1 - log.compressedSize / log.originalSize) * 100)}%)
								</span>
							)}
						</div>
					))}
				</div>
			</ScrollArea>
		</Card>
	);
}
