from pydantic import BaseModel

class User(BaseModel):
    id: int
    nome: str
    cognome: str
    email: str
    password: str
    
class Old_New_User(BaseModel):
    old: User
    new: User
    
class Item(BaseModel):
    id: int
    nome: str
    tipo: str
    costo: float
    disponibilità: int

class Old_New_Item(BaseModel):
    old: Item
    new: Item
    
class Cart_Item(BaseModel):
    id_utente: int
    id_prodotto: int
    quantità: int

class User_id(BaseModel):
    id_utente: int