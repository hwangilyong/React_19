/**
 * @AutoLog({ stopOnError, logArgs })
 * - 메서드 실행 시 자동 로그를 출력하는 데코레이터 팩토리
 * - 옵션에 따라 에러 발생 시 throw 여부를 제어할 수 있음
 *
 * @param stopOnError - true이면 에러 발생 시 throw (함수 즉시 종료)
 * @param logArgs - true이면 호출 시 전달된 인자를 로그로 출력
 *
 * 사용 예시:
 *   @AutoLog({ stopOnError: true })
 *   addPoint() { ... }
 */
interface AutoLogOptions {
    /** 에러 발생 시 함수 실행을 중단할지 여부 */
    stopOnError?: boolean;
    /** 호출 시 전달된 인자를 로그로 찍을지 여부 */
    logArgs?: boolean;
    /** 호출 위치(스택) 로그 여부 */
    traceCaller?: boolean;
}

/**
 * AutoLog 데코레이터는 다음 두 가지 방식으로 사용 가능합니다:
 * 1. @AutoLog  (괄호 없이 사용) - 기본적으로 stopOnError = false 설정
 * 2. @AutoLog({...}) (옵션과 함께 사용)
 *
 * 기본 동작은 non-blocking(에러 발생 시 throw하지 않음)이며, stopOnError: true로 명시해야 throw합니다.
 */
export function AutoLog(options?: AutoLogOptions | Object, propertyKey?: string | symbol, descriptor?: PropertyDescriptor): any {
    // 만약 @AutoLog (괄호 없이) 로 사용되었을 경우
    if (typeof options === 'object' && propertyKey && descriptor) {
        // stopOnError를 false로 하여 내부 데코레이터 생성 후 바로 실행 (기본: non-blocking)
        return createAutoLogDecorator({ stopOnError: false })(options, propertyKey, descriptor);
    }

    // @AutoLog({...}) 형태로 사용된 경우
    // 기본값도 stopOnError: false로 변경 (non-blocking)
    const finalOptions = (options as AutoLogOptions) || { stopOnError: false , logArgs: false};
    return createAutoLogDecorator(finalOptions);
}

/** 내부 데코레이터 생성 함수 */
function createAutoLogDecorator({ stopOnError = false, logArgs = false, traceCaller = false }: AutoLogOptions): MethodDecorator {
    return (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor): void => {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args: any[]) {
            const className = target.constructor?.name ?? 'UnknownClass';
            if (logArgs) console.debug(`[${className}:${String(propertyKey)}] called with`, args);

            if (traceCaller) {
                const stack = new Error().stack?.split('\n').slice(2, 6);
                console.debug(`[${className}:${String(propertyKey)}] called from:\n${stack?.join('\n')}`);
            }

            try {
                const result = originalMethod.apply(this, args);
                if (result instanceof Promise) {
                    return result.catch((err: Error) => {
                        console.warn(`[${className}:${String(propertyKey)}]`, err);
                        if (stopOnError) throw err;
                        return undefined;
                    });
                }
                return result;
            } catch (error) {
                console.warn(`[${className}:${String(propertyKey)}]`, error);
                if (stopOnError) throw error;
                return undefined;
            }
        };
    };
}
