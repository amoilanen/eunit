module Expectation exposing (Expectation, eql, isTrue, isFalse)

{-| This module provides means to define expectations. There should be exactly one expectation per one unit test.

# Definition
@docs Expectation

# Constructing expectations
@docs eql, isTrue, isFalse

-}

{-| Test expectation. Contains an `errorMessage` for the case when the test fails, and the `check` to be executed.

 Custom expectation

    isEmpty: a -> a -> Expectation
    isEmpty actual =
      Expectation "is string empty" (\() -> isEmpty actual)

 Usually there should be no need to define custom expectations as helper methods can be used `eql`, `isTrue`, `isFalse`
-}
type alias Expectation = {
  errorMessage: String,
  check: () -> Bool
}

{-| Equality expectation. Verifies that the actual value is equal to the expected one.

 Expecting that 3 == 3

    eql 3 3

 The following expectation can be constructed, but will fail verification

    eql 2 3
-}
eql: a -> a -> Expectation
eql expected actual =
  let
    errorMessage = "Expected " ++ toString expected ++ " instead encountered " ++ toString actual
  in Expectation errorMessage (\() -> expected == actual)

{-| Truth expectation. Verifies that the actual value is `True`.

 Examples, first will verify successfully, second will fail

    isTrue(2 == 2)
    isTrue(2 == 3)
-}
isTrue: Bool -> Expectation
isTrue actual =
  let
    errorMessage = "Expected to be True, instead False"
  in Expectation errorMessage (\() -> actual)

{-| Falsehood expectation. Verifies that the actual value is `False`.

 Examples, first will verify successfully, second will fail

    isFalse(2 == 3)
    isFalse(2 == 2)
-}
isFalse: Bool -> Expectation
isFalse actual =
  let
    errorMessage = "Expected to be False, instead True"
  in Expectation errorMessage (\() -> not actual)