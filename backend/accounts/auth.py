import email

from rest_framework.exceptions import AuthenticationFailed, APIException

from django.contrib.auth.hashers import check_password, make_password

from accounts.models import User

from companies.models import Employee, Enterprise

class Authentication:
    def signin(self, email=None, password=None) -> User:
        exception_auth = AuthenticationFailed("Email e/ou senha incorreto(s)")

        user = User.objects.filter(email=email).first()

        if not user or not check_password(password, user.password):
            raise exception_auth
        
        if not check_password(password, user.password):
            raise exception_auth
        
        return user
    
    def signup(self, name=None, email=None, password=None, type_account="owner", company_id=False) -> User:
        if not name or name == '':
            raise APIException("O nome não deve ser null")
        if not email or email == '':
            raise APIException("O email não deve ser null")
        if not password or password == '':
            raise APIException("A password não deve ser null")
        
        if type_account == "employee" and not company_id:
            raise APIException("O id da empresa não deve ser null")
        
        user = User
        if user.objects.filter(email=email).exists():
            raise APIException("Este email já existe na plataforma")
        
        password_hash = make_password(password)

        created_user = User.objects.create(
            name=name,
            email=email,
            password=password_hash,
            is_owner=0 if type_account == "employee" else 1
        )

        if type_account == "owner":
            created_enterprise = Enterprise.objects.create(
                name="Nome da empresa",
                user_id=created_user.id
            )

        if type_account == "employee":
            Employee.objects.create(
                enterprise_id=company_id or created_enterprise.id,
                user_id=created_user.id
            )
        
        return created_user