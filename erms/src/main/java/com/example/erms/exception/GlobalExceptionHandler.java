package com.example.erms.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.erms.payload.ApiResponse;

import org.springframework.web.bind.MethodArgumentNotValidException;

@RestControllerAdvice
public class GlobalExceptionHandler {

        // 🔴 Resource not found
        @ExceptionHandler(ResourceNotFoundException.class)
        public ResponseEntity<ApiResponse<String>> handleNotFound(
                        ResourceNotFoundException ex) {

                ApiResponse<String> response = new ApiResponse<>(false, ex.getMessage(), null);
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }

        // 🔴 Validation errors
        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<String> handleValidation(
                        MethodArgumentNotValidException ex) {

                String error = ex.getBindingResult()
                                .getFieldError()
                                .getDefaultMessage();

                return new ResponseEntity<>(error,
                                HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(DuplicateResourceException.class)
        public ResponseEntity<ApiResponse<String>> handleDuplicate(
                        DuplicateResourceException ex) {

                ApiResponse<String> response = new ApiResponse<>(false, ex.getMessage(), null);

                return new ResponseEntity<>(response, HttpStatus.CONFLICT);
        }

        // 🔴 Any other error
        @ExceptionHandler(Exception.class)
        public ResponseEntity<String> handleGeneral(Exception ex) {

                ex.printStackTrace(); // 🔥 This will show error in console

                return new ResponseEntity<>(ex.getMessage(),
                                HttpStatus.INTERNAL_SERVER_ERROR);
        }
}
