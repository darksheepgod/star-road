import { Injector, OnIsInjectedIntoTarget } from '17zy_celestials_lib_di';
import { SRComponent } from './component';
import { isService, SRService } from './service';

/**
 * 模块（基类）
 *
 * @author Helcarin
 * @export
 * @class SRModule
 */
export class SRModule {
    public readonly injector: Injector;

    protected services: Set<SRService<this>> = new Set();

    constructor() {
        this.injector = new Injector();
        this.injector.addDependency(SRModule, this);
    }

    @OnIsInjectedIntoTarget
    protected onInjectIntoOther(injector: Injector, target: {}, propName: string | symbol): void {
        if (isService(target)) {
            this.services.add(target);
        }
    }

    /**
     * 获取服务，不存在就创建
     *
     * @author Helcarin
     * @template T
     * @param cls
     * @returns
     */
    public getService<T extends SRService<this>>(cls: new () => T): T {
        return this.injector.provideDependency({ key: cls, classProvider: cls }) as T;
    }

    /**
     * 创建一个实例，并以模块环境进行注入
     *
     * @author Helcarin
     * @template T
     * @template U
     * @param cls
     * @param args
     * @returns
     */
    public getComponent<T extends SRComponent<this>, U extends Array<any>>(cls: new (...args: U) => T, ...args: U): T {
        const comp = new cls(...args);
        this.injector.injectInto(comp);
        comp.onInitialized();
        return comp;
    }

    public dispose(): void {
        this.services.forEach(service => service.dispose());
        this.services.clear();
    }
}
