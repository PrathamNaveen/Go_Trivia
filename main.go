package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

type TriviaProps struct {
	Amount     int    `json:"amount"`
	Category   string `json:"category"`
	Difficulty string `json:"difficulty"`
}

// Structure of a single trivia question from Open Trivia DB
type TriviaQuestion struct {
	Category         string   `json:"category"`
	Type             string   `json:"type"`
	Difficulty       string   `json:"difficulty"`
	Question         string   `json:"question"`
	CorrectAnswer    string   `json:"correct_answer"`
	IncorrectAnswers []string `json:"incorrect_answers"`
}

// Open Trivia API response structure
type TriviaAPIResponse struct {
	ResponseCode int              `json:"response_code"`
	Results      []TriviaQuestion `json:"results"`
}

// --- In-memory storage ---
var triviaQuestions []TriviaQuestion
var currentIndex int

// POST /trivia-startup
func triviaPost(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var data TriviaProps
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	fmt.Printf("Received POST: %+v\n", data)

	// Build Open Trivia API URL
	baseURL := "https://opentdb.com/api.php?"
	queryParams := fmt.Sprintf("amount=%d", data.Amount)
	if data.Category != "" {
		queryParams += "&category=" + data.Category
	}
	if data.Difficulty != "" {
		queryParams += "&difficulty=" + data.Difficulty
	}

	fullURL := baseURL + queryParams
	fmt.Println("Calling Open Trivia API:", fullURL)

	// Call Open Trivia API
	resp, err := http.Get(fullURL)
	if err != nil {
		http.Error(w, "Failed to fetch trivia", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	var apiResp TriviaAPIResponse
	err = json.NewDecoder(resp.Body).Decode(&apiResp)
	if err != nil {
		http.Error(w, "Failed to decode trivia response", http.StatusInternalServerError)
		return
	}

	// Store questions in memory
	triviaQuestions = apiResp.Results
	currentIndex = 0

	// Respond with success
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":    "success",
		"numStored": len(triviaQuestions),
	})
}

// GET /trivia-next
func triviaNext(w http.ResponseWriter, r *http.Request) {

	if currentIndex >= len(triviaQuestions) {
		http.Error(w, "No more questions available", http.StatusNotFound)
		return
	}

	q := triviaQuestions[currentIndex]
	currentIndex++

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(q)
}

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hello, World!")
	})

	http.HandleFunc("/greet", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Welcome to my Go backend!")
	})

	http.HandleFunc("/trivia-startup", triviaPost)
	http.HandleFunc("/trivia-next", triviaNext)

	log.Println("Server running at http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
