import Html exposing (..)
import Html.App as App
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import String exposing (toInt)
import Task
import Random
import Dom
import FileReader exposing (..)
import Csv exposing (..)

import Json.Decode as Json exposing (Value, andThen)

main : Program Never
main =
  App.program
  { init = init
  , view = view
  , update = update
  , subscriptions = subscriptions
  }

type alias Model =
  { selected : Files
  , message : String
  , emailList : List String
  , item : Item
  , winners : List Winner
  }

type alias Item =
  { name : String
  , count : Int
  }

type alias Winner =
  { email : String
  , uid : Int
  , itemName : String
  }

type alias Files =
  List NativeFile

type Msg
  = Noop
  | FileSelect Files
  | FileDataSucceed String
  | FileDataFail FileReader.Error
  | UpdateItemName String
  | UpdateItemCount String
  | ResetItem
  | Pick String Int
  | UpdateWinner String Int (Cmd Msg) Int

init : (Model, Cmd Msg)
init =
  (initModel, Cmd.none)

initModel : Model
initModel =
  Model
    [] -- csv files
    "CSV 파일을 선택해주세요!"
    []
    initItem
    []

initItem : Item
initItem =
  Item "" 1

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    Noop ->
      model ! []
    FileSelect files ->
      case files of
        [] ->
          initModel ! []
        _ ->
          { model | selected = files} ! List.map readTextFile files 
    FileDataSucceed str ->
      let
        parsedList = Csv.parse str
        emailList = List.filter (\email -> email /= "") (List.map extractEmail parsedList.records)
        newMessage = (Basics.toString (List.length emailList)) ++ "개의 이메일이 추가되었습니다 :)"
      in
        { model | emailList = emailList, message = newMessage } ! []
    FileDataFail err ->
      { model | message = FileReader.toString err } ! []
    UpdateItemName newName ->
      let
        oldItem = model.item
        newItem = { oldItem | name = newName }
      in
        { model | item = newItem } ! []
    UpdateItemCount newCount ->
      let
        oldItem = model.item
        newCountInt = toInt newCount
      in
        case newCountInt of
          Result.Ok n ->
            { model | item = { oldItem | count = n }} ! []
          Result.Err err -> -- ignore err msg; set to 0
            { model | item = { oldItem | count = 0 }} ! []
    ResetItem ->
        { model | item = initItem } 
          ! [Task.perform (always Noop) (always Noop) (Dom.focus "gift-name-input")]
    Pick name count ->
      let
        maxIdx = (List.length model.emailList - 1)
      in
        if List.length model.selected == 0 then
          { model | message = "파일을 먼저 선택해주세요!" } ! []
        else if name == "" then
          { model | message = "추첨하려는 경품 이름을 입력해주세요!"} ! []
        else if List.length model.emailList < count then
          { model | message = "주어진 이메일 개수가 경품수보다 적습니다!" } ! []
        else
          model ! 
          [(Random.generate
            (UpdateWinner
              name
              count
              (updateWinnerCmdWrapper name (maxIdx-1) (count-1)))
            (Random.int 0 maxIdx))
          ]
    UpdateWinner giftName idx nextCmd winnerIdx ->
      let
        winnerEmail = takeEmailFromList model.emailList winnerIdx
        newEmailList = emailListWithout model.emailList winnerIdx 
      in
        { model
        | emailList = newEmailList
        , winners = ( (Winner winnerEmail idx giftName) :: model.winners)
        }
          ! [nextCmd] -- Winner or Cmd.none

emailListWithout : List String -> Int -> List String
emailListWithout list idx =
  (List.take idx list) ++ (List.drop (idx+1) list)

takeEmailFromList : List String -> Int -> String
takeEmailFromList list idx =
  let
    restList = List.drop idx list
  in
    case List.head restList of
      Just winner ->
        winner
      Nothing ->
        "" -- never happen

updateWinnerCmdWrapper : String -> Int -> Int -> (Cmd Msg)
updateWinnerCmdWrapper name maxIdx count =
  if count == 0 then
    Task.perform identity identity (Task.succeed ResetItem) -- send Msg without running Task
  else
    (Random.generate
      (UpdateWinner name count (updateWinnerCmdWrapper name (maxIdx-1) (count-1)))
      (Random.int 0 maxIdx)
    )

view : Model -> Html Msg
view model =
  div [style [("padding", "30px")]]
    [ h1 [] [text "Random gift"]
    , input
      [ type' "file"
      , onchange FileSelect
      , disabled (List.length model.selected > 0)
      , multiple False
      , accept ".csv"
      ] []
    , div [style [("padding", "10px")]] [ text model.message ]
    , itemDiv model
    , winnerDiv model.winners
    ]

itemDiv : Model -> Html Msg
itemDiv model = 
  div [style [("padding", "10px 0")]]
    [ input
        [ style inputStyle
        , type' "text"
        , id "gift-name-input"
        , placeholder "경품이름"
        , value model.item.name
        , onInput (UpdateItemName)
        ] []
    , input
        [ style (("width", "30px")::inputStyle)
        , type' "number"
        , placeholder "0"
        , value (Basics.toString model.item.count)
        , onInput (UpdateItemCount)
        ] []
    , button
      [ onClick (Pick model.item.name model.item.count)
      , title "경품 종류당 한번만 추첨할 수 있습니다"
      ] [text "추첨"]
    ]

winnerDiv : List Winner -> Html Msg
winnerDiv winners =
  case winners of
    [] ->
      div [] []
    _ ->
      div [] (List.map (\winner -> (div [] [text (winnerText winner)])) winners)

winnerText : Winner -> String
winnerText winner =
  winner.itemName ++ " - " ++ (Basics.toString winner.uid) ++ " - " ++ winner.email

inputStyle : List (String, String)
inputStyle = [("margin-right", "5px")]

onchange : (List NativeFile -> a) -> Attribute a
onchange action =
  on
    "change"
      (Json.object1 (\v -> action v) parseSelectedFiles)

readTextFile : NativeFile -> Cmd Msg
readTextFile fileValue =
    readAsTextFile fileValue.blob
        |> Task.perform FileDataFail FileDataSucceed

extractEmail : List String -> String
extractEmail line =
  case List.head line of
    Just email ->
      email
    Nothing ->
      ""

subscriptions : Model -> Sub Msg
subscriptions model =
  Sub.none