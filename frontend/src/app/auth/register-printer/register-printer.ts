import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { Auth } from "../../core/services/auth";
import { PASSWORD_HINT, PASSWORD_REGEX, PIB_REGEX, REGISTRATION_NUMBER_REGEX } from "../../core/validators";

@Component({
  selector: "app-register-printer",
  imports: [FormsModule, RouterLink],
  templateUrl: "./register-printer.html",
  styleUrl: "./register-printer.css"
})
export class RegisterPrinter {
  private auth = inject(Auth);
  private router = inject(Router);

  username = "";
  password = "";
  firstName = "";
  lastName = "";
  phone = "";
  email = "";
  companyName = "";
  address = "";
  city = "";
  registrationNumber = "";
  pib = "";
  profileImageFile: File | null = null;

  passwordHint = PASSWORD_HINT;
  errorMessage = "";
  successMessage = "";
  loading = false;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.profileImageFile = input.files && input.files.length ? input.files[0] : null;
  }

  private validate(): string | null {
    if (!PASSWORD_REGEX.test(this.password)) {
      return this.passwordHint;
    }
    if (!REGISTRATION_NUMBER_REGEX.test(this.registrationNumber)) {
      return "Matični broj mora imati tačno 8 cifara";
    }
    if (!PIB_REGEX.test(this.pib)) {
      return "PIB mora imati 9 cifara i ne sme počinjati nulom";
    }
    return null;
  }

  submit() {
    this.errorMessage = "";
    this.successMessage = "";

    const validationError = this.validate();
    if (validationError) {
      this.errorMessage = validationError;
      return;
    }

    const formData = new FormData();
    formData.append("username", this.username);
    formData.append("password", this.password);
    formData.append("firstName", this.firstName);
    formData.append("lastName", this.lastName);
    formData.append("phone", this.phone);
    formData.append("email", this.email);
    formData.append("companyName", this.companyName);
    formData.append("address", this.address);
    formData.append("city", this.city);
    formData.append("registrationNumber", this.registrationNumber);
    formData.append("pib", this.pib);
    if (this.profileImageFile) {
      formData.append("profileImage", this.profileImageFile);
    }

    this.loading = true;
    this.auth.registerPrinter(formData).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMessage = res.message;
        setTimeout(() => this.router.navigate(["/login"]), 2500);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || "Greška pri registraciji";
      }
    });
  }
}
