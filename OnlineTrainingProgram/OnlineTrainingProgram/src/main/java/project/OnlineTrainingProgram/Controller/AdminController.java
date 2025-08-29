package project.OnlineTrainingProgram.Controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import project.OnlineTrainingProgram.Model.TrainingModel;
import project.OnlineTrainingProgram.Model.UserModel;
import project.OnlineTrainingProgram.Service.TrainingService;
import project.OnlineTrainingProgram.Service.UserService;
import project.OnlineTrainingProgram.Service.UserTrainingAllocationService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private TrainingService trainingService;

    @Autowired
    private UserTrainingAllocationService allocationService;

    // Helper method to check if user is admin
    private boolean isUserAdmin(int userId) {
        UserModel user = userService.getUserById(userId);
        return user != null && "ADMIN".equals(user.getRole());
    }

    // 1. Get all users (Admin only)
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(@RequestParam(required = false) Integer userId) {
        if (userId == null || !isUserAdmin(userId)) {
            return ResponseEntity.status(403).body(Map.of("success", false, "message", "Admin access required"));
        }
        return ResponseEntity.ok(Map.of("success", true, "users", userService.getAllUsers()));
    }

    // 2. Get all trainings (Admin only)
    @GetMapping("/trainings")
    public ResponseEntity<?> getAllTrainings(@RequestParam(required = false) Integer userId) {
        if (userId == null || !isUserAdmin(userId)) {
            return ResponseEntity.status(403).body(Map.of("success", false, "message", "Admin access required"));
        }
        return ResponseEntity.ok(Map.of("success", true, "trainings", trainingService.getAllTrainings()));
    }

    // 3. Add new training (Admin only)
    @PostMapping("/trainings")
    public ResponseEntity<?> addTraining(@RequestBody Map<String, Object> request) {
        Integer userId = (Integer) request.get("userId");
        if (userId == null || !isUserAdmin(userId)) {
            return ResponseEntity.status(403).body(Map.of("success", false, "message", "Admin access required"));
        }

        try {
            TrainingModel training = new TrainingModel();
            training.setProgramName((String) request.get("programName"));
            training.setDescription((String) request.get("description"));
            training.setPrice(Double.parseDouble(request.get("price").toString()));
            training.setStatus((String) request.getOrDefault("status", "ACTIVE"));
            
            trainingService.saveTraining(training);
            return ResponseEntity.ok(Map.of("success", true, "message", "Training added successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "message", "Error adding training: " + e.getMessage()));
        }
    }

    // 4. Update training (Admin only)
    @PutMapping("/trainings/{id}")
    public ResponseEntity<?> updateTraining(@PathVariable int id, @RequestBody Map<String, Object> request) {
        Integer userId = (Integer) request.get("userId");
        if (userId == null || !isUserAdmin(userId)) {
            return ResponseEntity.status(403).body(Map.of("success", false, "message", "Admin access required"));
        }

        try {
            TrainingModel existing = trainingService.getProgramById(id);
            if (existing == null) {
                return ResponseEntity.status(404).body(Map.of("success", false, "message", "Training not found"));
            }

            existing.setProgramName((String) request.getOrDefault("programName", existing.getProgramName()));
            existing.setDescription((String) request.getOrDefault("description", existing.getDescription()));
            existing.setPrice(request.containsKey("price") ? Double.parseDouble(request.get("price").toString()) : existing.getPrice());
            existing.setStatus((String) request.getOrDefault("status", existing.getStatus()));
            
            trainingService.saveTraining(existing);
            return ResponseEntity.ok(Map.of("success", true, "message", "Training updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "message", "Error updating training: " + e.getMessage()));
        }
    }

    // 5. Delete training (Admin only)
    @DeleteMapping("/trainings/{id}")
    public ResponseEntity<?> deleteTraining(@PathVariable int id, @RequestParam(required = false) Integer userId) {
        if (userId == null || !isUserAdmin(userId)) {
            return ResponseEntity.status(403).body(Map.of("success", false, "message", "Admin access required"));
        }
        try {
            trainingService.deleteTraining(id);
            return ResponseEntity.ok(Map.of("success", true, "message", "Training deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "message", "Error deleting training: " + e.getMessage()));
        }
    }

    // 6. Add/Update user (Admin only)
    @PostMapping("/users")
    public ResponseEntity<?> saveUser(@RequestBody Map<String, Object> request) {
        Integer adminUserId = (Integer) request.get("adminUserId");
        if (adminUserId == null || !isUserAdmin(adminUserId)) {
            return ResponseEntity.status(403).body(Map.of("success", false, "message", "Admin access required"));
        }

        try {
            UserModel user = new UserModel();
            if (request.containsKey("userId")) {
                user.setUserId((Integer) request.get("userId"));
            }
            user.setName((String) request.get("name"));
            user.setEmail((String) request.get("email"));
            user.setPhoneNo((String) request.get("phoneNo"));
            user.setPassword((String) request.get("password"));
            user.setRole((String) request.getOrDefault("role", "USER"));
            
            userService.saveUser(user);
            return ResponseEntity.ok(Map.of("success", true, "message", "User saved successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "message", "Error saving user: " + e.getMessage()));
        }
    }

    // 7. Delete user (Admin only)
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable int id, @RequestParam(required = false) Integer userId) {
        if (userId == null || !isUserAdmin(userId)) {
            return ResponseEntity.status(403).body(Map.of("success", false, "message", "Admin access required"));
        }
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok(Map.of("success", true, "message", "User deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "message", "Error deleting user: " + e.getMessage()));
        }
    }

    // 8. View all allocations (Admin only)
    @GetMapping("/allocations")
    public ResponseEntity<?> getAllAllocations(@RequestParam(required = false) Integer userId) {
        if (userId == null || !isUserAdmin(userId)) {
            return ResponseEntity.status(403).body(Map.of("success", false, "message", "Admin access required"));
        }
        return ResponseEntity.ok(Map.of("success", true, "allocations", allocationService.getAllAllocations()));
    }

    // 9. Delete allocation (enrollment) (Admin only)
    @DeleteMapping("/allocations/{id}")
    public ResponseEntity<?> deleteAllocation(@PathVariable int id, @RequestParam(required = false) Integer userId) {
        if (userId == null || !isUserAdmin(userId)) {
            return ResponseEntity.status(403).body(Map.of("success", false, "message", "Admin access required"));
        }
        try {
            allocationService.deleteAllocation(id);
            return ResponseEntity.ok(Map.of("success", true, "message", "Enrollment deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "message", "Error deleting enrollment: " + e.getMessage()));
        }
    }
}
