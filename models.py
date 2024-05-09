from pydantic import BaseModel

class User(BaseModel):
    nome: str
    cognome: str
    email: str
    password: str