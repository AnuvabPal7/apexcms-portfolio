package com.apexcms.controller;

import com.apexcms.service.AuthService;
import com.apexcms.service.AuthService.AuthResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    public record LoginRequest(@NotBlank String email, @NotBlank String password) {}
    public record RefreshRequest(@NotBlank String refreshToken) {}
    // BCrypt only uses the first 72 bytes of a password, hence max = 72.
    public record SetupRequest(
            @NotBlank @Size(max = 100) String name,
            @NotBlank @Email @Size(max = 200) String email,
            @NotBlank @Size(min = 10, max = 72, message = "Password must be 10-72 characters") String password) {}
    public record SetupStatus(boolean setupRequired) {}
    public record AccountRequest(
            @NotBlank String currentPassword,
            @Size(max = 100) String name,
            @Email @Size(max = 200) String email,
            @Size(min = 10, max = 72, message = "New password must be 10-72 characters") String newPassword) {}

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request.email(), request.password());
    }

    @GetMapping("/setup-status")
    public SetupStatus setupStatus() {
        return new SetupStatus(authService.isSetupRequired());
    }

    @PostMapping("/setup")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse setup(@Valid @RequestBody SetupRequest request) {
        return authService.setup(request.name(), request.email(), request.password());
    }

    /** Requires a valid access token (see SecurityConfig). */
    @PutMapping("/account")
    public AuthResponse updateAccount(Authentication authentication, @Valid @RequestBody AccountRequest request) {
        return authService.updateAccount(authentication.getName(), request.currentPassword(),
                request.name(), request.email(), request.newPassword());
    }

    @PostMapping("/refresh")
    public AuthResponse refresh(@Valid @RequestBody RefreshRequest request) {
        return authService.refresh(request.refreshToken());
    }
}
