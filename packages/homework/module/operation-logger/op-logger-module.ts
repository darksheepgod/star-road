import { Subject } from 'rxjs';

import { SRModule } from '../../core/module';
import { Publisher, Stream } from '../../core/publisher';
import { OperationLogStreamData } from './types';


/**
 * ### log模块 ###
 * - input:
 *    - operationLog： oplog流 (OperationLogStreamData)
 * - output:
 *    - 无
 *
 * @author Helcarin
 * @export
 * @class OperationLoggerModule
 * @extends {SRModule}
 */
@Publisher()
export class OperationLoggerModule extends SRModule {
    /**
     * oplog输入流
     */
    @Stream('input:log$')
    public readonly inputLog$!: Subject<OperationLogStreamData>;

}
