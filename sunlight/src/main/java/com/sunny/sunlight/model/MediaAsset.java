package com.sunny.sunlight.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
public class MediaAsset {
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank
	private String url;

	@Enumerated(EnumType.STRING)
	private MediaType type = MediaType.IMAGE;

	@ManyToOne(fetch = FetchType.LAZY)
	private Item item;
}
