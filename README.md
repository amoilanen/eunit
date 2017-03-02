# eunit

Minimalistic unit testing framework for Elm.

## Installation

We need to install a PhantomJS-based test runner and the test package itself.

1. Test runner.

Execute

```
npm install -g eunit-runner
```

to install the command line test runner globally

2. Elm test package.

In the root directory of an Elm project execute

```
elm-package install antivanov/eunit
```

to install the `eunit` Elm package


## Creating tests

To generate a test example run `eunit init` in the root directory of an Elm project to which tests should be added.
Test example should be created in `test/Main.elm`

```elm
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
    , describe "Multiplication"
    [
      it "should multiply two positive numbers" <|
        eql (2 * 3) 6
      , it "should be commutative" <|
        eql (2 * 3) (3 * 2)
      , it "should be associative" <|
        eql ((2 * 3) * 4) (2 * (3 * 4))
    ]
    , describe "Subtraction"
    [
      it "should subtract two  numbers" <|
        eql (2 - 3) -1
      , it "should be commutative?" <| -- Failing test, subtraction is not commutative!
        eql (2 - 3) (3 - 2)
      , it "should be associative?" <| -- Failing test, subtraction is not associative!
        isTrue (((2 - 3) - 4) == (2 - (3 - 4)))
    ]
  ]

main : Html msg
main =
  runAll all
```

Test structure should be self-explanatory, it is inspired largely by Jasmine. Some differences: 

* Test defined by `it` can have only one expectation 
* Available expectations are only limited to `eql`, `isTrue`, `isFalse`
* There is no `beforeEach` and `afterEach` as tests are written for stateless functions and do not require setting up shared state

## Running tests

### In browser

Tests can be simply run in browser, just start elm-reactor in the root directory of the project and access `test/Main.elm`. Running tests in a browser can be a good way to debug a particular test failure.

### Command line

Make sure that `eunit-runner` NPM package is installed globally, run `eunit` in the root directory of the project.
You should get an output like the following one:

```
  EUnit test runner 
 Running test suite... 
 
  Arithmetic operations 
 
  .......xx 
 Elapsed time: 500ms 
 Passed: 7 
 FAILED: 2 
 To debug run 'elm-reactor -p 9908 ' and open http://localhost:9908/test/Main.elm in a browser for more details.
```

#### Troubleshooting

Sometimes Elm reactor would not be able to start due to some issues in `elm-make` https://github.com/elm-lang/elm-package/issues/254 "elm-make: Map.!: given key is not an element in the map"

In case the following error is encountered

```
EUnit test runner 
 Running test suite... 
 
  ERROR: Could not run tests... More details below:
elm-make: Map.!: given key is not an element in the map
```

remove the folder `elm-stuff` and try running the test cases again, now they should be executed successfully