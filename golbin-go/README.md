# 사용법

먼저 다음과 같이 패키지를 내려받은 뒤

```
# go get github.com/weirdmeetup/random-gift/golbin-go
# cd $GOPATH/src/github.com/weirdmeetup/random-gift/golbin-go
```

1. product.csv 에 샘플을 참조(경품명,갯수)하여 경품 목록을 넣는다.
2. email.csv 에 샘플을 참조하여 이메일 목록을 넣는다.
3. Linux, macOS, Windows(cygwin) 쉘에서 다음의 명령어를 사용한다.

```
# go run random-gift.go product.csv email.csv
```

# 종류

- random-gift-short.go 는 golbin-py/random-gift.py 를 거의 그대로 옮겨보려고 한 것
- random-gift.go 는 go 의 다양한 기능들을 한 번 사용해봄

# 주의

- Go 가 설치되어 있어야 하며, GOPATH가 잘 설정이 되어 있어야 함
- 각 CSV 파일 안에는 헤더(필드명) 열이 없어야 됨
- 옵션이 잘못되었거나, 파일이 없거나 등등에 대한 고려는 하지 않음
