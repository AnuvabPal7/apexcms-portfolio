package com.apexcms.config;

import com.apexcms.model.AdminUser;
import com.apexcms.model.Profile;
import com.apexcms.repository.ProfileRepository;
import com.apexcms.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/** Creates the first admin user and an empty About record on startup if they don't exist yet. */
@Component
public class DataSeeder implements CommandLineRunner {
    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository users;
    private final ProfileRepository profiles;
    private final PasswordEncoder passwordEncoder;
    private final AppProperties props;

    public DataSeeder(UserRepository users, ProfileRepository profiles, PasswordEncoder passwordEncoder, AppProperties props) {
        this.users = users;
        this.profiles = profiles;
        this.passwordEncoder = passwordEncoder;
        this.props = props;
    }

    @Override
    public void run(String... args) {
        if (users.count() == 0) {
            String password = props.admin().password();
            if (password == null || password.isBlank()) {
                log.info("No admin user yet. Create it once via POST /api/auth/setup (see README).");
            } else {
                AdminUser admin = new AdminUser();
                admin.setEmail(props.admin().email());
                admin.setName(props.admin().name());
                admin.setPasswordHash(passwordEncoder.encode(password)); // BCrypt hash, never the plain password
                users.save(admin);
                log.info("Created admin user {}", admin.getEmail());
            }
        }
        if (!profiles.existsById(Profile.SINGLETON_ID)) {
            Profile profile = new Profile();
            profile.setName("Your Name");
            profile.setRoleTitle("Software Engineer");
            profiles.save(profile);
        }
    }
}
