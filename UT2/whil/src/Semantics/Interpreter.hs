{-# OPTIONS_GHC -Wno-unrecognised-pragmas #-}
{-# HLINT ignore "Redundant bracket" #-}
module Semantics.Interpreter where

import Syntax.CodeRepr

type State = [(String, Int)]

updateState :: String -> Int -> State -> State
updateState x v s = (x, v):(filter (\(y, _) -> x /= y) s)

evalAExp :: AExp -> State -> Int
evalAExp (Num n) _ = n
evalAExp (Var x) s = let (Just v) = (lookup x s) in v
evalAExp (Add a1 a2) s = (evalAExp a1 s) + (evalAExp a2 s)
evalAExp (Sub a1 a2) s = (evalAExp a1 s) - (evalAExp a2 s)
evalAExp (Mult a1 a2) s = (evalAExp a1 s) * (evalAExp a2 s)
evalAExp (Div a1 a2) s = (evalAExp a1 s) `div` (evalAExp a2 s)

evalBExp :: BExp -> State -> Bool
evalBExp (BoolLit b) _ = b
evalBExp (CompEq a1 a2) s = (evalAExp a1 s) == (evalAExp a2 s)
evalBExp (CompLtEq a1 a2) s = (evalAExp a1 s) <= (evalAExp a2 s)
evalBExp (CompGtEq a1 a2) s = (evalAExp a1 s) >= (evalAExp a2 s)
evalBExp (CompLt a1 a2) s = (evalAExp a1 s) < (evalAExp a2 s)
evalBExp (CompGt a1 a2) s = (evalAExp a1 s) > (evalAExp a2 s)
evalBExp (Neg b1) s = not (evalBExp b1 s)
evalBExp (And b1 b2) s = (evalBExp b1 s) && (evalBExp b2 s)
evalBExp (Or b1 b2) s = (evalBExp b1 s) || (evalBExp b2 s)

evalStmt :: Stmt -> State -> State
evalStmt (Assign x a) s = (x, v):(filter (\(y, _) -> x /= y) s)
  where v = evalAExp a s
evalStmt (Seq stmts) s = foldl (\s stmt -> evalStmt stmt s) s stmts
evalStmt (IfThenElse b s1 s2) s = evalStmt (
  if (evalBExp b s) then s1 else s2) s
evalStmt (WhileDo b s1) s = if (evalBExp b s) then (
  evalStmt (WhileDo b s1) (evalStmt s1 s)) else s
