import { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { DropZone } from '@/components/DropZone';
import { ControlBar } from '@/components/ControlBar';
import { ProgressLog } from '@/components/ProgressLog';
import { Results } from '@/components/Results';
import { useImageCompression } from '@/hooks/useImageCompression';
import type { CompressionConfig } from './types/CompressionTypes';
import { ThemeProvider } from '@/components/theme-provider';
import { ModeToggle } from '@/components/mode-toggle';
import { Analytics } from '@vercel/analytics/react';

import { Zap } from 'lucide-react';

function App() {
	const [files, setFiles] = useState<File[]>([]);
	const [processedFiles, setProcessedFiles] = useState<File[]>([]);
	const [step, setStep] = useState<'upload' | 'processing' | 'done'>('upload');

	// Config State
	const [quality, setQuality] = useState(0.8);
	const [maxSize, setMaxSize] = useState(1); // MB

	const { compressBatch, isCompressing, progress, logs } = useImageCompression();

	const handleFilesSelected = (selectedFiles: File[]) => {
		setFiles(selectedFiles);
	};

	const handleStart = async () => {
		if (files.length === 0) return;

		setStep('processing');

		const config: CompressionConfig = {
			maxSizeMB: maxSize,
			useWebWorker: true,
			initialQuality: quality,
		};

		const results = await compressBatch(files, config);
		setProcessedFiles(results);
		setStep('done');
	};

	const calculateStats = () => {
		const originalSize = files.reduce((acc, file) => acc + file.size, 0);
		const compressedSize = processedFiles.reduce((acc, file) => acc + file.size, 0);
		return {
			totalFiles: processedFiles.length,
			originalSize,
			compressedSize,
		};
	};

	const generateAndDownloadZip = async () => {
		const zip = new JSZip();

		processedFiles.forEach((file) => {
			zip.file(file.name, file);
		});

		const content = await zip.generateAsync({ type: 'blob' });
		saveAs(content, 'converted-images.zip');
	};

	const handleReset = () => {
		setFiles([]);
		setProcessedFiles([]);
		setStep('upload');
	};

	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<Analytics />
			<div className="min-h-screen bg-background text-foreground p-4 md:p-8 font-sans selection:bg-primary/20">
				<div className="max-w-3xl mx-auto space-y-8">
					{/* Header */}
					<header className="flex flex-col items-center gap-2 mb-12 relative">
						<div className="absolute right-0 top-0">
							<ModeToggle />
						</div>
						<div className="flex items-center gap-2">
							<div className="p-2 bg-primary text-primary-foreground rounded-xl shadow-lg shadow-primary/20">
								<Zap className="w-6 h-6" fill="currentColor" />
							</div>
							<h1 className="text-3xl font-bold tracking-tight">Quick Convert</h1>
						</div>
						<p className="text-muted-foreground text-center max-w-md">
							Bulk convert PNG/JPG to high-efficiency WebP locally. <br />
							Private, fast, and 100% client-side.
						</p>
					</header>

					{/* Main Content Area */}
					<main className="space-y-6 fade-in duration-500 animate-in slide-in-from-bottom-4">
						{step === 'upload' && (
							<div className="space-y-6">
								<DropZone onFilesSelected={handleFilesSelected} />

								{files.length > 0 && (
									<div className="animate-in slide-in-from-bottom-2 fade-in duration-300">
										<ControlBar
											quality={quality}
											onQualityChange={setQuality}
											maxSize={maxSize}
											onMaxSizeChange={setMaxSize}
											onStart={handleStart}
											fileCount={files.length}
										/>
									</div>
								)}
							</div>
						)}

						{step === 'processing' && (
							<div className="space-y-6">
								{/* Reuse Config as Read-only or just show progress */}
								<ProgressLog progress={progress} logs={logs} isCompressing={isCompressing} />
							</div>
						)}

						{step === 'done' && (
							<div className="space-y-6">
								<ResultSection
									stats={calculateStats()}
									onDownload={generateAndDownloadZip}
									onReset={handleReset}
								/>
								<div className="opacity-50 pointer-events-none grayscale">
									<ProgressLog progress={100} logs={logs} isCompressing={false} />
								</div>
							</div>
						)}
					</main>

					<footer className="text-center text-xs text-muted-foreground pt-12">
						<p>
							Built with ❤️ by{' '}
							<a
								href="https://github.com/godstimedev"
								target="_blank"
								rel="noopener noreferrer"
								className="underline"
							>
								godstimedev
							</a>
						</p>
					</footer>
				</div>
			</div>
		</ThemeProvider>
	);
}

// Wrapper to fix Result import name mismatch if any, or just inline logic
function ResultSection({
	stats,
	onDownload,
	onReset,
}: {
	stats: { totalFiles: number; originalSize: number; compressedSize: number };
	onDownload: () => void;
	onReset: () => void;
}) {
	return <Results stats={stats} onDownload={onDownload} onReset={onReset} />;
}

export default App;
