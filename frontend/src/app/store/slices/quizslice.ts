import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface QuizState {
  username: string;
  quizStarted: boolean;
  questionIndex: number;
  loading: boolean;
  message: string;
}

const initialState: QuizState = {
  username: "",
  quizStarted: false,
  questionIndex: 0,
  loading: false,
  message: "",
};

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    setUsername(state, action: PayloadAction<string>) {
      state.username = action.payload;
    },
    startQuiz(state) {
      state.quizStarted = true;
      state.questionIndex = 0;
    },
    nextQuestion(state) {
      state.questionIndex += 1;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setMessage(state, action: PayloadAction<string>) {
      state.message = action.payload;
    },
    resetQuiz(state) {
      state.quizStarted = false;
      state.questionIndex = 0;
      state.message = "";
    },
  },
});

export const { setUsername, startQuiz, nextQuestion, setLoading, setMessage, resetQuiz } = quizSlice.actions;
export default quizSlice.reducer;
