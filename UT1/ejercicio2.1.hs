allEqual :: (Eq a) => [a] -> Bool
allEqual []              = error "'lista' debe tener al menos dos elementos"
allEqual [_]             = error "'lista' debe tener al menos dos elementos"
-- allEqual (primero:resto) = all (primero ==) resto
allEqual (primero:resto) = foldl (==) True (map (primero ==) resto)


allEqual2 :: (Eq a) => [a] -> Bool
allEqual2 []   = error "'lista' debe tener al menos dos elementos"
allEqual2 [_]  = error "'lista' debe tener al menos dos elementos"
allEqual2 (first:rest) = foldr1 (&&) (map (first == ) rest)