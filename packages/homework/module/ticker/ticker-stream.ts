/**
 * ticker流数据
 *
 * @author Helcarin
 * @export
 * @interface TickerStreamData
 */
export interface TickerStreamData {
    /**
     * 类型
     * （interval=固定时间间隔触发，frame=每帧触发，+active=仅当页面在显示中才触发）
     * @type {('interval' | 'frame' | 'interval_active' | 'frame_active')}
     */
    type: 'interval' | 'frame' | 'interval_active' | 'frame_active';

    /**
     * 当前时间（ms）
     * @type {number}
     */
    now: number;

    /**
     * 距离上次触发的时间间隔（ms）
     * @type {number}
     */
    delay: number;
}
