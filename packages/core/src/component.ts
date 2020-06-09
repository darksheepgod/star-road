import { Inject } from '17zy_celestials_lib_di';
import { Type } from '../../../lib/types';
import { SRModule } from './module';

/**
 * 组件
 *
 * @author Helcarin
 * @export
 * @interface SRComponent
 * @template T
 */
export interface SRComponent<T extends SRModule> {
    module: T;
    /** 创建完成后调用 */
    onInitialized(): void;
    dispose(): void;
}

const METADATA_KEY_COMPONENT_FLAG = Symbol('sr:componentFlag');

export function isComponent(instance: {}): instance is SRComponent<any> {
    return Reflect.hasMetadata(METADATA_KEY_COMPONENT_FLAG, instance);
}

/**
 * decorator, 声明组件。
 * - 会自动添加module的注入。
 * - 会在构造函数末尾添加一个异步的对注入环境的检查。
 *
 * @author Helcarin
 * @export
 * @template T
 * @param {Type<T>} moduleClass
 * @returns
 */
export function SRComponent<T extends SRModule>(moduleClass: Type<T>) {
    return <TFunction extends Type<SRComponent<T>>>(target: TFunction): TFunction | void => {
        const cls = class extends target {
            constructor(...args: Array<any>) {
                super(...args);

                // 检查一下是否已经注入
                Promise.resolve().then(() => {
                    if (!(this.module && this.module instanceof moduleClass)) {
                        throw new Error('SRComponent is not injected correctly.');
                    }
                });
            }
        };

        // 自动添加对module的注入
        Inject(SRModule)(cls.prototype, 'module');

        Reflect.defineMetadata(METADATA_KEY_COMPONENT_FLAG, true, cls);

        return cls;
    };
}
