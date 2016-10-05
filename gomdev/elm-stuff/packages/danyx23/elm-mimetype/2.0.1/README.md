#Elm MimeType

Models the most common mime types as a Union type in Elm and provides a method to 
parse mime types from a string.

This library currenlty does not allow complete round-tripping. This means that 
if you parse a mime type and it is recognized as on of the unrepresented types
(e.g. if you parse "image/tiff", it will be represented as the type `Image OtherImage`),
turning it into a String again will lead to a different string than the one that
was originally parsed (in our example it would result in "image/other"). A future
version of this library will fix this problem by storing the original string 
representation.

The basic usage is to parse the mime type from a string identifier and then match against it, e.g.

```elm
let
    maybeMimeType = parseMimeType someMimeIdentifierString
  in
    case maybeMimeType of
      Nothing ->
        "Could not be parsed as a mime type at all"
      Just mimeType ->
        case mimeType of
          Image subtype ->
            if (subtype == MimeType.Jpeg) then
              "Successfully parsed as jpeg image"
            else
              "Some image, but not a jpeg"
          _ ->
            "Other mime type"      
```

by Daniel Bachler