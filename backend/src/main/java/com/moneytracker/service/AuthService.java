package com.moneytracker.service;

import com.moneytracker.config.JwtUtils;
import com.moneytracker.dto.*;
import com.moneytracker.entity.User;
import com.moneytracker.exception.BadRequestException;
import com.moneytracker.exception.ResourceNotFoundException;
import com.moneytracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new BadRequestException("Email address is already registered: " + request.getEmail());
        }

        User user = new User(
                request.getEmail().toLowerCase().trim(),
                passwordEncoder.encode(request.getPassword()),
                request.getFullName().trim(),
                request.getCurrency() != null ? request.getCurrency().trim() : "USD"
        );

        user = userRepository.save(user);
        String token = jwtUtils.generateToken(user.getEmail());

        return new AuthResponse(token, new UserDto(user));
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        String token = jwtUtils.generateToken(user.getEmail());
        return new AuthResponse(token, new UserDto(user));
    }

    public UserDto getCurrentUser(User user) {
        User refreshed = userRepository.findById(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return new UserDto(refreshed);
    }

    @Transactional
    public UserDto updateCurrency(User user, UpdateCurrencyRequest request) {
        User existing = userRepository.findById(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        existing.setCurrency(request.getCurrency());
        existing = userRepository.save(existing);
        return new UserDto(existing);
    }
}

