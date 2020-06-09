import { ExternalSound } from './sound';


/**
 * external 流式音频
 * （加载进度等由player通知）
 *
 * @author Helcarin
 * @export
 * @class ExternalStreamingSound
 * @extends {ExternalSound}
 */
export class ExternalStreamingSound extends ExternalSound {
    /** 缓冲类型 */
    public readonly bufferType: 'preload' | 'streaming' = 'streaming';
}
