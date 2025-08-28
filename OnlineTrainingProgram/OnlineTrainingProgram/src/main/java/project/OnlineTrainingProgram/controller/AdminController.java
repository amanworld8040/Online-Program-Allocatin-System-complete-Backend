package project.OnlineTrainingProgram.controller;
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

    // 1. Get all users
    @GetMapping("/users")
    public ResponseEntity<List<UserModel>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // 2. Get all trainings
    @GetMapping("/trainings")
    public ResponseEntity<List<TrainingModel>> getAllTrainings() {
        return ResponseEntity.ok(trainingService.getAllTrainings());
    }

    // 3. Add new training
    @PostMapping("/trainings")
    public ResponseEntity<?> addTraining(@RequestBody TrainingModel training) {
        trainingService.saveTraining(training);
        return ResponseEntity.ok(Map.of("success", true, "message", "Training added successfully"));
    }

    // 4. Delete training
    @DeleteMapping("/trainings/{id}")
    public ResponseEntity<?> deleteTraining(@PathVariable int id) {
        trainingService.deleteTraining(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Training deleted successfully"));
    }

    // 5. Delete user
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable int id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "User deleted successfully"));
    }

    // 6. View all allocations
    @GetMapping("/allocations")
    public ResponseEntity<?> getAllAllocations() {
        return ResponseEntity.ok(allocationService.getAllAllocations());
    }

    // 7. Delete allocation (enrollment)
    @DeleteMapping("/allocations/{id}")
    public ResponseEntity<?> deleteAllocation(@PathVariable int id) {
        allocationService.deleteAllocation(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Enrollment deleted successfully"));
    }
}
