package com.apexcms.service;

import com.apexcms.exception.BadRequestException;
import com.apexcms.model.AdminUser;
import com.apexcms.repository.UserRepository;
import com.apexcms.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    public record UserInfo(Long id, String email, String name, String role) {}
    public record AuthResponse(String accessToken, String refreshToken, UserInfo user) {}

    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository users, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse login(String email, String password) {
        // Same error for "unknown email" and "wrong password" so attackers can't discover valid emails.
        AdminUser user = users.findByEmailIgnoreCase(email.trim())
                .filter(u -> passwordEncoder.matches(password, u.getPasswordHash()))
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));
        return issueTokens(user);
    }

    public boolean isSetupRequired() {
        return users.count() == 0;
    }

    /**
     * First-run setup: creates the very first admin account. It only works while NO user exists,
     * so once you have created your admin this endpoint is permanently closed (409).
     */
    public synchronized AuthResponse setup(String name, String email, String password) {
        if (users.count() > 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Setup already completed");
        }
        AdminUser admin = new AdminUser();
        admin.setName(name.trim());
        admin.setEmail(email.trim());
        admin.setPasswordHash(passwordEncoder.encode(password)); // BCrypt hash, never the plain password
        return issueTokens(users.save(admin));
    }

    /**
     * Lets the logged-in admin change name, email and/or password. The current password is always required.
     * Returns fresh tokens because the JWT subject is the email, which may have just changed.
     */
    public synchronized AuthResponse updateAccount(String currentEmail, String currentPassword,
                                                   String name, String email, String newPassword) {
        AdminUser user = users.findByEmailIgnoreCase(currentEmail)
                .orElseThrow(() -> new BadCredentialsException("Account not found"));
        if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            throw new BadRequestException("Current password is incorrect");
        }
        if (name != null && !name.isBlank()) {
            user.setName(name.trim());
        }
        if (email != null && !email.isBlank() && !email.trim().equalsIgnoreCase(user.getEmail())) {
            boolean taken = users.findByEmailIgnoreCase(email.trim())
                    .filter(other -> !other.getId().equals(user.getId())).isPresent();
            if (taken) {
                throw new BadRequestException("That email is already in use");
            }
            user.setEmail(email.trim());
        }
        if (newPassword != null && !newPassword.isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(newPassword));
        }
        return issueTokens(users.save(user));
    }

    public AuthResponse refresh(String refreshToken) {
        String email = jwtService.parse(refreshToken, JwtService.REFRESH)
                .orElseThrow(() -> new BadCredentialsException("Invalid or expired refresh token"))
                .getSubject();
        AdminUser user = users.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new BadCredentialsException("Invalid or expired refresh token"));
        return issueTokens(user);
    }

    private AuthResponse issueTokens(AdminUser user) {
        return new AuthResponse(
                jwtService.createAccessToken(user),
                jwtService.createRefreshToken(user),
                new UserInfo(user.getId(), user.getEmail(), user.getName(), user.getRole()));
    }
}
