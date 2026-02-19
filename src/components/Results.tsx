import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, RefreshCw, CheckCircle } from 'lucide-react';
import { formatBytes } from '@/lib/utils';

interface ResultsProps {
	onDownload: () => void;
	onReset: () => void;
	stats: {
		totalFiles: number;
		originalSize: number;
		compressedSize: number;
	};
}

export function Results({ onDownload, onReset, stats }: ResultsProps) {
	const savedSize = stats.originalSize - stats.compressedSize;
	const savedPercentage = Math.round((savedSize / stats.originalSize) * 100);

	return (
		<Card className="p-8 text-center space-y-6 border-green-500/20 bg-green-500/5">
			<div className="flex justify-center">
				<div className="p-4 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 animate-in zoom-in duration-500">
					<CheckCircle className="w-12 h-12" />
				</div>
			</div>

			<div className="space-y-2">
				<h2 className="text-2xl font-bold tracking-tight">Conversion Complete!</h2>
				<p className="text-muted-foreground">
					Successfully processed {stats.totalFiles} image{stats.totalFiles > 1 ? 's' : ''}.
				</p>
			</div>

			<div className="grid grid-cols-3 gap-4 py-4 bg-background/50 rounded-lg border">
				<div className="space-y-1">
					<p className="text-xs text-muted-foreground uppercase font-medium">Original</p>
					<p className="text-lg font-bold">{formatBytes(stats.originalSize)}</p>
				</div>
				<div className="space-y-1">
					<p className="text-xs text-muted-foreground uppercase font-medium">Compressed</p>
					<p className="text-lg font-bold text-green-600 dark:text-green-400">
						{formatBytes(stats.compressedSize)}
					</p>
				</div>
				<div className="space-y-1">
					<p className="text-xs text-muted-foreground uppercase font-medium">Saved</p>
					<p className="text-lg font-bold text-green-600 dark:text-green-400">
						{savedPercentage}% ({formatBytes(savedSize)})
					</p>
				</div>
			</div>

			<div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
				<Button variant="outline" onClick={onReset} className="w-full sm:w-auto">
					<RefreshCw className="w-4 h-4 mr-2" />
					Convert More
				</Button>
				<Button onClick={onDownload} className="w-full sm:w-auto shadow-lg shadow-primary/20">
					<Download className="w-4 h-4 mr-2" />
					Download ZIP
				</Button>
			</div>
		</Card>
	);
}
