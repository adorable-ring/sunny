package com.sunny.sunlight.controllers;

import com.sunny.sunlight.dto.ItemDTO;
import com.sunny.sunlight.dto.MediaDTO;
import com.sunny.sunlight.model.Category;
import com.sunny.sunlight.model.Item;
import com.sunny.sunlight.model.MediaAsset;
import com.sunny.sunlight.repo.ItemRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/items")
public class ItemController {

	private final ItemRepository items;

	public ItemController(ItemRepository items) { this.items = items; }

	@PostMapping
	public ResponseEntity<Item> create(@RequestBody @Valid ItemDTO dto) {
		if (dto.mediaAssets() != null && dto.mediaAssets().size() > 3) {
			return ResponseEntity.badRequest().build();
		}
		Item i = new Item();
		i.setTitle(dto.title());
		i.setDescription(dto.description());
		i.setCategory(dto.category());

		if (dto.mediaAssets() != null) {
			for (MediaDTO m : dto.mediaAssets()) {
				MediaAsset asset = new MediaAsset();
				asset.setUrl(m.url());
				asset.setType(m.type());
				asset.setItem(i);
				i.getMediaAssets().add(asset);
			}
		}
		Item saved = items.save(i);
		return ResponseEntity.created(URI.create("/api/items/" + saved.getId())).body(saved);
	}

	@GetMapping
	public List<Item> list(@RequestParam(required = false) Category category) {
		return category == null ? items.findAll() : items.findByCategory(category);
	}
}
