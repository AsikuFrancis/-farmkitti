import enum

class UserRole(str, enum.Enum):
    farmer = "farmer"

print(str(UserRole.farmer))
