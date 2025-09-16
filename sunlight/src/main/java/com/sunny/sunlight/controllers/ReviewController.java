package com.sunny.sunlight.controllers;


import com.sunny.sunlight.dto.ReviewDTO;
import com.sunny.sunlight.model.Item;
import com.sunny.sunlight.model.Review;
import com.sunny.sunlight.model.UserAccount;
import com.sunny.sunlight.repo.ItemRepository;
import com.sunny.sunlight.repo.ReviewRepository;
import com.sunny.sunlight.repo.UserAccountRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ReviewController {

	private final ReviewRepository reviews;
	private final ItemRepository items;
	private final UserAccountRepository users;

	public ReviewController(ReviewRepository reviews, ItemRepository items, UserAccountRepository users) {
		this.reviews = reviews; this.items = items; this.users = users;
	}

	@PostMapping("/reviews")
	public ResponseEntity<Review> create(@RequestBody @Valid ReviewDTO dto) {
		Item item = items.findById(dto.itemId()).orElse(null);
		UserAccount user = users.findById(dto.userId()).orElse(null);
		if (item == null || user == null) return ResponseEntity.badRequest().build();

		double clamped = Math.max(1.0, Math.min(5.0, dto.rating()));
		BigDecimal rating = new BigDecimal(String.format("%.1f", clamped));

		Review r = new Review();
		r.setItem(item);
		r.setUser(user);
		r.setRating(rating);
		r.setDescription(dto.description());

		Review saved = reviews.save(r);
		return ResponseEntity.created(URI.create("/api/reviews/" + saved.getId())).body(saved);
	}

	@GetMapping("/items/{itemId}/reviews")
	public ResponseEntity<List<Review>> forItem(@PathVariable Long itemId) {
		Item item = items.findById(itemId).orElse(null);
		if (item == null) return ResponseEntity.notFound().build();
		return ResponseEntity.ok(reviews.findByItem(item));
	}
}