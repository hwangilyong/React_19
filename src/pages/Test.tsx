import useGlobalStore from "../app/store/useGlobalStore.ts";

const Test = () => {
    const [value, setValue] = useGlobalStore('COUNT');
    const onIncrement = () => {
        setValue(value + 1);
    }

    return (
        <div className="card">
            <button onClick={onIncrement}>
                count is {value}
            </button>
            <p>
                Edit <code>src/App.tsx</code> and save to test HMR
            </p>
        </div>
    );
};

export default Test;