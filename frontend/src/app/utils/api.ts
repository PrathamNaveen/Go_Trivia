export interface TriviaProps {
  amount: number;
  category?: string;
  difficulty?: string;
}

export interface TriviaQuestion {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const BASE_URL = apiUrl || "http://localhost:8080";

export async function startTrivia(props: TriviaProps) {
  const res = await fetch(`${BASE_URL}/trivia-startup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(props),
  });

  return res.json();
}

export async function getNextTrivia(): Promise<TriviaQuestion> {
  const res = await fetch(`${BASE_URL}/trivia-next`);
  if (!res.ok) throw new Error("No more questions or API error");
  return res.json();
}
