# random-gift

경품 추첨을 진행하기 위해 제작되었습니다.


## 목표

.NET Core 로 경품 추첨기를 만들어보자!!


## 실행 환경

이 애플리케이션을 실행하고자 하는 컴퓨터에 .NET Core 환경이 설치되어 있어야 합니다. [이곳](https://www.microsoft.com/net/core)에서 본인의 운영체제에 맞는 환경을 다운로드 받고 설치합니다.


## 실행방법

이 리포지토리를 다운로드 받았다고 가정하고 아래 명령어를 차례로 실행시킵니다.

### 이동

```csharp
cd justinchronicle/src/RandomGift.Core.ConsoleApp
```


### 패키지 복원

```csharp
dotnet restore
```


### 애플리케이션 실행

```csharp
dotnet run sample.csv 2
```

* `sample.csv` 파일은 참가자의 이메일 주소가 들어있는 파일입니다.
* `2` 이 숫자는 경품 당첨자의 숫자입니다.


## 라이센스

MIT 라이센스를 따릅니다.
