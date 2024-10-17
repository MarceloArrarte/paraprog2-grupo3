data AExp = Num Int | Var String
          | Add AExp AExp | Sub AExp AExp
          | Mult AExp AExp deriving (Eq, Show)

zero = Num 0
one = Num 1
minusOne = Sub zero one
varX = Var "x"
xPlus1 = Add (Var "x") one
onePlusTwoTimesThree = Add (Num 1) (Mult (Num 2) (Num 3))