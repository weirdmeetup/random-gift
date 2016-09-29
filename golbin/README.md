# 사용법

1. product.csv 에 샘플을 참조(경품명,갯수)하여 경품 목록을 넣는다.
2. email.csv 에 샘플을 참조하여 이메일 목록을 넣는다.
3. Linux, macOS, Windows(cygwin) 쉘에서 다음의 명령어를 사용한다.

```
# ./random-gift.py product.csv email.csv
```

# 주의

- Python 이 설치되어 있어야 함
- 각 CSV 파일 안에는 헤더(필드명) 열이 없어야 됨
- 옵션이 잘못되었거나, 파일이 없거나 등등에 대한 고려는 하지 않음
