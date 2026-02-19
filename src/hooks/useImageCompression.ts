import { useState } from 'react';
import imageCompression from 'browser-image-compression';
import type { CompressionConfig, CompressionLog } from '@/types/CompressionTypes';

export function useImageCompression() {
	const [isCompressing, setIsCompressing] = useState(false);
	const [progress, setProgress] = useState(0);
	const [logs, setLogs] = useState<CompressionLog[]>([]);

	const compressBatch = async (files: File[], config: CompressionConfig) => {
		setIsCompressing(true);
		setProgress(0);
		setLogs([]);

		const compressedFiles: File[] = [];
		let processedCount = 0;

		// Browser-image-compression options
		const options = {
			maxSizeMB: config.maxSizeMB,
			maxWidthOrHeight: config.maxWidthOrHeight,
			useWebWorker: config.useWebWorker,
			initialQuality: config.initialQuality || 0.8,
			onProgress: (_p: number) => {
				// Individual file progress can be noisy, we track batch progress manually
			},
		};

		for (const file of files) {
			const logId = Math.random().toString(36).substring(7);

			// Log start
			setLogs((prev) => [
				...prev,
				{
					id: logId,
					message: `Processing ${file.name}...`,
					status: 'pending',
					originalSize: file.size,
				},
			]);

			try {
				const compressedBlob = await imageCompression(file, options);

				const newFileName = file.name.replace(/\.[^/.]+$/, '') + '.webp';
				const compressedFile = new File([compressedBlob], newFileName, {
					type: 'image/webp',
					lastModified: Date.now(),
				});

				compressedFiles.push(compressedFile);

				// Update log to success
				setLogs((prev) =>
					prev.map((log) =>
						log.id === logId
							? {
									...log,
									message: `${file.name} -> ${newFileName}`,
									status: 'success',
									compressedSize: compressedFile.size,
								}
							: log,
					),
				);
			} catch (error) {
				console.error(`Error compressing ${file.name}:`, error);

				// Update log to error
				setLogs((prev) =>
					prev.map((log) =>
						log.id === logId
							? {
									...log,
									message: `Failed to compress ${file.name}`,
									status: 'error',
								}
							: log,
					),
				);
			}

			processedCount++;
			setProgress(Math.round((processedCount / files.length) * 100));
		}

		setIsCompressing(false);
		return compressedFiles;
	};

	return {
		compressBatch,
		isCompressing,
		progress,
		logs,
	};
}
