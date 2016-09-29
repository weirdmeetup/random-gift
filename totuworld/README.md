# random-gift

경품 추첨을 진행하기 위해 제작되었습니다.

## 목표
Node.js로 경품 추첨기를 만들어보자!!


## 실행방법
아래 사항은 모두 `totuworld` 폴더 내에서 이뤄져야합니다. 

### 로컬에 직접 설치하여 실행하기
> 필요사항 :  Node.js >= 4.x

1. 모듈 설치
    ```
    $ npm install
    ```

2. 실행

    ```
    $ npm start
    ```
    혹은 
    ```
    $ node ./bin/www
    ```

3. 브라우저로 [접속](http://localhost:4885)

### docker를 활용하여 처리하기
> 필요사항 : Docker >= 1.x

1. 이미지 생성
    ```
    $ docker build -t randomgift .
    ```

2. 생성된 `randomgift` 이미지로 컨테이너 생성
    ```
    $ docker run -d -p 4885:4885 randomgift
    ```

3. 브라우저로 [접속](http://localhost:4885)