import { configureStore } from "@reduxjs/toolkit"
import ProfessorSlice from "./slice/ProfessorSlice"


const store = configureStore({
    reducer: {
        ProfessorSlice: ProfessorSlice,
    }
});

export default store;