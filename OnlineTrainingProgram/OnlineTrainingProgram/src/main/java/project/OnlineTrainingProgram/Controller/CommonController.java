package project.OnlineTrainingProgram.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import project.OnlineTrainingProgram.Model.TrainingModel;
import project.OnlineTrainingProgram.Model.UserModel;
import project.OnlineTrainingProgram.Service.TrainingService;
import project.OnlineTrainingProgram.Service.UserService;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class CommonController {

    @Autowired
    private TrainingService trainingService;

    @Autowired
    private UserService userService;

    // Common trainings endpoint with role-based filtering
    @GetMapping("/trainings")
    public ResponseEntity<?> getTrainings(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Integer userId) {
        try {
            List<TrainingModel> trainings = trainingService.getAllTrainings();
            if (trainings == null) trainings = Collections.emptyList();
            
            // If userId is provided, check user role for filtering
            if (userId != null) {
                UserModel user = userService.getUserById(userId);
                if (user == null) {
                    return ResponseEntity.badRequest().body(Map.of("success", false, "message", "User not found"));
                }
                
                // For regular users, only show active trainings unless specifically requested
                if (!"ADMIN".equals(user.getRole()) && (status == null || status.isEmpty())) {
                    status = "ACTIVE";
                }
            }
            
            // Filter by status if provided
            if (status != null && !status.isEmpty()) {
                final String finalStatus = status;
                trainings = trainings.stream()
                        .filter(training -> finalStatus.equalsIgnoreCase(training.getStatus()))
                        .collect(ArrayList::new, (list, item) -> list.add(item), ArrayList::addAll);
            }
            
            return ResponseEntity.ok(Map.of("success", true, "trainings", trainings));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "message", "Server error: " + e.getMessage()));
        }
    }
}