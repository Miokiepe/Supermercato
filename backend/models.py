from pydantic import BaseModel
from typing import List

class User(BaseModel):
    id: int | None
    nome: str
    cognome: str
    email: str
    password: str
    autenticato: str = "0"
    genere: int
    cap: str
    città: str
    via: str
    prefisso: str
    numero: str

class Login(BaseModel):
    email: str
    password: str
    role: str
    
class Old_New_User(BaseModel):
    old: User
    new: User
    
class Item(BaseModel):
    id: int | None
    nome: str
    tipo: int
    costo: float
    disponibilità: int
    creazione: str | None

class Old_New_Item(BaseModel):
    old: Item
    new: Item
    
class Cart_Item(BaseModel):
    id_utente: int
    id_prodotto: int
    quantità: int

class Cart_Items(BaseModel):
    items: List[Cart_Item]

class User_id(BaseModel):
    id_utente: int
    
class User_token(BaseModel):
    email: str
    password: str
    token: str
    role: str
