import { Component, OnInit, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Auth } from "../../core/services/auth";
import { UserService } from "../../services/user";

@Component({
  selector: "app-printer-profile",
  imports: [FormsModule],
  templateUrl: "./profile.html",
  styleUrl: "./profile.css"
})
export class PrinterProfile implements OnInit {
  auth = inject(Auth);
  private userService = inject(UserService);

  firstName = "";
  lastName = "";
  phone = "";
  email = "";
  companyName = "";
  address = "";
  city = "";
  profileImageFile: File | null = null;

  saving = false;
  saveMessage = "";

  ngOnInit() {
    const user = this.auth.user();
    if (user) {
      this.firstName = user.firstName;
      this.lastName = user.lastName;
      this.phone = user.phone;
      this.email = user.email;
      this.companyName = user.companyName || "";
      this.address = user.address || "";
      this.city = user.city || "";
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.profileImageFile = input.files && input.files.length ? input.files[0] : null;
  }

  save() {
    this.saving = true;
    this.saveMessage = "";
    const formData = new FormData();
    formData.append("firstName", this.firstName);
    formData.append("lastName", this.lastName);
    formData.append("phone", this.phone);
    formData.append("email", this.email);
    formData.append("companyName", this.companyName);
    formData.append("address", this.address);
    formData.append("city", this.city);
    if (this.profileImageFile) {
      formData.append("profileImage", this.profileImageFile);
    }

    this.userService.updateMe(formData).subscribe({
      next: (user) => {
        this.saving = false;
        this.saveMessage = "Podaci su sačuvani.";
        this.auth.updateUser(user);
      },
      error: (err) => {
        this.saving = false;
        this.saveMessage = err?.error?.message || "Greška pri čuvanju";
      }
    });
  }
}
