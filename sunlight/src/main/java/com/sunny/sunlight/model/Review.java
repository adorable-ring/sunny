package com.sunny.sunlight.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Getter @Setter
public class Review {
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotNull
	@DecimalMin(value = "1.0")
	@DecimalMax(value = "5.0")
	@Column(precision = 3, scale = 1)
	private BigDecimal rating;

	@Column(length = 4000)
	private String description;

	@ManyToOne(fetch = FetchType.LAZY)
	@NotNull
	private Item item;

	@ManyToOne(fetch = FetchType.LAZY)
	@NotNull
	private UserAccount user;
}
