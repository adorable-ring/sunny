package com.sunny.sunlight.dto;

import com.sunny.sunlight.model.MediaType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record MediaDTO(
	@NotBlank String url,
	@NotNull MediaType type
) {}
