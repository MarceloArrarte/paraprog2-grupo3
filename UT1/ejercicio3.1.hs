data Angle = Degrees Double | Radians Double | Gradians Double
    deriving(Show)

toRadians :: Angle -> Angle
toRadians a@(Radians _) = a
toRadians (Degrees deg) = Radians (deg / (180 / pi))
toRadians (Gradians grad) = Radians (grad / (200 / pi))

toDegrees :: Angle -> Angle
toDegrees (Radians rad) = Degrees (rad * (180 / pi))
toDegrees a@(Degrees _) = a
toDegrees (Gradians grad) = Degrees (grad / 400 * 360)

toGradians :: Angle -> Angle
toGradians (Radians rad) = Gradians (rad * (200 / pi))
toGradians (Degrees deg) = Gradians (deg * 400 / 360)
toGradians a@(Gradians _) = a


asDegrees :: Angle -> Double
asDegrees a = let (Degrees d) = toDegrees a in d

instance Eq Angle where
    a1 == a2 = diff < epsilon
        where
            diff = abs (asDegrees a1 - asDegrees a2)
            epsilon = 1e-15

instance Ord Angle where
    a1 <= a2 = asDegrees a1 < asDegrees a2 || a1 == a2