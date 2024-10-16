data AExp = Num Int | Var String
          | Add AExp AExp | Sub AExp AExp
          | Mult AExp AExp | Opp AExp
          deriving (Eq, Show)

zero = Num 0
one = Num 1
minusOne = Sub zero one
varX = Var "x"
xPlus1 = Add (Var "x") one
onePlusTwoTimesThree = Add (Num 1) (Mult (Num 2) (Num 3))


data BExp = BLit Bool
    | Equals AExp AExp | LessEq AExp AExp
    | Neg BExp | And BExp BExp
    deriving (Eq, Show)

data Stmt = Assign String AExp
    | Skip | Comp Main.Stmt Main.Stmt
    | If BExp Main.Stmt
    | While BExp Main.Stmt

stmt1 = Comp
    (Assign "x" (Num 77))
    (Assign "y" (Add (Var "x") (Var "x")))

stmt2 = Comp
    (Assign "x" (Opp (Num 32)))
    (If (Neg (LessEq (Var "x") (Num 0)))
        (Assign "x" (Sub (Num 0) (Var "x"))))

stmt3 = Comp
    (Comp
        (Assign "n" (Num 5))
        (Assign "f" (Num 1)))
    (While
        (LessEq (Num 1) (Var "n"))
        (Comp
            (Assign "f" (Mult (Var "f") (Var "n")))
            (Assign "n" (Sub (Var "n") (Num 1)))))