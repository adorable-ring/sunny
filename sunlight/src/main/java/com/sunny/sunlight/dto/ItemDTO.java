package com.sunny.sunlight.dto;

import com.sunny.sunlight.model.Category;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record ItemDTO(
	@NotBlank String title,
	String description,
	@NotNull Category category,
	@Valid List<MediaDTO> mediaAssets
) {}
