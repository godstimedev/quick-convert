export interface CompressionConfig {
	maxSizeMB: number;
	maxWidthOrHeight?: number;
	useWebWorker: boolean;
	initialQuality?: number;
}

export interface CompressionLog {
	id: string;
	message: string;
	status: 'pending' | 'success' | 'error';
	originalSize?: number;
	compressedSize?: number;
}
