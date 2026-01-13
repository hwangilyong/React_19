import { useSearchParams } from 'react-router-dom';

type QueryParamType = 'string' | 'number' | 'boolean';
type QueryParamValue = string | number | boolean;

type QueryParamOptions<T> = {
  type: QueryParamType;
  defaultValue: T;
  replace?: boolean;
};

export function useQueryParams<T extends Record<string, QueryParamValue>>(
  schema: {
    [K in keyof T]: QueryParamOptions<T[K]>;
  }
): readonly [T, (next: Partial<T>) => void] {
  const [searchParams, setSearchParams] = useSearchParams();

  /** 현재 URLSearchParams를 schema 타입에 맞게 파싱 */
  const values = Object.keys(schema).reduce((acc, key) => {
    const raw = searchParams.get(key);
    const option = schema[key as keyof T];

    if (raw == null) {
      acc[key as keyof T] = option.defaultValue;
    } else {
      switch (option.type) {
        case 'number': {
          /** 숫자 파싱 실패 시 기본값으로 복구 */
          const parsed = Number(raw);
          acc[key as keyof T] = (Number.isNaN(parsed)
            ? option.defaultValue
            : parsed) as T[keyof T];
          break;
        }
        case 'boolean': {
          /** boolean 처리 */
          const normalized = raw.toLowerCase();
          acc[key as keyof T] = (
            normalized === 'true' || normalized === '1'
          ) as T[keyof T];
          break;
        }
        default:
          acc[key as keyof T] = raw as T[keyof T];
      }
    }
    return acc;
  }, {} as T);

  /** schema 중 replace가 있으면 history replace로 갱신 */
  const setValues = (next: Partial<T>) => {
    const shouldReplace = Object.values(schema).some(
      (option) => option.replace
    );

    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);

        Object.entries(next).forEach(([key, value]) => {
          const option = schema[key as keyof T];
          /** 기본값/빈값은 URL에서 제거 */
          if (
            value == null ||
            value === '' ||
            value === option.defaultValue
          ) {
            params.delete(key);
          } else {
            params.set(key, String(value));
          }
        });

        return params;
      },
      { replace: shouldReplace }
    );
  };

  return [values, setValues] as const;
}
