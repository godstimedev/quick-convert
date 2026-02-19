import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Settings, Play } from 'lucide-react';

interface ControlBarProps {
	quality: number;
	onQualityChange: (value: number) => void;
	maxSize: number;
	onMaxSizeChange: (value: number) => void;
	onStart: () => void;
	disabled?: boolean;
	fileCount: number;
}

export function ControlBar({
	quality,
	onQualityChange,
	maxSize,
	onMaxSizeChange,
	onStart,
	disabled,
	fileCount,
}: ControlBarProps) {
	return (
		<Card className="p-6 space-y-6">
			<div className="flex items-center gap-2 mb-4">
				<Settings className="w-5 h-5 text-primary" />
				<h2 className="font-semibold text-lg">Configuration</h2>
			</div>

			<div className="grid gap-8 md:grid-cols-2">
				{/* Quality Slider */}
				<div className="space-y-4">
					<div className="flex justify-between items-center">
						<label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
							Quality
						</label>
						<span className="text-sm text-muted-foreground tabular-nums">
							{(quality * 100).toFixed(0)}%
						</span>
					</div>
					<Slider
						defaultValue={[quality]}
						max={1}
						min={0.1}
						step={0.05}
						onValueChange={(vals) => onQualityChange(vals[0])}
						disabled={disabled}
						className="w-full"
					/>
					<p className="text-xs text-muted-foreground">
						Lower quality = smaller file size. 80% is recommended.
					</p>
				</div>

				{/* Max Size Input */}
				<div className="space-y-4">
					<div className="flex justify-between items-center">
						<label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
							Max Size (MB)
						</label>
						<span className="text-sm text-muted-foreground">Per file</span>
					</div>
					<div className="flex items-center gap-2">
						<input
							type="number"
							min={0.1}
							step={0.1}
							value={maxSize}
							onChange={(e) => onMaxSizeChange(parseFloat(e.target.value) || 0)}
							disabled={disabled}
							className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						/>
					</div>
					<p className="text-xs text-muted-foreground">Files larger than this will be resized to fit.</p>
				</div>
			</div>

			<div className="pt-4 flex justify-end">
				<Button
					size="lg"
					onClick={onStart}
					disabled={disabled || fileCount === 0}
					className="w-full md:w-auto font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
				>
					<Play className="w-4 h-4 mr-2" />
					Start Conversion ({fileCount})
				</Button>
			</div>
		</Card>
	);
}
