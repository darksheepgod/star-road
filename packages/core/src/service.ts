import { Inject } from '17zy_celestials_lib_di';
import { Type } from '../../../lib/types';
import { SRModule } from './module';

/**
 * 服务
 *
 * @author Helcarin
 * @export
 * @interface SRService
 * @template T
 */
export interface SRService<T extends SRModule> {
    module: T;
    dispose(): void;
}

export interface SRServiceCtor<T extends SRModule> {
    new(): SRService<T>;
}

const METADATA_KEY_SERVICE_FLAG = Symbol('sr:serviceFlag');

export function isService(instance: {}): instance is SRService<any> {
    return Reflect.hasMetadata(METADATA_KEY_SERVICE_FLAG, instance.constructor);
}

/**
 * decorator, 声明服务。
 * - 会自动添加module的注入。
 * - 会在构造函数末尾添加一个异步的对注入环境的检查（如module的存在性）。
 *
 * @author Helcarin
 * @export
 * @template T
 * @param moduleClass
 * @returns
 */
export function SRService<T extends SRModule>(moduleClass: Type<T>) {
    return <TFunction extends new () => SRService<T>>(target: TFunction): TFunction => {
        const cls = class extends (target as Type<SRService<T>>) {
            constructor() {
                super();

                // 检查一下是否已经注入
                Promise.resolve().then(() => {
                    if (!(this.module && this.module instanceof moduleClass)) {
                        throw new Error('SRService is not injected correctly.');
                    }
                });
            }
        };

        // 自动添加对module的注入
        Inject(SRModule)(cls.prototype, 'module');

        Reflect.defineMetadata(METADATA_KEY_SERVICE_FLAG, true, cls);

        return cls as TFunction;
    };
}
