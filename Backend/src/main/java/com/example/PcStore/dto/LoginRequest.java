package com.example.PcStore.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;

    public String getUsername() {
        return username;
    }

    public CharSequence getPassword() {
        return password;
    }
}