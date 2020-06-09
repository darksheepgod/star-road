export { LogLevel } from '../logger/types';

export interface OperationLogStreamData {
    /** 频道 */
    channel?: string;

    info: OperationLogInfo;
}

/**
 * 远程日志内容
 *
 * @author Helcarin
 * @export
 * @interface OperationLogInfo
 */
export interface OperationLogInfo {
    /** app */
    app?: string;

    /** 页面版本号 */
    html_version?: string;

    /** 模块 */
    module?: string;

    /** 级别 */
    level: number;

    /** op */
    op: string;

    /** 错误码 */
    errCode?: number;

    /** 信息 */
    msg?: string;

    /** 打点额外信息 s0 */
    s0?: string;

    /** 打点额外信息 s1 */
    s1?: string;

    /** 打点额外信息 s2 */
    s2?: string;

    /** 打点额外信息 s3 */
    s3?: string;

    /** 打点额外信息 s4 */
    s4?: string;

    /** 打点额外信息 动态 */
    etc?: {};
}
