module Main where

import Data.List (intercalate, nub)
import System.IO (getLine)
import System.Environment (getArgs)
import Syntax.Lexer (alexScanTokens, Token (TokenId))
import Syntax.Parser (parse)
import Semantics.Interpreter (evalStmt, State)
import Semantics.Compiler (ilCompileCode)
import Syntax.CodeRepr (Stmt)
import qualified Control.Monad
import System.Process (system)
import Distribution.Compat.Prelude (ExitCode(ExitSuccess, ExitFailure), exitSuccess)

getLines :: IO String
getLines = do
  line <- getLine
  if (null line) then return line else do
    rest <- getLines
    return (line ++ '\n':rest)


data ReplMode = OnlyTokens | OnlyAST | Evaluate | Compile deriving (Eq, Show)

getReplModeFromArgs :: [String] -> ReplMode
getReplModeFromArgs ("-t":_) = OnlyTokens
getReplModeFromArgs ("-a":_) = OnlyAST
getReplModeFromArgs [] = Evaluate
getReplModeFromArgs ("-c":_) = Compile
getReplModeFromArgs args = error ("Unrecognized args "++ (intercalate " " args))


repl :: ReplMode -> State -> IO ()
repl m s = do
  putStrLn "Ingrese código While:"
  code <- getLines
  moduleName <- if m == Compile then do
      putStrLn "Ingrese nombre del módulo a compilar:"
      getLine
    else
      return ""

  let (output, nextState) = processInput m code s moduleName
  print output

  Control.Monad.when (m == Compile) $ do
    writeFileAndAssemble moduleName output
    exitSuccess
        
  repl m nextState


ilasmPath = "C:\\Windows\\Microsoft.NET\\Framework\\v4.0.30319\\ilasm.exe"

writeFileAndAssemble :: String -> String -> IO ()
writeFileAndAssemble moduleName ilCode = do
    let outputFileName = moduleName ++ ".txt"
    writeFile outputFileName ilCode
    ilasmResult <- system (ilasmPath ++ " " ++ outputFileName ++ " /exe")
    case ilasmResult of
        ExitSuccess   -> putStrLn "EXE de salida generado con éxito."
        ExitFailure _ -> putStrLn "Error al generar EXE."


readTokens :: String -> [Token]
readTokens = alexScanTokens

parseTokens :: String -> Stmt
parseTokens = parse . readTokens

processInput :: ReplMode -> String -> State -> String -> (String, State)
processInput OnlyTokens input state _  = (show (readTokens input), state)

processInput OnlyAST input state _ = (show (parse tokens), state)
  where
    tokens = readTokens input

processInput Evaluate input state _ =
  ("// "++ intercalate ", " [var ++"="++ (show val) | (var, val) <- nextState] ++".", nextState)
  where
    ast = parseTokens input
    nextState = evalStmt ast state

processInput Compile input state moduleName =
  (intercalate "\n" (ilCompileCode ast moduleName), state)
  where
    ast = parseTokens input


compile :: String -> String -> IO ()
compile whilCode moduleName = writeFileAndAssemble moduleName ilOutput
  where
    ilOutput = fst $ processInput Compile whilCode [] moduleName


test1 = compile "{x = 1; y = 2; if (x <= 3) {z = 25;} else {z = 10;}}" "Test1"
test2 = compile "{x = 1; y = 2; if (x == y) {z = 3;} else {z = 5;}}" "Test2"
test3 = compile "{x = 1; y = 2; if (x <= y) {if (2 == 4) {z = 3;} else {z = 18;}} else {if (7 <= 10) {z = 5;} else {z = 6;}}}" "Test3"
test4 = compile "{if (2 <= 1) {z = 5;} else {z = 23;}}" "Test4"
test5 = compile "{x = 3; y = 1; while (x <= 10) {y = (y + 3) * 2; x = x + 1;}}" "Test5"
test6 = compile "{x = 3; y = 1; while (true) {y = y + 1; x = x + 1;}}" "Test6"
test7 = compile "{x = 3; if (x >= 4) {y = 53;} else {y = 18;}}" "Test7"
test8 = compile "{x = 3; if (x == 3 || x == 3) {y = 4;} else {y = 9;}}" "Test8"
test9 = compile "{x = 25; y = 8; z = x / y;}" "Test9"
test10 = compile "{x = 1; y = 1; z = 0; while (x <= 10) {while (y <= 10) {z = z + 2; y = y + 1;} y = 1; x = x + 1;}}" "Test10"
test11 = compile "{x = 1; y = 2; if (x - y <= x + y) {z = 1;} else {z = 2;}}" "Test11"
test12 = compile "{x = 50; if (x + 1 <= 10 && true) {z = 1;} else {z = 2;}}" "Test12"
test13 = compile "{x = 1; if (x > 2) {y = 1;} else {y = 2;}}" "Test13"
test14 = compile "{x = 1; if (x > 0) {y = 1;} else {y = 2;}}" "Test14"
test15 = compile "{x = 1; if (x < 2) {y = 1;} else {y = 2;}}" "Test15"
test16 = compile "{x = 1; if (x < 0) {y = 1;} else {y = 2;}}" "Test16"
test17 = compile "{x = 3; if (x >= 4) {y = 53;} else {y = 18;}}" "Test17"
test18 = compile "{x = 4; if (x >= 4) {y = 53;} else {y = 18;}}" "Test18"
test19 = compile "{x = 5; if (x >= 4) {y = 53;} else {y = 18;}}" "Test19"
test20 = compile "{if (false || false) {x = 1;} else {x = 2;}}" "Test20"
test21 = compile "{if (false || true) {x = 1;} else {x = 2;}}" "Test21"
test22 = compile "{if (true || false) {x = 1;} else {x = 2;}}" "Test22"
test23 = compile "{if (true || true) {x = 1;} else {x = 2;}}" "Test23"


main :: IO ()
main = do
  args <- getArgs
  repl (getReplModeFromArgs args) []