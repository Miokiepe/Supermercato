from fastapi import FastAPI
import uvicorn
from models import *
app = FastAPI()

app.add_middleware(
    "*", #Modificare con le rotte /api/...
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET","POST","PUT","DELETE"],
    allow_headers=["*"],
)

@app.post('/api/create_account')
def create(utente: User):
pass    

if __name__ == "__main__":
    uvicorn.run("server:app", port=5000, log_level="info")