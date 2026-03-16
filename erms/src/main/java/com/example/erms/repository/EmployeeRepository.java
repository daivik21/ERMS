package com.example.erms.repository;

import com.example.erms.entity.Employee;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    @Query("SELECT e FROM Employee e WHERE e.salary BETWEEN :minSalary AND :maxSalary")
    List<Employee> findEmployeeBySalaryRange(double minSalary, double maxSalary);

    @Query("SELECT e FROM Employee e WHERE LOWER(e.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Employee> searchEmployeeByName(String name);

}