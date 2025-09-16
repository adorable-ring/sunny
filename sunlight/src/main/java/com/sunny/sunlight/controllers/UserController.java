package com.sunny.sunlight.controllers;


import com.sunny.sunlight.dto.UserDTO;
import com.sunny.sunlight.model.UserAccount;
import com.sunny.sunlight.repo.UserAccountRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

	private final UserAccountRepository users;

	public UserController(UserAccountRepository users) { this.users = users; }

	@PostMapping
	public ResponseEntity<UserAccount> create(@RequestBody @Valid UserDTO dto) {
		UserAccount u = new UserAccount();
		u.setUsername(dto.username());
		u.setEmail(dto.email());
		UserAccount saved = users.save(u);
		return ResponseEntity.created(URI.create("/api/users/" + saved.getId())).body(saved);
	}

	@GetMapping
	public List<UserAccount> list() {
		return users.findAll();
	}
}
