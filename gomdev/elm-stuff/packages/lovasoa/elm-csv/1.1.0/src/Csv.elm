module Csv exposing (Csv, parse, parseWith, split, splitWith)

{-| A CSV parser.

## Parser
@docs Csv, parseWith, parse, split, splitWith
-}

import List
import String
import Maybe
import Regex


{-| The `Csv` type structure.
-}
type alias Csv =
  { headers : List String
  , records : List (List String)
  }


{-| Convert a string of comma-separated values into a `Csv` structure.

    -- { headers = ["id", "value"], records = [["1", "one"], ["2", "two"]] }

    Csv.parse "id,value\n1,one\n2,two\n"
-}
parse : String -> Csv
parse = parseWith ","

{-| Convert a string of values separated by a *separator* into a `Csv` structure.

    -- { headers = ["id", "value"], records = [["1", "one"], ["2", "two"]] }
    Csv.parseWith "," "id,value\n1,one\n2,two\n"
-}
parseWith : String -> String -> Csv
parseWith separator lines =
  let
    values = splitWith separator lines

    headers =
      List.head values
        |> Maybe.withDefault []

    records =
      List.drop 1 values
  in
    { headers = headers
    , records = records
    }


{-| Convert a string of comma-separated values into a list of lists.

    -- [["id", "value"], ["1", "one"], ["2", "two"]]

    Csv.split "id,value\n1,one\n2,two\n"
-}
split : String -> List (List String)
split = splitWith ","

{-| Convert a string of values separated by a character into a list of lists.

    -- [["id", "value"], ["1", "one"], ["2", "two"]]
    Csv.splitWith "," "id,value\n1,one\n2,two\n"
-}
splitWith : String -> String -> List (List String)
splitWith separator lines =
  let
    values =
      String.lines lines
        |> List.filter (\x -> not (String.isEmpty x))
  in
    List.map (splitLineWith separator) values


{-| Split a CSV line, with the traditional comma separator
-}
splitLine : String -> List String
splitLine = splitLineWith ","

{-| Split a CSV line with the given separator
-}
splitLineWith : String -> String -> List String
splitLineWith separator line =
  let
    values =
      String.split separator line
  in
    List.map (trimQuotes << String.trim) values

{-| Extract text from a csv field

  trimQuotes "abc" == "abc"
  trimQuotes "\"this is a \"\"test\"\" ! \"" == "This is a \"test\" ! "
-}
trimQuotes : String -> String
trimQuotes value =
  let
    start =
      String.startsWith "\"" value

    end =
      String.endsWith "\"" value
  in
    if start && end then
      -- Replace escaped quotes like "" and \"
      Regex.replace Regex.All (Regex.regex "[\"\\\\]\"") (always "\"") value
        |> String.dropRight 1
        |> String.dropLeft 1
    else
      value
