from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import utils, database, models, oauth2, schemas
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import Response
from sqlalchemy import func
from datetime import datetime
import unicodedata

router = APIRouter()


@router.post("/login", response_model=schemas.Token)
def login(
    user_credentials: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(database.get_db),
):
    user = (
        db.query(models.User)
        .filter(func.lower(models.User.msv) == func.lower(user_credentials.username))
        .first()
    )

    if not user or not utils.verify_password(user_credentials.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Thông tin đăng nhập không chính xác.",
        )

    access_token = oauth2.create_access_token(data={"user_id": user.id})

    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    if db.query(models.User).filter(models.User.msv == user.msv).first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="MSV đã được sử dụng."
        )

    year_code = int(user.msv[1:3])
    major_code = user.msv[5:7]
    major_map = {
        "at": "An toàn thông tin",
        "cn": "Công nghệ thông tin",
        "kh": "Khoa học máy tính",
    }

    user.msv = user.msv.upper()
    user.password = utils.hash_password(user.password)
    user.major = major_map.get(major_code.lower(), "Ngành không xác định")
    user.birth_year = 2000 + year_code - 18
    user.created_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    user.full_name = user.full_name.title()
    user.faculty = "An toàn thông tin" if major_code == "at" else "Công nghệ thông tin"

    full_name_no_accents = "".join(
        c
        for c in unicodedata.normalize("NFKD", user.full_name)
        if not unicodedata.combining(c)
    )
    full_name_no_accents = full_name_no_accents.replace("Đ", "D").replace("đ", "d")
    ten_list = full_name_no_accents.split()

    ten_chinh = ten_list[-1]
    chu_cai_dau = "".join(ten[0] for ten in ten_list[:-1])
    user.email = (
        ten_chinh + chu_cai_dau + "." + user.msv[:3] + user.msv[5:] + "@stu.ptit.edu.vn"
    )

    new_user = models.User(**user.dict())

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return Response(status_code=status.HTTP_201_CREATED)
