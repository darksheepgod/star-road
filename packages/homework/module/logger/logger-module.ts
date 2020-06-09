import { Subject } from 'rxjs';

import { SRModule } from '../../core/module';
import { Publisher, Stream } from '../../core/publisher';
import { LogStreamData } from './types';


/**
 * ### logger模块 ###
 * - input:
 *    - log： log流 (LogStreamData)
 * - output:
 *    - 无
 *
 * @author Helcarin
 * @export
 * @class LogModule
 * @extends {SRModule}
 */
@Publisher()
export class LoggerModule extends SRModule {
    /**
     * log输入流
     */
    @Stream('input:log$')
    public readonly inputLog$!: Subject<LogStreamData>;

}
