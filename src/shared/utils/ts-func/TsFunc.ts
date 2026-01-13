type AnyCtor = abstract new (...args: any[]) => any;

export function isInstanceOfAny<T>(
    obj: unknown,
    classes: AnyCtor[]
): obj is T {
    return classes.some(cls => obj instanceof cls);
}