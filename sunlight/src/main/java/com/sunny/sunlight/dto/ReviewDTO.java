package com.sunny.sunlight.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public record ReviewDTO(
	@NotNull Long itemId,
	@NotNull Long userId,
	@DecimalMin("1.0") @DecimalMax("5.0") Double rating,
	String description
) {}
