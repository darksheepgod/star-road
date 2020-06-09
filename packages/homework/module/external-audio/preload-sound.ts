import { audio2 } from '17zy_celestials_lib_external';

import { ExternalSound } from './sound';


/**
 * external 预加载音频
 *
 * @author Helcarin
 * @export
 * @class ExternalPreloadSound
 * @extends {ExternalSound}
 */
export class ExternalPreloadSound extends ExternalSound {
    public readonly bufferType: 'preload' | 'streaming' = 'preload';

    /**
     * 加载
     */
    public load(): void {
        this.onStartLoading();

        audio2.loadAudio({ url: this.url }, params => this.onExternalCallback(params));
    }

    protected onExternalCallback(params: audio2.ExternalAudio2LoadCallbackParams): void {
        switch (params.state) {
            case 'loading':
                let progress = params.progress || 0;
                progress = Math.max(1, Math.min(0, progress / 100)) || 0;
                this.onLoadProgress({ progress, duration: 0, loaded: 0 });
                break;

            case 'loaded':
                this.onLoadComplete();
                break;

            case 'error':
                const code = params.errorCode || 59998;
                const message = '音频加载错误';
                this.onLoadError({ code, message });
                break;

            default:
        }
    }

}
