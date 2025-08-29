package project.OnlineTrainingProgram.Controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import project.OnlineTrainingProgram.Model.UserModel;
import project.OnlineTrainingProgram.Service.UserService;

@RestController
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/api/signup")
    public ResponseEntity<?> signup(@RequestBody(required = false) Map<String, String> body) {
        if (body == null) body = new HashMap<>();
        String email = body.getOrDefault("email", "").toLowerCase().trim();
        String password = body.getOrDefault("password", "").trim();
        String name = body.getOrDefault("name", "").trim();
        String role = body.getOrDefault("role", "USER").toUpperCase().trim();

        if (email.isBlank() || password.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Email and password are required"
            ));
        }

        // Validate role
        if (!role.equals("USER") && !role.equals("ADMIN")) {
            role = "USER"; // Default to USER for invalid roles
        }

        // check existing in DB via service
        UserModel existing = userService.getUserByEmail(email);
        if (existing != null) {
            return ResponseEntity.status(409).body(Map.of(
                    "success", false,
                    "message", "Email already exists"
            ));
        }

        // create and save user (replace with hashing in production)
        UserModel user = new UserModel();
        user.setEmail(email);
        user.setPassword(password);
        user.setName(name.isEmpty() ? email.split("@")[0] : name); // Use email prefix if no name provided
        user.setRole(role);
        userService.saveUser(user);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "user", Map.of(
                        "userId", user.getUserId(),
                        "email", user.getEmail(),
                        "name", user.getName(),
                        "role", user.getRole()
                ),
                "token", "demo-token"
        ));
    }

    @PostMapping("/api/login")
    public ResponseEntity<?> login(@RequestBody(required = false) Map<String, String> body) {
        if (body == null) body = new HashMap<>();
        String email = body.getOrDefault("email", "").toLowerCase().trim();
        String password = body.getOrDefault("password", "").trim();

        if (email.isBlank() || password.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Email and password are required"
            ));
        }

        // prefer authenticate if implemented
        UserModel authenticated = userService.authenticate(email, password);
        if (authenticated == null) {
            // fallback: try fetch by email and compare password
            UserModel stored = userService.getUserByEmail(email);
            if (stored == null || !password.equals(stored.getPassword())) {
                return ResponseEntity.status(401).body(Map.of(
                        "success", false,
                        "message", "Invalid credentials"
                ));
            }
            authenticated = stored;
        }

        return ResponseEntity.ok(Map.of(
                "success", true,
                "user", Map.of(
                        "userId", authenticated.getUserId(),
                        "email", authenticated.getEmail(),
                        "name", authenticated.getName() != null ? authenticated.getName() : authenticated.getEmail().split("@")[0],
                        "role", authenticated.getRole() != null ? authenticated.getRole() : "USER"
                ),
                "token", "demo-token"
        ));
    }

    @PostMapping("/api/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Logged out successfully"
        ));
    }
}
