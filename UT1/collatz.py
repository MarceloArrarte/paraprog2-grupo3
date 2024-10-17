def CollatzRecursiva(n):
    if(n > 1):
        if(n % 2 == 0):
           return (CollatzRecursiva(n/2) + 1)
        else:
            return (CollatzRecursiva(n*3 +1) +1)
    return 0

def CollatzIterativo(n):
    result = 0

    while(n > 1):
        if(n % 2 == 0):
            n = n/2
            result += 1
        else:
            n = (n*3 + 1)
            result += 1
    return result


print("Collatz recursivo:")
print(CollatzRecursiva(7))

print("CollatzIterativo:")
print(CollatzIterativo(7))