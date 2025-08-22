package project.OnlineTrainingProgram.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.OnlineTrainingProgram.Dao.UserTrainingAllocationDAO;
import project.OnlineTrainingProgram.Model.UserTrainingAllocationModel;

import java.util.List;


@Service
public class UserTrainingAllocationService {

    @Autowired
    private UserTrainingAllocationDAO allocationDAO;

    public void saveAllocation(UserTrainingAllocationModel allocationModel) {
        allocationDAO.save(allocationModel);
    }

    public UserTrainingAllocationModel getAllocationById(int id) {
        return allocationDAO.getAllocationById(id);
    }
    public List<UserTrainingAllocationModel> getAllocationsByUserId(int userId) {
        return allocationDAO.getAllocationsByUserId(userId); 
    }
    
    public List<UserTrainingAllocationModel> getAllAllocations() {
        return allocationDAO.getAllAllocations();
    }

    public void deleteAllocation(int id) {
        allocationDAO.delete(id);
    }
}
