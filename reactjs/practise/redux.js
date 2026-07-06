import { Provider, useSelector } from "react-redux";


const SliceOfCounter = createSlice({
    name: "counter_redux",
    initialState: {
        value: 0
    },
    reducers: {
        increment: (state) => {
            state.value += 1;
        },
        decrement: (state) => {
            state.value -= 1;
        },
        reset: (state) => {
            state.value = 0;
        }
    }
})

const { increment, decrement, reset } = SliceOfCounter.actions;

const store = configureStore({
    reducer: {
        harsha_store: SliceOfCounter.reducer
    }
})

const App = () => {
    <Provider store={store}>
        <Redux />
    </Provider>
}



const Redux = () => {

    const count_value = useSelector((state) => state.harsha_store.value);


    return (
        <>
            <h1>Redux</h1>

            <div>{count_value}</div>
        </>
    )
}
export default App;