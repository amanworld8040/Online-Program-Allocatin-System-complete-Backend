package project.OnlineTrainingProgram.controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import project.OnlineTrainingProgram.Model.TrainingModel;
import project.OnlineTrainingProgram.Model.UserTrainingAllocationModel;
import project.OnlineTrainingProgram.Service.TrainingService;
import project.OnlineTrainingProgram.Service.UserService;
import project.OnlineTrainingProgram.Service.UserTrainingAllocationService;

/**
 * User Dashboard Controller
 * Handles APIs for:
 * 1. View Available Trainings
 * 2. Enroll in Training
 * 3. View User's Trainings
 * 4. Cancel Enrollment
 * 5. Logout
 */
@RestController
@RequestMapping("/api/user")
public class UserDashBoardController {

    @Autowired
    private UserService userService;

    @Autowired
    private TrainingService trainingService;

    @Autowired
    private UserTrainingAllocationService allocationService;

    // 1. View Available Trainings
    @GetMapping("/trainings")
    public ResponseEntity<?> getAvailableTrainings() {
        try {
            List<TrainingModel> trainings = trainingService.getAllTrainings();
            if (trainings == null) trainings = Collections.emptyList();
            return ResponseEntity.ok(Map.of("success", true, "trainings", trainings));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "message", "Server error: " + e.getMessage()));
        }
    }

    // 2. Enroll in a Training
    @PostMapping("/enroll")
    public ResponseEntity<?> enrollInTraining(@RequestBody Map<String, String> body) {
        try {
            if (body == null || !body.containsKey("userId") || !body.containsKey("trainingId")) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "userId and trainingId required"));
            }

            int userId, trainingId;
            try {
                userId = Integer.parseInt(body.get("userId"));
                trainingId = Integer.parseInt(body.get("trainingId"));
            } catch (NumberFormatException nfe) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Invalid numeric id"));
            }

            if (userService.getUserById(userId) == null) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "User not found"));
            }

            TrainingModel training = trainingService.getProgramById(trainingId);
            if (training == null) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Training not found"));
            }

            // Check existing allocations for user
            List<UserTrainingAllocationModel> existing = allocationService.getAllocationsByUserId(userId);
            if (existing != null && existing.stream().anyMatch(a -> a.getProgramId() == trainingId)) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Already enrolled"));
            }

            UserTrainingAllocationModel allocation = new UserTrainingAllocationModel();
            allocation.setUserId(userId);
            allocation.setProgramId(trainingId);
            allocation.setAllocationDate(LocalDate.now());

            allocationService.saveAllocation(allocation);

            return ResponseEntity.ok(Map.of("success", true, "message", "User enrolled successfully", "trainingId", trainingId));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "message", "Server error: " + e.getMessage()));
        }
    }

    // 3. View My Trainings
    @GetMapping("/my-trainings/{userId}")
    public ResponseEntity<?> viewMyTrainings(@PathVariable int userId) {
        try {
            if (userService.getUserById(userId) == null) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "User not found"));
            }

            List<UserTrainingAllocationModel> allocations = allocationService.getAllocationsByUserId(userId);
            if (allocations == null) allocations = new ArrayList<>();

            return ResponseEntity.ok(Map.of("success", true, "trainings", allocations));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "message", "Server error: " + e.getMessage()));
        }
    }

    // 4. Cancel My Enrollment
    @DeleteMapping("/cancel-enrollment")
    public ResponseEntity<?> cancelEnrollment(@RequestBody Map<String, String> body) {
        try {
            if (body == null || !body.containsKey("userId") || !body.containsKey("trainingId")) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "userId and trainingId required"));
            }

            int userId, trainingId;
            try {
                userId = Integer.parseInt(body.get("userId"));
                trainingId = Integer.parseInt(body.get("trainingId"));
            } catch (NumberFormatException nfe) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Invalid numeric id"));
            }

            boolean existed = allocationService.deleteAllocation(userId, trainingId);
            if (!existed) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Enrollment not found"));
            }

            return ResponseEntity.ok(Map.of("success", true, "message", "Enrollment cancelled"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "message", "Server error: " + e.getMessage()));
        }
    }

    // 5. Logout
    @GetMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(Map.of("success", true, "message", "User logged out"));
    }
}