module Test exposing (Test(Suite, Test), it, describe)

{-| This module provides means to define a test suite. Test suite is a tree formed from other test suites which
has tests as its leafs. API is similar to that of Jasmine for JavaScript.

# Definition
@docs Test.Suite, Test.Test

# Constructing Tests
@docs it, describe

-}

import Expectation exposing (Expectation)

{-| Tests that can be executed. Tests can be either simple tests that have only one expectation
or test suites which group other test suites and simple tests together.

    -- Test suite consisting of two tests
    Suite
      "mySuite"
      [
        Test "test +" eql(2, 1 + 1)
        , Test "test -" eql(2, 3 - 1)
      ]

 It is expected that tests and suite are constructed using helper methods `describe` and `it` rather
 than by using `Suite` and `Test` directly.

    -- Same test suite consisting of two tests, but declared using `describe` and `it`
    describe
      "mySuite"
      [
        it "should add" eql(2, 1 + 1)
        , it "should subtract" eql(2, 3 - 1)
      ]
-}
type Test = Suite String (List Test) | Test String Expectation

{-| Constructs a single simple test.

    -- Simple test
    it "should add" eql(2, 1 + 1)
-}
it: String -> Expectation -> Test
it message expectation =
  Test message expectation

{-| Constructs a test suite consisting of other test suites or simple tests.

    -- Test suite
    describe "Arithmetic"
     [
       describe "+"
         [
           it "should be commutative"
             eql(1 + 2, 2 + 1)
           it "should have neutral element"
             eql(0 + 2, 2)
         ]
      , describe "*"
         [
           it "should be commutative"
             eql(3 * 2, 2 * 3)
           it "should have neutral element"
             eql(1 * 2, 2)
         ]
    ]
-}
describe: String -> List Test -> Test
describe description suites =
  Suite description suites