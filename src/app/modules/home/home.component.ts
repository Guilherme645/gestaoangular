import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';
import { AuthRequest } from 'src/app/models/interfaces/user/auth/AuthRequest';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  loginCard = true;

  loginForm = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

constructor(
  private formBuilder: FormBuilder,
private userService: UserService,
private cookieService: CookieService, 
private messageService: MessageService,
private router: Router
){}

onSubmitLoginForm(): void {
if (this.loginForm.value && this.loginForm.valid) {
  this.userService.authUser(this.loginForm.value as AuthRequest)
  .subscribe({
    next: (response) => {
      if (response) {
        this.cookieService.set('USER_INFO', response?.token);
        this.loginForm.reset();
        this.router.navigate(['/dashboard'])

        // mensagem
        this.messageService.add({
          severity: 'sucess',
          summary: 'Sucesso',
          detail: 'Bem vindo de volta ${response?.name}!',
          life:2000
        });
      }
    },
    error:(err) => {
        this.messageService.add({
          severity: 'sucess',
          summary: 'Err',
          detail: 'Erro ao fazer login!',
          life: 2000,
        });
      console.log(err)
    },
  });

}
}

}
