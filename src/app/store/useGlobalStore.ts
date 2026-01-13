import { create } from "zustand";

interface GlobalStateProps {
  TEST: string | undefined;
  COUNT: number;
}

/** 전역 상태의 기본값(초기화 기준) */
const GlobalState = {
  TEST: "",
  COUNT: 0,
} as GlobalStateProps;

/** setState처럼 값을 직접 주거나 updater 함수를 받을 수 있게 하는 타입 */
type StateUpdater<T> = T | ((prev: T) => T);

interface GlobalStore extends GlobalStateProps {
  setGlobalState: <K extends keyof GlobalStateProps>(
    key: K,
    value: StateUpdater<GlobalStateProps[K]>
  ) => void;
  clear: () => void;
}

/** 실제 zustand store (전체 상태 + 액션) */
const useAppGlobalStore = create<GlobalStore>((set) => ({
  ...GlobalState,
  setGlobalState: (key, value) =>
    set((state) => {
      /** updater 함수를 지원하기 위해 현재 값을 기반으로 계산 */
      const nextValue =
        typeof value === "function"
          ? (
              value as (prev: GlobalStateProps[typeof key]) => GlobalStateProps[typeof key]
            )(state[key])
          : value;
      return { [key]: nextValue } as Partial<GlobalStateProps>;
    }),
  /** 전역 상태를 기본값으로 초기화 */
  clear: () => set(() => ({ ...GlobalState })),
}));

/** 특정 키만 구독하고 setState 스타일로 업데이트하는 훅 */
const useGlobalStore = <K extends keyof GlobalStateProps>(globalKey: K) => {
  const value = useAppGlobalStore((state) => state[globalKey]);
  const setGlobalState = useAppGlobalStore((state) => state.setGlobalState);

  /** React setState처럼 값/업데이터 함수를 모두 지원 */
  const setValue = (nextValue: StateUpdater<GlobalStateProps[K]>) => {
    setGlobalState(globalKey, nextValue);
  };

  return [value, setValue] as const;
};

export default useGlobalStore;
