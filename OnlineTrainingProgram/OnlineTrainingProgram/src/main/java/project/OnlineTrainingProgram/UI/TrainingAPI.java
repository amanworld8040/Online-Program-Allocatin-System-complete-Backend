package project.OnlineTrainingProgram.UI;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import project.OnlineTrainingProgram.Model.TrainingModel;
import project.OnlineTrainingProgram.Service.TrainingService;

@RestController
@RequestMapping("/api/training")
public class TrainingAPI {
	
	@Autowired
	private TrainingService trainingService;
	
	@GetMapping
	public String saveTraining(@RequestBody TrainingModel trainingModel) {
		trainingService.saveTraining(trainingModel);
		return "Training program saved successfully!";		
	}
	
	@GetMapping("/{id}")
	public TrainingModel getTrainingById(@PathVariable int id) {
		return trainingService.getTrainingById(id);
	}
	
	public List<TrainingModel>getAllTrainings(){
		return trainingService.getAllTrainings();
		
	}
	
	public String deleteTraining(@PathVariable int id) {
		trainingService.deleteTraining(id);
		return "Training Program Deleted Successfully!";
	}
}
