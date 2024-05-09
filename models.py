from pydantic import BaseModel

class User(BaseModel):
    nome: str
    cognome: str
    email: str
    password: str
    
class Old_New_User(BaseModel):
    old: User
    new: User