package com.example.PcStore.service;

import com.example.PcStore.dto.LoginRequest;
import com.example.PcStore.dto.LoginResponse;
import com.example.PcStore.model.User;
import com.example.PcStore.repository.UserRepository;
import com.example.PcStore.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public User registerUser(User user) {
        // Check if username or email already exists
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Encode password and set default role
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("ROLE_USER");
        
        // Save user
        return userRepository.save(user);
    }

    public LoginResponse login(LoginRequest request) {
        try {
            User user = userRepository.findByUsername(request.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
                return new LoginResponse(
                    user.getUsername(),
                    user.getFullname(),
                    "Login successful",
                    true,
                    user.getRole(),
                    token
                );
            } else {
                return new LoginResponse(
                    null,
                    null,
                    "Invalid password",
                    false,
                    null,
                    null
                );
            }
        } catch (Exception e) {
            return new LoginResponse(
                null,
                null,
                e.getMessage(),
                false,
                null,
                null
            );
        }
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}