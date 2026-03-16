package com.example.erms.controller;

import com.example.erms.service.EmployeeService;
import jakarta.validation.Valid;
import com.example.erms.dto.EmployeeDTO;
import com.example.erms.payload.ApiResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import org.springframework.http.HttpStatus; // ✅ FIXED
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<ApiResponse<EmployeeDTO>> createEmployee(
            @Valid @RequestBody EmployeeDTO employeeDto) {

        EmployeeDTO savedEmployee = employeeService.saveEmployee(employeeDto);

        ApiResponse<EmployeeDTO> response = new ApiResponse<>(true, "Employee created successfully", savedEmployee);

        return ResponseEntity.status(HttpStatus.CREATED).body(response); // ✅ REST correct
    }

    @GetMapping("/salary-range")
    public ResponseEntity<ApiResponse<List<EmployeeDTO>>> getEmployeesBySalaryRange(@RequestParam double minSalary,
            @RequestParam double maxSalary) {
        List<EmployeeDTO> employees = employeeService.getEmployeesBySalaryRange(minSalary, maxSalary);

        ApiResponse<List<EmployeeDTO>> response = new ApiResponse<>(true, "Employee retrived successfully", employees);
        return ResponseEntity.ok(response);
    }

    // READ ALL
    // @GetMapping
    // public ResponseEntity<ApiResponse<List<EmployeeDTO>>> getAllEmployees() {

    // List<EmployeeDTO> employees = employeeService.getAllEmployees();

    // ApiResponse<List<EmployeeDTO>> response = new ApiResponse<>(true, "Employees
    // retrieved successfully",
    // employees);

    // return ResponseEntity.ok(response);
    // }

    // pagination
    @GetMapping
    public ResponseEntity<ApiResponse<Page<EmployeeDTO>>> getEmployees(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<EmployeeDTO> employeePage = employeeService.getEmployees(pageable);
        ApiResponse<Page<EmployeeDTO>> response = new ApiResponse<>(true, "Employees retrieved successfully",
                employeePage);
        return ResponseEntity.ok(response);

    }

    // search by name
    @GetMapping("/search-employee")
    public ResponseEntity<ApiResponse<List<EmployeeDTO>>> searchEmployee(
            @RequestParam(defaultValue = "") String name) {
        List<EmployeeDTO> employees = employeeService.searchEmployeeByName(name);

        ApiResponse<List<EmployeeDTO>> response = new ApiResponse<>(true, "Employee retrieved successfully",
                employees);
        return ResponseEntity.ok(response);

    }

    // READ BY ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployeeDTO>> getEmployeeById(@PathVariable Long id) {

        EmployeeDTO employee = employeeService.getEmployeeById(id);

        ApiResponse<EmployeeDTO> response = new ApiResponse<>(true, "Employee retrieved successfully", employee);

        return ResponseEntity.ok(response);
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployeeDTO>> updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody EmployeeDTO employeeDto) {

        EmployeeDTO updatedEmployee = employeeService.updateEmployee(id, employeeDto);

        ApiResponse<EmployeeDTO> response = new ApiResponse<>(true, "Employee updated successfully", updatedEmployee);

        return ResponseEntity.ok(response);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEmployee(@PathVariable Long id) {

        employeeService.deleteEmployee(id);

        ApiResponse<Void> response = new ApiResponse<>(true, "Employee deleted successfully", null);

        return ResponseEntity.ok(response);
    }
}
