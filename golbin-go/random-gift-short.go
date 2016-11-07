package main

import (
	"encoding/csv"
	"fmt"
	"io"
	"math/rand"
	"os"
	"time"
	"strconv"
)

func Shuffle(s [][]string) {
	rand.Seed(time.Now().UnixNano())

	for i := range s {
		j := rand.Intn(i + 1)
		s[i], s[j] = s[j], s[i]
	}
}

// Python 버전과의 비교를 위해 최대한 구조를 같게 만들었으며 예외처리등은 생략하였음
func main() {
	if len(os.Args) < 3 {
		fmt.Println("Usage: go run random-gift.go product.csv email.csv")
		return
	}

	// 1/2 이메일 추출 및 셔플

	f, _ := os.Open(os.Args[2])
	r := csv.NewReader(f)
	defer f.Close()

	email, _ := r.ReadAll()

	Shuffle(email)

	// 2/2 경품 배정

	f, _ = os.Open(os.Args[1])
	r = csv.NewReader(f)
	defer f.Close()

	total := 0

	for {
		row, err := r.Read()

		if err == io.EOF {
			break
		}

		count, _ := strconv.Atoi(row[1])
		for i := 0; i < count; i++ {
			fmt.Printf("%s - %d - %s\n", row[0], i + 1, email[total][0])
			total = total + 1
		}
	}
}