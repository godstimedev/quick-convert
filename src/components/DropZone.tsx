import { useCallback, useState } from 'react';
import { UploadCloud, FileImage, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface DropZoneProps {
	onFilesSelected: (files: File[]) => void;
	disabled?: boolean;
}

export function DropZone({ onFilesSelected, disabled }: DropZoneProps) {
	const [isDragActive, setIsDragActive] = useState(false);
	const [fileCount, setFileCount] = useState(0);

	const handleDragOver = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			e.stopPropagation();
			if (!disabled) setIsDragActive(true);
		},
		[disabled],
	);

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragActive(false);
	}, []);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			e.stopPropagation();
			setIsDragActive(false);

			if (disabled) return;

			const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith('image/'));

			if (files.length > 0) {
				setFileCount(files.length);
				onFilesSelected(files);
			}
		},
		[disabled, onFilesSelected],
	);

	const handleFileInput = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			if (e.target.files) {
				const files = Array.from(e.target.files).filter((file) => file.type.startsWith('image/'));
				if (files.length > 0) {
					setFileCount(files.length);
					onFilesSelected(files);
				}
			}
		},
		[onFilesSelected],
	);

	return (
		<Card
			className={cn(
				'relative flex flex-col items-center justify-center w-full min-h-[300px] border-2 border-dashed transition-all duration-300 ease-in-out cursor-pointer overflow-hidden group',
				isDragActive
					? 'border-primary bg-primary/5 ring-4 ring-primary/10'
					: 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50',
				disabled &&
					'opacity-50 cursor-not-allowed hover:border-muted-foreground/25 hover:bg-transparent',
			)}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
			onClick={() => !disabled && document.getElementById('file-upload')?.click()}
		>
			<input
				id="file-upload"
				type="file"
				multiple
				accept="image/*"
				className="hidden"
				onChange={handleFileInput}
				disabled={disabled}
			/>

			<div className="flex flex-col items-center gap-4 text-center z-10 px-4">
				<div
					className={cn(
						'p-4 rounded-full bg-background shadow-sm transition-transform duration-300',
						isDragActive ? 'scale-110' : 'group-hover:scale-105',
					)}
				>
					{fileCount > 0 ? (
						<FileImage className="w-8 h-8 text-primary" />
					) : (
						<UploadCloud className="w-8 h-8 text-muted-foreground" />
					)}
				</div>

				<div className="space-y-1">
					<h3 className="font-semibold text-lg tracking-tight">
						{fileCount > 0
							? `${fileCount} image${fileCount !== 1 ? 's' : ''} selected`
							: 'Drag & drop images here'}
					</h3>
					<p className="text-sm text-muted-foreground max-w-xs mx-auto">
						{fileCount > 0
							? 'Click or drag more to replace'
							: 'or click to browse files (JPEG, PNG, WEBP supported)'}
					</p>
				</div>

				{fileCount > 0 && (
					<Button
						variant="ghost"
						size="sm"
						className="mt-2 text-muted-foreground hover:text-destructive transition-colors"
						onClick={(e) => {
							e.stopPropagation();
							setFileCount(0);
							onFilesSelected([]);
						}}
					>
						<X className="w-4 h-4 mr-2" />
						Clear selection
					</Button>
				)}
			</div>

			{/* Decorative background pattern */}
			<div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:16px_16px]" />
		</Card>
	);
}
