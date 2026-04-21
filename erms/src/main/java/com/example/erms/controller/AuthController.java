package com.example.erms.controller;

import com.example.erms.entity.User;
import com.example.erms.payload.ApiResponse;
import com.example.erms.security.JwtUtil;
import com.example.erms.service.UserService;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // 🔐 Register API
    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.registerUser(user);
    }

    // 🔐 Login API (returns JWT)
    @PostMapping("/login")
    public ApiResponse<String> login(@RequestBody User user) {

        User existingUser = userService.findByUsername(user.getUsername());

        if (existingUser == null) {
            throw new RuntimeException("User not found");
        }

        if (!passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) {
            throw new BadCredentialsException("Invalid password");
        }
        System.out.println("RAW PASSWORD: " + user.getPassword());
        System.out.println("DB PASSWORD: " + existingUser.getPassword());
        System.out.println("MATCH: " + passwordEncoder.matches(user.getPassword(), existingUser.getPassword()));

        // 🔥 RETURN TOKEN
        String token = jwtUtil.generateToken(existingUser.getUsername(), existingUser.getRole());
        return new ApiResponse<>(true, "Login successful", token);
    }
}