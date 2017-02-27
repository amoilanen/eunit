module Runner exposing (runAll)

{-| Test runner that produces `Html msg` as its output.

# Running tests
@docs runAll

    --Complete example of create an example test suite and running it
    import Expectation exposing (eql, isTrue)
    import Test exposing (it, describe, Test)
    import Runner exposing (runAll)

    import Html exposing (Html)

    all : Test
    all = describe "Arithmetic operations"
      [ describe "Addition"
        [ it "should add two positive numbers" <|
            eql (1 + 2) 3
        , it "should be commutative" <|
            eql (1 + 2) (2 + 1)
        , it "should be associative" <|
            eql ((1 + 2) + 3) (1 + (2 + 3))
      ]
    ]

    main : Html msg
    main =
      runAll all

-}

import Html exposing (..)
import Html.Attributes exposing (..)
import List exposing (..)
import Json.Encode exposing (object, int, string, encode)

import Test exposing (..)
import CssStyles exposing (..)

type alias SuiteStats =
  { passed: Int
   , failed: Int
  }

type alias RunnerResult msg =
  { suiteStats: SuiteStats
    , report: Html msg 
  }

run: Test -> RunnerResult msg
run test =
  case test of
    (Suite description tests) ->
      let
        childResults = List.map run tests
        childReports = List.map .report childResults
        suiteStats = childResults
          |> List.map .suiteStats
          |> List.foldl
               (\stats total ->
                 SuiteStats (stats.passed + total.passed) (stats.failed + total.failed)
               )
               (SuiteStats 0 0)
        suiteReport = div [class "describe"] ([text(description)] ++ childReports)
      in
        RunnerResult suiteStats suiteReport
    (Test description expectation) ->
      let
        hasPassed = expectation.check()
        testClass = if hasPassed then
          "pass"
        else
          "fail"
        testStats = if hasPassed then
          SuiteStats 1 0
        else
          SuiteStats 0 1
        testDetails = if hasPassed then
          [text(description)]
        else
          [text(description), div [class "errorMessage"] [text(expectation.errorMessage)]]
        testReport = (div [class testClass] testDetails)
      in
        RunnerResult testStats testReport

getDescription: Test -> String
getDescription test =
  case test of
    (Suite description tests) ->
      description
    (Test description expectation) ->
      description

{-| Run the test suite.

    -- Custom expectation
    all : Test
    all = it "should add two positive numbers" <|
            eql (1 + 2) 3

    main : Html msg
    main =
      runAll all
-}
runAll: Test -> Html msg
runAll testSuite =
  let
    runnerResult = run testSuite
    suiteStats = runnerResult.suiteStats
    statusString = String.join " " ["Passed: ", toString suiteStats.passed,
                                  "Failed: ", toString suiteStats.failed]
    testReportTitle = if suiteStats.failed > 0 then
      h3 [class "fail"] [text("Tests failed!")]
    else
      h3 [] [text("All tests passed")]
    htmlReport = runnerResult.report
    suiteSummary = Json.Encode.object [
      ("passed", int suiteStats.passed)
      , ("failed", int suiteStats.failed)
      , ("description", string (getDescription testSuite) )
    ]
    suiteSummaryJson = encode 0 suiteSummary
  in
    div []
      [ 
        commonCssStyles
        , testReportTitle
        , h4 [class "test-summary"] [
            div [class "json-summary"] [text(suiteSummaryJson)]
            , text(statusString)
          ]
        , htmlReport
      ]